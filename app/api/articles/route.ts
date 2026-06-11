

// // app/api/articles/route.ts
// import { auth } from "@/auth";
// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";

// // আপনার .env ফাইলের নামের সাথে হুবহু ম্যাচ করে কনফিগার করা হলো
// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const allowedRoles = ["ADMIN", "EDITOR", "WRITER"];

// const checkAuthAndRole = async () => {
//   const session = await auth();
//   if (!session?.user) return { error: "Unauthorized", status: 401 };

//   const role = (session.user as any).role;
//   const id = (session.user as any).id;

//   if (!allowedRoles.includes(role)) return { error: "Forbidden", status: 403 };
//   return { userId: id, role };
// };

// /**
//  * Cloudinary URL থেকে Public ID বের করার নিখুঁত ফাংশন
//  * উদাহরণ: https://res.cloudinary.com/.../upload/v12345/sports_portal/filename.jpg
//  * আউটপুট দেবে: sports_portal/filename
//  */
// function getCloudinaryPublicId(url: string): string | null {
//   try {
//     if (!url || !url.includes("cloudinary.com")) return null;
    
//     // '/upload/' এর পরের অংশটুকু আলাদা করা
//     const parts = url.split("/upload/");
//     if (parts.length < 2) return null;

//     // v12345678/sports_portal/filename.jpg অংশটি নেওয়া
//     let cleanPath = parts[1];
//     const pathSegments = cleanPath.split("/");
    
//     // যদি ভার্সন নম্বর (vXXXXXX) থাকে তবে সেটি প্রথম ইনডেক্স থেকে বাদ দেওয়া
//     if (pathSegments[0].startsWith("v") && !isNaN(Number(pathSegments[0].substring(1)))) {
//       pathSegments.shift();
//     }
    
//     // আবার জোড়া লাগিয়ে এক্সটেনশন (.jpg, .png ইত্যাদি) বাদ দেওয়া
//     const fullPath = pathSegments.join("/");
//     const publicId = fullPath.substring(0, fullPath.lastIndexOf("."));
    
//     return publicId; // রিটার্ন করবে: "sports_portal/filename"
//   } catch (error) {
//     console.error("Error parsing Cloudinary Public ID:", error);
//     return null;
//   }
// }

// /**
//  * Cloudinary থেকে সিঙ্গেল ফাইল ডিলিট করার স্ট্যান্ডার্ড ফাংশন
//  * ও যেভাবে রেসপন্স চেক করে মেসেজ দিচ্ছিল, ঠিক সেভাবে ডিজাইন করা হয়েছে
//  */
// async function deleteCloudinaryImage(publicId: string) {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId);
    
//     if (result.result === 'ok') {
//       console.log(`Cloudinary Success: [${publicId}] ছবিটি সফলভাবে ডিলিট হয়েছে`);
//       return { success: true, message: 'ছবিটি সফলভাবে ডিলিট হয়েছে' };
//     } else {
//       console.log(`Cloudinary Failed: [${publicId}] ছবিটি ডিলিট করা সম্ভব হয়নি (Result: ${result.result})`);
//       return { success: false, message: 'ছবিটি ডিলিট করা সম্ভব হয়নি' };
//     }
//   } catch (error) {
//     console.error(`Cloudinary Error for [${publicId}]:`, error);
//     return { success: false, message: 'সার্ভারে সমস্যা হয়েছে' };
//   }
// }

// // ================= ১. সব আর্টিকেল ফেচ (GET) =================
// export async function GET(req: Request) {
//   try {
//     const authResult = await checkAuthAndRole();
//     if ("error" in authResult) {
//       return NextResponse.json({ message: authResult.error }, { status: authResult.status });
//     }

//     const articles = await prisma.article.findMany({
//       orderBy: { createdAt: "desc" },
//       include: {
//         translations: true,
//         category: {
//           include: { translations: true }
//         },
//         author: {
//           select: { name: true, email: true }
//         }
//       }
//     });

//     return NextResponse.json(articles);
//   } catch (error) {
//     console.error("Fetch Articles Error:", error);
//     return NextResponse.json({ message: "Server Error" }, { status: 500 });
//   }
// }

