"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#0B0F19] p-4 text-center">
      {/* গ্লোয়িং ইফেক্ট সহ বড় 404 */}
      <div className="relative mb-4">
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF] to-[#D4AF37] drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] animate-pulse">
          404
        </h1>
      </div>

      <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">
        পৃষ্ঠাটি খুঁজে পাওয়া যায়নি!
      </h2>
      
      <p className="text-gray-400 max-w-md mb-8 text-sm md:text-base leading-relaxed">
        আপনি যে ইউআরএল বা লিংকটি খুঁজছেন তা সম্ভবত পরিবর্তন করা হয়েছে অথবা এখানে কখনো ছিলই না।
      </p>

      {/* অ্যাকশন বাটন */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-[#D4AF37] text-[#D4AF37] font-medium rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-md"
        >
          পেছনে ফিরে যান
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-lg hover:brightness-110 transition-all duration-300 shadow-lg shadow-yellow-900/20"
        >
          হোম পেজে যান
        </button>
      </div>
    </div>
  );
}