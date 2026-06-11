// // app/api/categories/route.ts

// import { auth } from "@/auth";
// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {

//   try {

//     const session = await auth();

//     // Auth Check
//     if (!session?.user) {

//       return NextResponse.json(
//         { message: "Unauthorized" },
//         { status: 401 }
//       );

//     }

//     // Role Check
//     const userRole = (session.user as any).role;

//     const allowedRoles = ["ADMIN", "EDITOR"];

//     if (!userRole || !allowedRoles.includes(userRole)) {

//       return NextResponse.json(
//         {
//           message:
//             "Forbidden: You don't have permission to add categories",
//         },
//         { status: 403 }
//       );

//     }

//     const body = await req.json();

//     const {
//       image,
//       translations,
//     } = body;


//     // Validation
//     if (
//       !translations ||
//       !Array.isArray(translations) ||
//       translations.length === 0
//     ) {

//       return NextResponse.json(
//         { message: "Translations are required" },
//         { status: 400 }
//       );

//     }


//     // Check empty fields
//     for (const item of translations) {

//       if (
//         !item.language ||
//         !item.name ||
//         !item.slug
//       ) {

//         return NextResponse.json(
//           {
//             message:
//               "Language, name and slug are required",
//           },
//           { status: 400 }
//         );

//       }

//     }


//     // Duplicate Slug Check
//     const slugs = translations.map(
//       (item: any) => item.slug
//     );

//     const existingTranslation =
//       await prisma.categoryTranslation.findFirst({
//         where: {
//           slug: {
//             in: slugs,
//           },
//         },
//       });

//     if (existingTranslation) {

//       return NextResponse.json(
//         {
//           message:
//             "One or more category slugs already exist",
//         },
//         { status: 400 }
//       );

//     }


//     // Create Category
//     const category = await prisma.category.create({

//       data: {

//         image,

//         translations: {

//           create: translations.map((item: any) => ({

//             language: item.language,

//             name: item.name,

//             shortName: item.shortName || null,

//             slug: item.slug,

//             description:
//               item.description || null,

//           })),

//         },

//       },

//       include: {

//         translations: true,

//       },

//     });


//     return NextResponse.json(
//       category,
//       { status: 201 }
//     );

//   } catch (error: any) {

//     console.error(
//       "CATEGORY_POST_ERROR:",
//       error
//     );

//     // Prisma Duplicate Error
//     if (error.code === "P2002") {

//       return NextResponse.json(
//         {
//           message:
//             "Category translation already exists",
//         },
//         { status: 400 }
//       );

//     }

//     return NextResponse.json(
//       {
//         message: "Internal Server Error",
//       },
//       { status: 500 }
//     );

//   }

// }


// // GET Categories
// export async function GET() {

//   try {

//     const categories =
//       await prisma.category.findMany({

//         include: {

//           translations: true,

//         },

//         orderBy: {

//           createdAt: "desc",

//         },

//       });

//     return NextResponse.json(categories);

//   } catch (error) {

//     console.error(
//       "CATEGORY_GET_ERROR:",
//       error
//     );

//     return NextResponse.json(
//       {
//         message:
//           "Error fetching categories",
//       },
//       { status: 500 }
//     );

//   }

// }

// app/api/categories/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary কনফিগারেশন
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedRoles = ["ADMIN", "EDITOR"];

// রোল ভ্যালিডেশন চেকার
const checkAuthAndRole = async () => {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", status: 401 };

  const role = (session.user as any).role;
  if (!allowedRoles.includes(role)) return { error: "Forbidden", status: 403 };
  return { success: true };
};

/**
 * Cloudinary URL থেকে Public ID বের করার ফাংশন
 * উদাহরণ: https://res.cloudinary.com/.../upload/v12345/sports_portal/filename.jpg
 * আউটপুট দেবে: sports_portal/filename
 */
function getCloudinaryPublicId(url: string): string | null {
  try {
    if (!url || !url.includes("cloudinary.com")) return null;
    
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let cleanPath = parts[1];
    const pathSegments = cleanPath.split("/");
    
    if (pathSegments[0].startsWith("v") && !isNaN(Number(pathSegments[0].substring(1)))) {
      pathSegments.shift();
    }
    
    const fullPath = pathSegments.join("/");
    return fullPath.substring(0, fullPath.lastIndexOf("."));
  } catch (error) {
    console.error("Error parsing Cloudinary Public ID:", error);
    return null;
  }
}

// Cloudinary থেকে ফাইল রিমুভ করার ফাংশন
async function deleteCloudinaryImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'ok') {
      console.log(`Cloudinary Success: [${publicId}] ক্যাটাগরি ইমেজ ডিলিট হয়েছে`);
    } else {
      console.log(`Cloudinary Failed: [${publicId}] (Result: ${result.result})`);
    }
  } catch (error) {
    console.error(`Cloudinary Error for [${publicId}]:`, error);
  }
}