// // ================= ২. নতুন আর্টিকেল তৈরি (POST) =================
// export async function POST(req: Request) {
//   try {
//     const authResult = await checkAuthAndRole();
//     if ("error" in authResult) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

//     const body = await req.json();
//     const { title, slug, content, language, categoryId, coverImage, status } = body;

//     if (!title || !slug || !categoryId) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

//     const finalStatus = status === "DRAFT" ? "DRAFT" : "PUBLISHED";

//     const article = await prisma.article.create({
//       data: {
//         authorId: authResult.userId,
//         categoryId,
//         coverImage: coverImage || "",
//         status: finalStatus,
//         translations: {
//           create: {
//             language: language || "BN",
//             title,
//             slug,
//             content: content || { blocks: [] },
//           },
//         },
//       },
//       include: { translations: true },
//     });

//     return NextResponse.json(article);
//   } catch (error: any) {
//     if (error.code === "P2002") return NextResponse.json({ message: "Slug already exists" }, { status: 400 });
//     return NextResponse.json({ message: "Server Error" }, { status: 500 });
//   }
// }

// // ================= ৩. আর্টিকেল আপডেট (PUT) =================
// export async function PUT(req: Request) {
//   try {
//     const authResult = await checkAuthAndRole();
//     if ("error" in authResult) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

//     const { searchParams } = new URL(req.url);
//     const articleId = searchParams.get("id");
//     if (!articleId) return NextResponse.json({ message: "Article ID required" }, { status: 400 });

//     const body = await req.json();
//     const { title, slug, content, language, categoryId, coverImage, status } = body;

//     const updatedArticle = await prisma.article.update({
//       where: { id: articleId },
//       data: {
//         categoryId,
//         coverImage,
//         status: status || "PUBLISHED",
//         translations: {
//           upsert: {
//             where: { articleId_language: { articleId, language: language || "BN" } },
//             update: { title, slug, content },
//             create: { language: language || "BN", title, slug, content },
//           },
//         },
//       },
//       include: { translations: true },
//     });

//     return NextResponse.json({ message: "Article updated successfully", updatedArticle });
//   } catch (error: any) {
//     if (error.code === "P2002") return NextResponse.json({ message: "Slug already exists" }, { status: 400 });
//     return NextResponse.json({ message: "Server Error" }, { status: 500 });
//   }
// }

// // ================= ৪. আর্টিকেল ডিলিট (DELETE) =================
// export async function DELETE(req: Request) {
//   try {
//     const authResult = await checkAuthAndRole();
//     if ("error" in authResult) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

//     const { searchParams } = new URL(req.url);
//     const articleId = searchParams.get("id");

//     if (!articleId) return NextResponse.json({ message: "Article ID is required" }, { status: 400 });

//     // ১. কভার ইমেজ এবং এডিটরের ভেতরের সব ইমেজ ইউআরএল ডাটাবেজ থেকে ফেচ করা
//     const article = await prisma.article.findUnique({
//       where: { id: articleId },
//       select: { 
//         coverImage: true,
//         translations: {
//           select: { content: true }
//         }
//       }
//     });

//     if (!article) return NextResponse.json({ message: "Article not found" }, { status: 404 });

//     // ডিলিট করার ইমেজ ইউআরএলগুলোর একটি ইউনিক সেট তৈরি করা
//     const imagesToDelete = new Set<string>();

//     // কভার ইমেজ অ্যাড করা (যদি সেটি ক্লাউডিনারির হয়)
//     if (article.coverImage && article.coverImage.includes("cloudinary.com")) {
//       imagesToDelete.add(article.coverImage);
//     }

//     // Editor.js এর ভেতরের (JSON এ থাকা) সব ছবি খুঁজে বের করা
//     article.translations.forEach((translation) => {
//       try {
//         if (translation.content) {
//           // ডাটাবেজে স্ট্রিং ফর্মে থাকলে পার্স করবে, নাহলে সরাসরি অবজেক্ট রিড করবে
//           const parsedContent = typeof translation.content === "string" 
//             ? JSON.parse(translation.content) 
//             : translation.content;

