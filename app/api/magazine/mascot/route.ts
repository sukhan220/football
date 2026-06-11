import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";

// ক্লাউডিনারি কনফিগারেশন
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// 1. BULK CREATE (POST)
// ==========================================
export async function POST(request: Request) {
  console.log("BULK CREATE MASCOT REQUEST RECEIVED");
  try {
    const formData = await request.formData();
    const seasonId = formData.get("seasonId") as string;
    const currentLang = formData.get("language") as "BN" | "EN";
    const cardsDataRaw = formData.get("cardsData") as string;

    if (!seasonId || !cardsDataRaw) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const cardsData = JSON.parse(cardsDataRaw);
    const preparedCards: any[] = [];

    // 🚚 ডাটাবেজ ট্রানজেকশনের বাইরে সব ইমেজ আপলোড আগে শেষ করা হচ্ছে (টাইমআউট ফিক্স)
    for (const card of cardsData) {
      let uploadedImageUrl = "";
      const imageFile = formData.get(`image_${card.id}`) as File | null;

      if (imageFile && imageFile.size > 0) {
        try {
          const arrayBuffer = await imageFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { folder: "magazine_mascots" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(buffer);
          });

          uploadedImageUrl = uploadResult.secure_url;
        } catch (uploadError: any) {
          console.error(`Cloudinary upload failed for mascot card ${card.id}:`, uploadError);
          return NextResponse.json(
            { success: false, error: `Image upload failed: ${uploadError.message}` },
            { status: 502 }
          );
        }
      }

      preparedCards.push({
        ...card,
        uploadedImageUrl
      });
    }

    // ⚡ ডাটাবেজ ট্রানজেকশন স্টার্ট
    const createdMascots = await prisma.$transaction(async (tx) => {
      const savedList = [];

      for (const card of preparedCards) {
        const inputTitle = card.title || "Untitled Mascot";
        const inputDesc = card.description || "";
        const slugValue = slugify(inputTitle, { lower: true, strict: true }) || `mascot-${Date.now()}`;

        const newMascot = await tx.tournamentMeta.create({
          data: {
            seasonId,
            category: "MASCOT", // 🎯 ক্যাটাগরি চেঞ্জ করে MASCOT করা হলো
            year: Number(card.year) || 2026,
            displayOrder: 0,
            image: card.uploadedImageUrl,
            translations: {
              create: [
                {
                  language: "BN",
                  title: currentLang === "BN" ? inputTitle : `BN - ${inputTitle}`,
                  slug: `${slugValue}-bn-${card.year}-${Date.now()}`,
                  content: currentLang === "BN" ? inputDesc : "",
                },
                {
                  language: "EN",
                  title: currentLang === "EN" ? inputTitle : `EN - ${inputTitle}`,
                  slug: `${slugValue}-en-${card.year}-${Date.now()}`,
                  content: currentLang === "EN" ? inputDesc : "",
                }
              ]
            }
          }
        });

        savedList.push(newMascot);
      }

      return savedList;
    }, {
      timeout: 15000
    });

    return NextResponse.json({ success: true, data: createdMascots }, { status: 201 });
  } catch (error: any) {
    console.error("BULK CREATE MASCOT ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Database Transaction Failed" },
      { status: 500 }
    );
  }
}

// ==========================================
// 2. READ (GET)
// ==========================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const seasonId = searchParams.get("seasonId");

    if (id) {
      const mascot = await prisma.tournamentMeta.findUnique({
        where: { id },
        include: { translations: true }
      });
      if (!mascot || mascot.category !== "MASCOT") {
        return NextResponse.json({ success: false, error: "Mascot not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: mascot });
    }

    const whereClause: any = { category: "MASCOT" };
    if (seasonId) whereClause.seasonId = seasonId;

    const mascots = await prisma.tournamentMeta.findMany({
      where: whereClause,
      orderBy: { displayOrder: "asc" },
      include: { translations: true }
    });

    return NextResponse.json({ success: true, data: mascots });
  } catch (error: any) {
    console.error("GET MASCOT ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ==========================================
// 3. UPDATE (PUT)
// ==========================================
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, year, displayOrder, image, bgGradient, translations } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Mascot ID is required for update" }, { status: 400 });
    }

    // ডাটাবেজ ট্রানজেকশনের মাধ্যমে ওল্ড ট্রান্সলেশন ডিলিট এবং নিউ ডাটা আপডেট একসাথে করা হচ্ছে
    const updatedMascot = await prisma.$transaction(async (tx) => {
      // ১. আগের সব ট্রান্সলেশন ক্লিন করা
      await tx.metaTranslation.deleteMany({
        where: { metaId: id }
      });

      const slugBn = slugify(translations.bn.title, { lower: true, strict: true }) || `mascot-bn-${Date.now()}`;
      const slugEn = slugify(translations.en.title, { lower: true, strict: true }) || `mascot-en-${Date.now()}`;

      // ২. মেইন মেটা ডাটা এবং নতুন ট্রান্সলেশন আপডেট করা
      return await tx.tournamentMeta.update({
        where: { id },
        data: {
          year: Number(year),
          displayOrder: Number(displayOrder),
          image,
          bgGradient,
          translations: {
            create: [
              {
                language: "BN",
                title: translations.bn.title,
                subtitle: translations.bn.subtitle || "",
                slug: `${slugBn}-bn-${year}-${Date.now()}`,
                excerpt: translations.bn.excerpt || "",
                content: translations.bn.content || "",
              },
              {
                language: "EN",
                title: translations.en.title,
                subtitle: translations.en.subtitle || "",
                slug: `${slugEn}-en-${year}-${Date.now()}`,
                excerpt: translations.en.excerpt || "",
                content: translations.en.content || "",
              }
            ]
          }
        },
        include: { translations: true }
      });
    });

    return NextResponse.json({ success: true, data: updatedMascot });
  } catch (error: any) {
    console.error("UPDATE MASCOT ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ==========================================
// 4. DELETE (DELETE)
// ==========================================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Mascot ID is required for deletion" }, { status: 400 });
    }

    // ট্রানজেকশন দিয়ে ডিপেন্ডেন্ট ডাটা সহ ক্লিন ডিলিট
    await prisma.$transaction(async (tx) => {
      // প্রথমে চাইল্ড টেবিলের (Translations) ডাটা ডিলিট করতে হবে
      await tx.metaTranslation.deleteMany({
        where: { metaId: id }
      });

      // তারপর প্যারেন্ট টেবিলের (TournamentMeta) ডাটা ডিলিট
      await tx.tournamentMeta.delete({
        where: { id }
      });
    });

    return NextResponse.json({ success: true, message: "Mascot and its translations deleted successfully" });
  } catch (error: any) {
    console.error("DELETE MASCOT ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}