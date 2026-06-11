// app/api/news/[articleId]/like/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"; // 👈 v5 এর মেইন auth ফাংশন ইম্পোর্ট করুন

export async function POST(
  request: Request,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const { articleId } = await params;
    
    // 🛠️ সেশন চেক
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // চেক করা ইউজার আগে থেকে লাইক দিয়েছে কিনা
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: dbUser.id,
          articleId: articleId,
        },
      },
    });

    if (existingLike) {
      // অলরেডি লাইক থাকলে Unlike করা হচ্ছে
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ liked: false, message: "Unliked successfully" });
    } else {
      // লাইক না থাকলে নতুন রেকর্ড তৈরি করা হচ্ছে
      await prisma.like.create({
        data: {
          userId: dbUser.id,
          articleId: articleId,
        },
      });
      return NextResponse.json({ liked: true, message: "Liked successfully" });
    }
  } catch (error) {
    console.error("LIKE_TOGGLE_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}