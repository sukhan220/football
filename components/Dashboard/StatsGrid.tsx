// components/admin/dashboard/StatsGrid.tsx
"use client";
import React from "react";
import { Users, FileText, Eye, Edit3 } from "lucide-react";

type StatsGridProps = {
  totalUsers: number;
  totalPublished: number;
  totalViews: number;
  totalDrafts: number;
};

export default function StatsGrid({ totalUsers, totalPublished, totalViews, totalDrafts }: StatsGridProps) {
  
  // সংখ্যাগুলোকে সুন্দর ফরম্যাটে দেখানোর ফাংশন (যেমন: 89400 কে 89.4k করা)
  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num;
  };

  const stats = [
    { title: "Total Users", value: totalUsers, icon: <Users size={24} />, description: "Registered profiles", bgColor: "bg-blue-600" },
    { title: "Published News", value: totalPublished, icon: <FileText size={24} />, description: "Live on portal", bgColor: "bg-emerald-600" },
    { title: "Total Views", value: formatNumber(totalViews), icon: <Eye size={24} />, description: "Across all languages", bgColor: "bg-amber-600" },
    { title: "Draft Articles", value: totalDrafts, icon: <Edit3 size={24} />, description: "Pending review", bgColor: "bg-rose-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="p-6 bg-white rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.title}</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
            <p className="text-xs text-gray-400 font-medium">{stat.description}</p>
          </div>
          <div className={`p-4 rounded-xl ${stat.bgColor} text-white`}>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}