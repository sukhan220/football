// // app/api/news/[articleId]/comments/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { auth } from "@/auth"; // 👈 v5 এর মেইন auth ফাংশন ইম্পোর্ট করুন

// export async function POST(
//   request: Request,
//   { params }: { params: Promise<{ articleId: string }> }
// ) {
//   try {
//     const { articleId } = await params;
    
//     // 🛠️ NextAuth v5 এ সেশন পাওয়ার বেস্ট ও সিম্পল উপায়
//     const session = await auth();

//     // ১. ইউজার অথেনটিকেশন চেক
//     if (!session || !session.user || !session.user.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { body } = await request.json();

//     if (!body || !body.trim()) {
//       return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
//     }

//     // ২. ইমেইল দিয়ে ডাটাবেজ থেকে ইউজারের আসল UUID খুঁজে বের করা
//     const dbUser = await prisma.user.findUnique({
//       where: { email: session.user.email },
//     });

//     if (!dbUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // ৩. ডাটাবেজে কমেন্ট সেভ করা
//     const newComment = await prisma.comment.create({
//       data: {
//         content: body,
//         userId: dbUser.id,
//         articleId: articleId,
//       },
//       include: {
//         user: {
//           select: {
//             name: true,
//             image: true,
//           },
//         },
//       },
//     });

//     const formattedComment = {
//       id: newComment.id,
//       body: newComment.content,
//       createdAt: newComment.createdAt.toISOString(),
//       user: {
//         name: newComment.user.name || "User",
//         image: newComment.user.image || "",
//       },
//     };

//     return NextResponse.json(formattedComment, { status: 201 });
//   } catch (error) {
//     console.error("COMMENT_POST_ERROR:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// app/api/news/[articleId]/comments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const { articleId } = await params;
    
    // ১. NextAuth v5 সেশন চেক
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { body } = await request.json();
    if (!body || !body.trim()) {
      return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
    }

    // ২. ইমেইল দিয়ে ডাটাবেজ থেকে ইউজার খুঁজে বের করা
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ৩. ডাটাবেজে কমেন্ট সেভ করা
    const newComment = await prisma.comment.create({
      data: {
        content: body, // ডাটাবেজের 'content' কলামে ফ্রন্টএন্ডের 'body' সেভ হচ্ছে
        userId: dbUser.id,
        articleId: articleId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // ৪. ফ্রন্টএন্ড ইন্টারফেসের সাথে শতভাগ ম্যাচ করানোর জন্য ফরম্যাটিং
    const formattedComment = {
      id: newComment.id,
      body: newComment.content,     // ফ্রন্টএন্ডের কমপ্লেন দূর করতে 'body' ফিল্ডে ডাটা দেওয়া হলো
      content: newComment.content,  // ব্যাকআপ হিসেবে 'content' ফিল্ডও রাখা হলো
      createdAt: newComment.createdAt.toISOString(),
      user: {
        name: newComment.user.name || "User",
        image: newComment.user.image || "",
      },
      replies: newComment.replies || [], // নতুন কমেন্টে শুরুতে কোনো রিপ্লাই থাকবে না, তাই খালি অ্যারে
    };

    return NextResponse.json(formattedComment, { status: 201 });
  } catch (error) {
    console.error("COMMENT_POST_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}