//           if (parsedContent && Array.isArray(parsedContent.blocks)) {
//             parsedContent.blocks.forEach((block: any) => {
//               if (block.type === "image" && block.data?.file?.url) {
//                 if (block.data.file.url.includes("cloudinary.com")) {
//                   imagesToDelete.add(block.data.file.url);
//                 }
//               }
//             });
//           }
//         }
//       } catch (e) {
//         console.error("Error parsing content for images:", e);
//       }
//     });

//     // ২. সংগৃহীত সব ছবির পাবলিক আইডি বের করে ক্লাউডিনারি থেকে ডিলিট করা
//     if (imagesToDelete.size > 0) {
//       console.log(`Cloudinary থেকে মোট ${imagesToDelete.size} টি ইমেজ ডিলিট করার প্রসেস শুরু হচ্ছে...`);
      
//       for (const imageUrl of Array.from(imagesToDelete)) {
//         const publicId = getCloudinaryPublicId(imageUrl);
//         if (publicId) {
//           // ও যেভাবে ফাংশন বানিয়ে ডিলিট করছিল, ঠিক সেভাবে কল করা হলো
//           await deleteCloudinaryImage(publicId);
//         }
//       }
//     }

//     // ৩. মেইন আর্টিকেল ডিলিট (Cascade-এর কারণে কমেন্ট, লাইক, বুকমার্ক ও ট্রান্সলেশন সব একসাথে ডিলিট হবে)
//     await prisma.article.delete({
//       where: { id: articleId },
//     });

//     return NextResponse.json({ 
//       message: "Article, Cloudinary images (Cover + JSON Editor Images), and all interactions deleted successfully" 
//     });
//   } catch (error: any) {
//     console.error("Article Delete Error:", error);
//     return NextResponse.json({ message: "Server Error" }, { status: 500 });
//   }
// }

// app/api/articles/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// আপনার .env ফাইলের নামের সাথে হুবহু ম্যাচ করে কনফিগার করা হলো
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedRoles = ["ADMIN", "EDITOR", "WRITER"];

const checkAuthAndRole = async () => {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", status: 401 };

  const role = (session.user as any).role;
  const id = (session.user as any).id;

  if (!allowedRoles.includes(role)) return { error: "Forbidden", status: 403 };
  return { userId: id, role };
};

/**
 * Cloudinary URL থেকে Public ID বের করার নিখুঁত ফাংশน
 * উদাহরণ: https://res.cloudinary.com/.../upload/v12345/sports_portal/filename.jpg
 * আউটপুট দেবে: sports_portal/filename
 */
function getCloudinaryPublicId(url: string): string | null {
  try {
    if (!url || !url.includes("cloudinary.com")) return null;
    
    // '/upload/' এর পরের অংশটুকু আলাদা করা
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    // v12345678/sports_portal/filename.jpg অংশটি নেওয়া
    let cleanPath = parts[1];
    const pathSegments = cleanPath.split("/");
    
    // যদি ভার্সন নম্বর (vXXXXXX) থাকে তবে সেটি প্রথম ইনডেক্স থেকে বাদ দেওয়া
    if (pathSegments[0].startsWith("v") && !isNaN(Number(pathSegments[0].substring(1)))) {
      pathSegments.shift();
    }
    
    // আবার জোড়া লাগিয়ে এক্সটেনশন (.jpg, .png ইত্যাদি) বাদ দেওয়া
    const fullPath = pathSegments.join("/");
    const publicId = fullPath.substring(0, fullPath.lastIndexOf("."));
    
    return publicId; // রিটার্ন করবে: "sports_portal/filename"
  } catch (error) {
    console.error("Error parsing Cloudinary Public ID:", error);
    return null;
  }
}

/**
 * Cloudinary থেকে সিঙ্গেল ফাইল ডিলিট করার স্ট্যান্ডার্ড ফাংশন
 */
