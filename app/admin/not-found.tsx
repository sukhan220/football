"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function AdminNotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center bg-[#0B0F19]/40 border border-zinc-800/50 rounded-2xl backdrop-blur-sm">
      {/* গোল্ডেন গ্লোয়িং মিনিমাল আর্ট */}
      <div className="relative mb-6">
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] to-[#8A6614] tracking-wider drop-shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          404
        </h1>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#D4AF37] rounded-full"></div>
      </div>

      <h2 className="text-xl font-bold text-white mb-2 tracking-wide">
        অ্যাডমিন সেকশনটি খুঁজে পাওয়া যায়নি!
      </h2>
      
      <p className="text-zinc-400 max-w-sm mb-8 text-sm leading-relaxed">
        আপনি ড্যাশবোর্ডের এমন একটি মডিউলে প্রবেশের চেষ্টা করছেন যা এখনো তৈরি করা হয়নি বা লিংকটি ডিলিট করা হয়েছে।
      </p>

      {/* ড্যাশবোর্ড ফ্রেন্ডলি বাটন */}
      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          className="px-5 py-2 text-xs md:text-sm font-medium border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-all duration-200"
        >
          পেছনে যান
        </button>
        <button
          onClick={() => router.push("/admin")} // ড্যাশবোর্ড হোম
          className="px-5 py-2 text-xs md:text-sm font-semibold bg-[#D4AF37] text-black rounded-lg hover:bg-yellow-600 transition-all duration-200 shadow-md shadow-yellow-900/10"
        >
          ড্যাশবোর্ড হোম
        </button>
      </div>
    </div>
  );
}