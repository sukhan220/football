// app/api/dashboard/summary/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const allowedRoles = ["ADMIN", "EDITOR", "WRITER"];

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    const userId = (session.user as any).id;

    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // রোল অনুযায়ী কুয়েরি ফিল্টার (WRITER শুধু তার নিজের পোস্ট দেখবে, ADMIN/EDITOR সব দেখবে)
    const filter = role === "WRITER" ? { authorId: userId } : {};

    // ১. টোটাল আর্টিকেল, পাবলিশড ও ড্রাফট কাউন্ট (প্যারালাল কুয়েরি)
    const [totalArticles, publishedCount, draftCount, totalCategories, recentArticles] = await Promise.all([
      prisma.article.count({ where: filter }),
      prisma.article.count({ where: { ...filter, status: "PUBLISHED" } }),
      prisma.article.count({ where: { ...filter, status: "DRAFT" } }),
      prisma.category.count(),
      prisma.article.findMany({
        where: filter,
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          translations: {
            take: 1, // যেকোনো একটি ট্রান্সলেশন (টাইটেল দেখানোর জন্য)
          },
        },
      }),
    ]);

    return NextResponse.json({
      summary: {
        totalArticles,
        publishedCount,
        draftCount,
        totalCategories: role === "WRITER" ? null : totalCategories, // রাইটারকে ক্যাটাগরি কাউন্ট দেখানোর দরকার নেই
      },
      recentArticles,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}