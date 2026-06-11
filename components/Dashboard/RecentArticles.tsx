// components/admin/dashboard/RecentArticles.tsx
"use client";
import React from "react";
import { Eye, ThumbsUp, MessageSquare, MoreVertical } from "lucide-react";

type RecentArticlesProps = {
  articles: any[]; // Prisma জেনারেটেড টাইপ বা custom type ব্যবহার করতে পারেন
};

export default function RecentArticles({ articles }: RecentArticlesProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 dark:text-white text-lg">Recent Articles</h3>
        <button className="text-sm text-brand-600 hover:underline font-medium">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
              <th className="p-4">Article Title</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-center">Lang</th>
              <th className="p-4 text-center">Stats</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">No articles found in database.</td>
              </tr>
            ) : (
              articles.map((article) => {
                // প্রথম ট্রান্সলেশন থেকে টাইটেল এবং ভাষা নেওয়া হচ্ছে
                const translation = article.translations[0];
                const categoryTranslation = article.category?.translations[0];
                
                return (
                  <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="p-4 font-medium max-w-[260px] truncate">
                      {translation?.title || "Untitled Article"}
                    </td>
                    <td className="p-4 text-gray-500">
                      {categoryTranslation?.name || "Uncategorized"}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${translation?.language === "BN" ? "bg-orange-100 text-orange-700" : "bg-purple-100 text-purple-700"}`}>
                        {translation?.language || "N/A"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 justify-center text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Eye size={14}/> {article.views}</span>
                        <span className="flex items-center gap-1"><ThumbsUp size={14}/> {article.likesCount}</span>
                        <span className="flex items-center gap-1"><MessageSquare size={14}/> {article.commentsCount}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        article.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" :
                        article.status === "DRAFT" ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" :
                        "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}