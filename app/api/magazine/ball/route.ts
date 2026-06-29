//api/magazine/ball/route.ts

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

    const imageFiles = formData.getAll("images") as File[];
    
    const fileMap: Record<string, File> = {};
    imageFiles.forEach((file) => {
      fileMap[file.name] = file;
    });

    for (const card of cardsData) {
      let uploadedImageUrl = "";
      const imageFile = fileMap[card.clientTrackingId] || null;

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
          console.error(`Cloudinary upload failed for card ${card.clientTrackingId}:`, uploadError);
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

    const createdBalls = await prisma.$transaction(async (tx) => {
      const savedList = [];

      for (const card of preparedCards) {
        const inputTitle = card.title || "Untitled Ball";
        const inputDesc = card.description || "";
        const slugValue = slugify(inputTitle, { lower: true, strict: true }) || `ball-${Date.now()}`;

        const bnContentObj = currentLang === "BN" ? { description: inputDesc } : {};
        const enContentObj = currentLang === "EN" ? { description: inputDesc } : {};

        const newBall = await tx.tournamentMeta.create({
          data: {
            seasonId,
            category: "BALL",
            year: Number(card.year) || 2026,
            displayOrder: 0,
            image: card.uploadedImageUrl || null,
            translations: {
              create: [
                {
                  language: "BN",
                  title: currentLang === "BN" ? inputTitle : `BN - ${inputTitle}`,
                  slug: `${slugValue}-bn-${card.year}-${Date.now()}`,
                  content: bnContentObj,
                },
                {
                  language: "EN",
                  title: currentLang === "EN" ? inputTitle : `EN - ${inputTitle}`,
                  slug: `${slugValue}-en-${card.year}-${Date.now()}`,
                  content: enContentObj,
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
// 3. UPDATE (PUT) - 🛠️ ফর্ম-ডাটা ও ক্লাউডিনারি ফিক্সড মেথড
// ==========================================
export async function PUT(request: Request) {
  try {
    // 💡 ফিক্স: request.json() এর বদলে request.formData() ব্যবহার করা হয়েছে
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const seasonId = formData.get("seasonId") as string;
    const categoryId = formData.get("categoryId") as string;
    const currentLang = formData.get("language") as "BN" | "EN";
    const year = formData.get("year") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const existingImageUrl = formData.get("existingImageUrl") as string;
    
    // নতুন কোনো ফাইল আপলোড করা হয়েছে কি না তা চেক করা
    const imageFile = formData.get("image") as File | null;

    if (!id) {
      return NextResponse.json({ success: false, error: "Ball ID is required for update" }, { status: 400 });
    }

    let finalImageUrl = existingImageUrl || null;

    // 📸 যদি নতুন ইমেজ ফাইল পাওয়া যায়, তবে সেটি ক্লাউডিনারিতে আপলোড হবে
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

        finalImageUrl = uploadResult.secure_url;
      } catch (uploadError: any) {
        console.error("Cloudinary upload failed during update:", uploadError);
        return NextResponse.json({ success: false, error: "Image upload failed" }, { status: 502 });
      }
    }

    const updatedBall = await prisma.$transaction(async (tx) => {
      // ১. আগের ট্রান্সলেশন ক্লিন করা
      await tx.metaTranslation.deleteMany({
        where: { metaId: id }
      });

      const slugValue = slugify(title, { lower: true, strict: true }) || `ball-${Date.now()}`;

      // ২. ল্যাঙ্গুয়েজ ডিপেন্ডেন্সি অনুযায়ী Json কনটেন্ট অবজেক্ট বিল্ড করা
      const bnContentObj = currentLang === "BN" ? { description: description } : {};
      const enContentObj = currentLang === "EN" ? { description: description } : {};

      // ৩. মেইন টেবিল আপডেট করা
      return await tx.tournamentMeta.update({
        where: { id },
        data: {
          year: Number(year) || 2026,
          image: finalImageUrl,
          ...(seasonId && { seasonId }),
          translations: {
            create: [
              {
                language: "BN",
                title: currentLang === "BN" ? title : `BN - ${title}`,
                slug: `${slugValue}-bn-${year}-${Date.now()}`,
                content: bnContentObj, // 🛠️ ফিক্সড: টাইপ সেফ অবজেক্ট
              },
              {
                language: "EN",
                title: currentLang === "EN" ? title : `EN - ${title}`,
                slug: `${slugValue}-en-${year}-${Date.now()}`,
                content: enContentObj, // 🛠️ ফিক্সড: টাইপ সেফ অবজেক্ট
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
// 4. DELETE (DELETE)
// ==========================================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Ball ID is required for deletion" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.metaTranslation.deleteMany({
        where: { metaId: id }
      });
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