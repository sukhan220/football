// components/admin/dashboard/StatisticsChart.tsx
"use client";
import React from "react";

type ChartProps = {
  enCount: number;
  bnCount: number;
};

export default function StatisticsChart({ enCount, bnCount }: ChartProps) {
  const total = enCount + bnCount;
  // ভাগফল জিরো হওয়া হ্যান্ডেল করার জন্য
  const enPercentage = total > 0 ? Math.round((enCount / total) * 100) : 0;
  const bnPercentage = total > 0 ? Math.round((bnCount / total) * 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 flex flex-col justify-between h-full min-h-[340px]">
      <div className="mb-4">
        <h3 className="font-bold text-gray-800 dark:text-white text-lg">Content Distribution</h3>
        <p className="text-xs text-gray-500">Real-time database translation metrics</p>
      </div>

      {/* ভিজ্যুয়াল ডেটা রিপ্রেজেন্টেশন */}
      <div className="flex-1 flex flex-col justify-center space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
            <span>English Articles ({enCount})</span>
            <span>{enPercentage}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
            <div className="bg-purple-600 h-3 rounded-full transition-all duration-500" style={{ width: `${enPercentage}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
            <span>Bengali Articles ({bnCount})</span>
            <span>{bnPercentage}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
            <div className="bg-orange-500 h-3 rounded-full transition-all duration-500" style={{ width: `${bnPercentage}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
        <span className="flex items-center gap-2">🟣 Total Translations In DB: {total}</span>
      </div>
    </div>
  );
}