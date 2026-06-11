// app/admin/dashboard/page.tsx
import type { Metadata } from "next";
import React from "react";
import {prisma} from "@/lib/prisma"; // আপনার প্রজেক্টের prisma client-এর পাথ দিন
import StatsGrid from "@/components/Dashboard/StatsGrid";
import StatisticsChart from "@/components/Dashboard/StatisticsChart";
import RecentArticles from "@/components/Dashboard/RecentArticles";

export const metadata: Metadata = {
  title: "Football News Dashboard - Stay Updated with the Latest Football News and Insights",
  description: "This is Next.js Dashboard Template",
};

export default async function Dashboard() {
  // ১. স্ট্যাটস বা কাউন্টের ডেটাবেস কুয়েরি (সবগুলো একসাথে প্যারালালি রান হবে performance অপ্টিমাইজেশনের জন্য)
  const [totalUsers, totalPublished, totalViewsAggregate, totalDrafts] = await Promise.all([
    prisma.user.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.aggregate({ _sum: { views: true } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
  ]);

  // ২. সাম্প্রতিক ১০টি আর্টিকেলের ডেটাবেস কুয়েরি (সাথে তাদের Translation এবং Category লোড করা হচ্ছে)
  const recentArticles = await prisma.article.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      translations: {
        take: 1, // প্রথম ট্রান্সলেশনটি নেওয়ার জন্য (অথবা ল্যাঙ্গুয়েজ ফিল্টার বসাতে পারেন)
      },
      category: {
        include: {
          translations: {
            take: 1,
          },
        },
      },
    },
  });

  // ৩. চার্টের জন্য ডেটা প্রিপারেশন (ল্যাঙ্গুয়েজ ভিত্তিক কতগুলো আর্টিকেল আছে)
  const englishCount = await prisma.articleTranslation.count({ where: { language: "EN" } });
  const bengaliCount = await prisma.articleTranslation.count({ where: { language: "BN" } });

  // ভিউ সামেশন থেকে নাল হ্যান্ডেল করা
  const totalViews = totalViewsAggregate._sum.views || 0;

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Football Portal Overview</h1>
        <p className="text-sm text-gray-500">Real-time database insights of your multi-lingual portal.</p>
      </div>

      {/* ডেটাবেস থেকে আসা কাউন্টগুলো পাঠানো হচ্ছে */}
      <StatsGrid 
        totalUsers={totalUsers} 
        totalPublished={totalPublished} 
        totalViews={totalViews} 
        totalDrafts={totalDrafts} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5 h-full">
          <StatisticsChart enCount={englishCount} bnCount={bengaliCount} />
        </div>

        <div className="xl:col-span-7">
          <RecentArticles articles={recentArticles} />
        </div>
      </div>
    </div>
  );
}