async function deleteCloudinaryImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      console.log(`Cloudinary Success: [${publicId}] ছবিটি সফলভাবে ডিলিট হয়েছে`);
      return { success: true, message: 'ছবিটি সফলভাবে ডিলিট হয়েছে' };
    } else {
      console.log(`Cloudinary Failed: [${publicId}] ছবিটি ডিলিট করা সম্ভব হয়নি (Result: ${result.result})`);
      return { success: false, message: 'ছবিটি ডিলিট করা সম্ভব হয়নি' };
    }
  } catch (error) {
    console.error(`Cloudinary Error for [${publicId}]:`, error);
    return { success: false, message: 'সার্ভারে সমস্যা হয়েছে' };
  }
}

/**
 * ডাটাবেজের কনটেন্ট অবজেক্ট বা স্ট্রিং থেকে ইমেজের সেট রিটার্ন করার হেল্পার ফাংশন
 */
function extractImagesFromContent(content: any): Set<string> {
  const images = new Set<string>();
  try {
    if (!content) return images;
    
    const parsedContent = typeof content === "string" ? JSON.parse(content) : content;

    if (parsedContent && Array.isArray(parsedContent.blocks)) {
      parsedContent.blocks.forEach((block: any) => {
        if (block.type === "image" && block.data?.file?.url) {
          if (block.data.file.url.includes("cloudinary.com")) {
            images.add(block.data.file.url);
          }
        }
      });
    }
  } catch (e) {
    console.error("Error extracting images from content:", e);
  }
  return images;
}