// ================= ১. নতুন ক্যাটাগরি তৈরি (POST) =================
export async function POST(req: Request) {
  try {
    const authCheck = await checkAuthAndRole();
    if ("error" in authCheck) {
      return NextResponse.json({ message: authCheck.error }, { status: authCheck.status });
    }

    const body = await req.json();
    const { image, translations } = body;

    if (!translations || !Array.isArray(translations) || translations.length === 0) {
      return NextResponse.json({ message: "Translations are required" }, { status: 400 });
    }

    for (const item of translations) {
      if (!item.language || !item.name || !item.slug) {
        return NextResponse.json({ message: "Language, name and slug are required" }, { status: 400 });
      }
    }

    const slugs = translations.map((item: any) => item.slug);
    const existingTranslation = await prisma.categoryTranslation.findFirst({
      where: { slug: { in: slugs } },
    });

    if (existingTranslation) {
      return NextResponse.json({ message: "One or more category slugs already exist" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        image,
        translations: {
          create: translations.map((item: any) => ({
            language: item.language,
            name: item.name,
            shortName: item.shortName || null,
            slug: item.slug,
            description: item.description || null,
          })),
        },
      },
      include: { translations: true },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("CATEGORY_POST_ERROR:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ message: "Category translation already exists" }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// ================= ২. সব ক্যাটাগরি ফেচ (GET) =================
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { translations: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("CATEGORY_GET_ERROR:", error);
    return NextResponse.json({ message: "Error fetching categories" }, { status: 500 });
  }
}

// ================= ৩. ক্যাটাগরি আপডেট ও ইমেজ রিপ্লেস (PUT) =================
// ফ্রন্টএন্ড ইউআরএল স্ট্রাকচার: /api/categories?id=category_uuid
export async function PUT(req: Request) {
  try {
    const authCheck = await checkAuthAndRole();
    if ("error" in authCheck) {
      return NextResponse.json({ message: authCheck.error }, { status: authCheck.status });
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("id");

    if (!categoryId) {
      return NextResponse.json({ message: "Category ID required" }, { status: 400 });
    }

    const body = await req.json();
    const { image, featured, translations } = body;

    // ১. ডাটাবেজ থেকে বর্তমান ক্যাটাগরির ইমেজ লিঙ্কটি তুলে নেওয়া
    const oldCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { image: true }
    });

    if (!oldCategory) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    // ২. ট্রানজেকশনের মাধ্যমে ক্যাটাগরি এবং তার সংশ্লিষ্ট ট্রান্সলেশন ডেটা আপডেট
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        image,
        featured: typeof featured === "boolean" ? featured : undefined,
        translations: {
          // পুরনো সব ট্রান্সলেশন রি-রাইট করার সেফ ওয়ে
          deleteMany: {},
          create: translations.map((item: any) => ({
            language: item.language,
            name: item.name,
            shortName: item.shortName || null,
            slug: item.slug,
            description: item.description || null,
          })),
        },
      },
      include: { translations: true },
    });

    // 🛠️ লজিক ১: ছবি পরিবর্তন করা হলে পুরনো ছবিটি ক্লাউডিনারি থেকে ডিলিট করা (রিপ্লেস মেকানিজম)
    if (oldCategory.image && oldCategory.image !== image && oldCategory.image.includes("cloudinary.com")) {
      const publicId = getCloudinaryPublicId(oldCategory.image);
      if (publicId) {
        await deleteCloudinaryImage(publicId);
      }
    }

    return NextResponse.json({ message: "Category updated successfully", updatedCategory });
  } catch (error: any) {
    console.error("CATEGORY_PUT_ERROR:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ message: "Slug or translation unique constraint failed" }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// ================= ৪. ক্যাটাগরি ও সংশ্লিষ্ট ইমেজ ডিলিট (DELETE) =================
// ফ্রন্টএন্ড ইউআরএল স্ট্রাকচার: /api/categories?id=category_uuid
export async function DELETE(req: Request) {
  try {
    const authCheck = await checkAuthAndRole();
    if ("error" in authCheck) {
      return NextResponse.json({ message: authCheck.error }, { status: authCheck.status });
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("id");

    if (!categoryId) {
      return NextResponse.json({ message: "Category ID is required" }, { status: 400 });
    }

    // ১. ডিলিট করার আগে ক্যাটাগরির ইমেজ ট্র্যাক তুলে নেওয়া
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { image: true }
    });

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    // 🛠️ লজিক ২: ক্লাউডিনারি থেকে ক্যাটাগরি লোগো ইমেজ ডিলিট করা
    if (category.image && category.image.includes("cloudinary.com")) {
      const publicId = getCloudinaryPublicId(category.image);
      if (publicId) {
        await deleteCloudinaryImage(publicId);
      }
    }

    // ২. মেইন ক্যাটাগরি ডিলিট করা
    // (নোট: আপনার Prisma স্কিমাতে CategoryTranslation মডেলে onDelete: Cascade অলরেডি দেওয়া আছে, তাই ট্রান্সলেশন টেবিল অটো-ক্লিন হয়ে যাবে!)
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: "Category and its assets deleted successfully" });
  } catch (error: any) {
    console.error("CATEGORY_DELETE_ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}