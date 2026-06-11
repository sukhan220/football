"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // কনসোলে এরর ট্র্যাক করার জন্য
    console.error("APPLICATION_CRASH_ERROR:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#0B0F19] p-4 text-center">
      {/* এরর আইকন গ্রাফিক্স */}
      <div className="mb-4 text-red-500 bg-red-500/10 p-4 rounded-full border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">
        দুঃখিত, কোনো একটি সমস্যা হয়েছে!
      </h2>

      <p className="text-gray-400 max-w-md mb-8 text-sm leading-relaxed">
        অ্যাপ্লিকেশনটি ডাটা লোড করতে বা রেন্ডার করতে সাময়িকভাবে ব্যর্থ হয়েছে। সিস্টেম অলরেডি এররটি ট্র্যাক করেছে।
      </p>

      {/* অ্যাকশন বাটন */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()} // Next.js এর বিল্ট-ইন রিসেট ফাংশন যা পেজটি রিল্যান্ড করার চেষ্টা করবে
          className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-lg hover:brightness-110 transition-all duration-300 shadow-lg"
        >
          আবার চেষ্টা করুন
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2.5 bg-zinc-800 text-gray-300 font-medium rounded-lg hover:bg-zinc-700 transition-all duration-300"
        >
          হোম পেজে যান
        </button>
      </div>
    </div>
  );
}