// ================= ১. সব আর্টিকেল ফেচ (GET) =================
export async function GET(req: Request) {
  try {
    const authResult = await checkAuthAndRole();
    if ("error" in authResult) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        translations: true,
        category: {
          include: { translations: true }
        },
        author: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Fetch Articles Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// ================= ২. নতুন আর্টিকেল তৈরি (POST) =================
export async function POST(req: Request) {
  try {
    const authResult = await checkAuthAndRole();
    if ("error" in authResult) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

    const body = await req.json();
    const { title, slug, content, language, categoryId, coverImage, status } = body;

    if (!title || !slug || !categoryId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const finalStatus = status === "DRAFT" ? "DRAFT" : "PUBLISHED";

    const article = await prisma.article.create({
      data: {
        authorId: authResult.userId,
        categoryId,
        coverImage: coverImage || "",
        status: finalStatus,
        translations: {
          create: {
            language: language || "BN",
            title,
            slug,
            content: content || { blocks: [] },
          },
        },
      },
      include: { translations: true },
    });

    return NextResponse.json(article);
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ message: "Slug already exists" }, { status: 400 });
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// ================= ৩. আর্টিকেল আপডেট (PUT) =================
export async function PUT(req: Request) {
  try {
    const authResult = await checkAuthAndRole();
    if ("error" in authResult) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get("id");
    if (!articleId) return NextResponse.json({ message: "Article ID required" }, { status: 400 });

    const body = await req.json();
    const { title, slug, content, language, categoryId, coverImage, status } = body;
    const currentLang = language || "BN";

    // 🌟 [স্টেপ ১]: আপডেট করার আগে ডাটাবেজে থাকা বর্তমান ইমেজের অবস্থা সংরক্ষণ করা
    const oldArticle = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        coverImage: true,
        translations: {
          where: { language: currentLang },
          select: { content: true }
        }
      }
    });

    if (!oldArticle) return NextResponse.json({ message: "Article not found" }, { status: 404 });

    // পুরনো ইমেজের লিস্ট তৈরি (Cover + Editor.js blocks)
    const oldImages = extractImagesFromContent(oldArticle.translations[0]?.content);
    if (oldArticle.coverImage && oldArticle.coverImage.includes("cloudinary.com")) {
      oldImages.add(oldArticle.coverImage);
    }

    // 🌟 [স্টেপ ২]: ডাটাবেজে আর্টিকেলটি নতুন ডেটা দিয়ে আপডেট করা
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        categoryId,
        coverImage,
        status: status || "PUBLISHED",
        translations: {
          upsert: {
            where: { articleId_language: { articleId, language: currentLang } },
            update: { title, slug, content },
            create: { language: currentLang, title, slug, content },
          },
        },
      },
      include: { translations: true },
    });

    // 🌟 [স্টেপ ৩]: নতুন করে রিসিভ হওয়া ইমেজের লিস্ট তৈরি (Cover + Editor.js blocks)
    const newImages = extractImagesFromContent(content);
    if (coverImage && coverImage.includes("cloudinary.com")) {
      newImages.add(coverImage);
    }

    // 🌟 [স্টেপ ৪]: ডিফারেন্স বের করা (যা পুরনো লিস্টে ছিল কিন্তু নতুন লিস্টে নেই অর্থাৎ রিমুভ করা হয়েছে)
    const imagesToDelete = new Set<string>();
    oldImages.forEach((img) => {
      if (!newImages.has(img)) {
        imagesToDelete.add(img);
      }
    });

    // 🌟 [স্টেপ ৫]: বাদ পড়ে যাওয়া ইমেজগুলো ক্লাউডিনারি থেকে ডিটেক্ট করে মুছে ফেলা
    if (imagesToDelete.size > 0) {
      console.log(`আর্টিকেল আপডেটে বাদ পড়া ${imagesToDelete.size} টি ইমেজ ক্লাউডিনারি থেকে ক্লিনআপ করা হচ্ছে...`);
      for (const imageUrl of Array.from(imagesToDelete)) {
        const publicId = getCloudinaryPublicId(imageUrl);
        if (publicId) {
          await deleteCloudinaryImage(publicId);
        }
      }
    }

    return NextResponse.json({ message: "Article updated successfully", updatedArticle });
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ message: "Slug already exists" }, { status: 400 });
    console.error("Article Update Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// ================= ৪. আর্টিকেল ডিলিট (DELETE) =================
export async function DELETE(req: Request) {
  try {
    const authResult = await checkAuthAndRole();
    if ("error" in authResult) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get("id");

    if (!articleId) return NextResponse.json({ message: "Article ID is required" }, { status: 400 });

    // ১. কভার ইমেজ এবং এডিটরের ভেতরের সব ইমেজ ইউআরএল ডাটাবেজ থেকে ফেচ করা
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { 
        coverImage: true,
        translations: {
          select: { content: true }
        }
      }
    });

    if (!article) return NextResponse.json({ message: "Article not found" }, { status: 404 });

    // ডিলিট করার ইমেজ ইউআরএলগুলোর একটি ইউনিক সেট তৈরি করা
    const imagesToDelete = new Set<string>();

    // কভার ইমেজ অ্যাড করা (যদি সেটি ক্লাউডিনারির হয়)
    if (article.coverImage && article.coverImage.includes("cloudinary.com")) {
      imagesToDelete.add(article.coverImage);
    }

    // Editor.js এর ভেতরের (JSON এ থাকা) সব ছবি খুঁজে বের করা
    article.translations.forEach((translation) => {
      const transImages = extractImagesFromContent(translation.content);
      transImages.forEach(img => imagesToDelete.add(img));
    });

    // ২. সংগৃহীত সব ছবির পাবলিক আইডি বের করে ক্লাউডিনারি থেকে ডিলিট করা
    if (imagesToDelete.size > 0) {
      console.log(`Cloudinary থেকে মোট ${imagesToDelete.size} টি ইমেজ ডিলিট করার প্রসেস শুরু হচ্ছে...`);
      
      for (const imageUrl of Array.from(imagesToDelete)) {
        const publicId = getCloudinaryPublicId(imageUrl);
        if (publicId) {
          await deleteCloudinaryImage(publicId);
        }
      }
    }

    // ৩. মেইন আর্টিকেল ডিলিট (Cascade-এর কারণে কমেন্ট, লাইক, বুকমার্ক ও ট্রান্সলেশন সব একসাথে ডিলিট হবে)
    await prisma.article.delete({
      where: { id: articleId },
    });

    return NextResponse.json({ 
      message: "Article, Cloudinary images (Cover + JSON Editor Images), and all related data (comments, likes) deleted successfully" 
    });
  } catch (error: any) {
    console.error("Article Delete Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}