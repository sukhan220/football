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
  console.log("BULK CREATE BALL REQUEST RECEIVED");
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
              { folder: "magazine_balls" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(buffer);
          });

          uploadedImageUrl = uploadResult.secure_url;
        } catch (uploadError: any) {
          console.error(`Cloudinary upload failed for card ${card.id}:`, uploadError);
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
    const createdBalls = await prisma.$transaction(async (tx) => {
      const savedList = [];

      for (const card of preparedCards) {
        const inputTitle = card.title || "Untitled Ball";
        const inputDesc = card.description || "";
        const slugValue = slugify(inputTitle, { lower: true, strict: true }) || `ball-${Date.now()}`;

        const newBall = await tx.tournamentMeta.create({
          data: {
            seasonId,
            category: "BALL",
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

        savedList.push(newBall);
      }

      return savedList;
    }, {
      timeout: 15000
    });

    return NextResponse.json({ success: true, data: createdBalls }, { status: 201 });
  } catch (error: any) {
    console.error("BULK CREATE BALL ERROR:", error);
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
      const ball = await prisma.tournamentMeta.findUnique({
        where: { id },
        include: { translations: true }
      });
      if (!ball || ball.category !== "BALL") {
        return NextResponse.json({ success: false, error: "Ball not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: ball });
    }

    const whereClause: any = { category: "BALL" };
    if (seasonId) whereClause.seasonId = seasonId;

    const balls = await prisma.tournamentMeta.findMany({
      where: whereClause,
      orderBy: { displayOrder: "asc" },
      include: { translations: true }
    });

    return NextResponse.json({ success: true, data: balls });
  } catch (error: any) {
    console.error("GET BALL ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ==========================================
// 3. UPDATE (PUT) - ফিক্সড মেথড
// ==========================================
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, year, displayOrder, image, bgGradient, translations } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Ball ID is required for update" }, { status: 400 });
    }

    // ডাটাবেজ ট্রানজেকশনের মাধ্যমে ওল্ড ট্রান্সলেশন ডিলিট এবং নিউ ডাটা আপডেট একসাথে করা হচ্ছে
    const updatedBall = await prisma.$transaction(async (tx) => {
      // ১. আগের সব ট্রান্সলেশন ক্লিন করা
      await tx.metaTranslation.deleteMany({
        where: { metaId: id } // স্কিমা অনুযায়ী এখানে metaId হবে
      });

      const slugBn = slugify(translations.bn.title, { lower: true, strict: true }) || `ball-bn-${Date.now()}`;
      const slugEn = slugify(translations.en.title, { lower: true, strict: true }) || `ball-en-${Date.now()}`;

      // ২. মেইন মেটা ডাটা এবং নতুন ট্রান্সলেশন আপডেট করা
      return await tx.tournamentMeta.update({
        where: { id },
        data: {
          year: Number(year),
          displayOrder: Number(displayOrder),
          image,
          bgGradient,
          // ❌ specifications এখান থেকেও বাদ দেওয়া হয়েছে
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

    return NextResponse.json({ success: true, data: updatedBall });
  } catch (error: any) {
    console.error("UPDATE BALL ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ==========================================
// 4. DELETE (DELETE) - ফিক্সড মেথড
// ==========================================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Ball ID is required for deletion" }, { status: 400 });
    }

    // ট্রানজেকশন দিয়ে ডিপেন্ডেন্ট ডাটা সহ ক্লিন ডিলিট
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

    return NextResponse.json({ success: true, message: "Ball and its translations deleted successfully" });
  } catch (error: any) {
    console.error("DELETE BALL ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}