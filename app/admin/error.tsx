"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("ADMIN_PANEL_CRASH:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center bg-[#0B0F19]/40 border border-red-900/20 rounded-2xl backdrop-blur-sm">
      {/* মিনিমাল ড্যাশবোর্ড এরর আইকন */}
      <div className="mb-5 text-red-500 bg-red-500/10 p-3.5 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-white mb-2 tracking-wide">
        মডিউলটি লোড করতে সমস্যা হয়েছে!
      </h2>

      <p className="text-zinc-400 max-w-md mb-8 text-xs md:text-sm leading-relaxed">
        ব্যাকএন্ড ডাটাবেজ রেসপন্স করতে দেরি করছে অথবা কোনো ডাটা মিসিং আছে। আপনি পেজটি আবার রিল্যান্ড করার চেষ্টা করতে পারেন।
      </p>

      {/* অ্যাকশন বাটন */}
      <div className="flex gap-4">
        <button
          onClick={() => reset()} // প্রিজমা বা ব্যাকএন্ড কানেকশন রি-ট্রাই করার জন্য
          className="px-5 py-2 text-xs md:text-sm font-semibold bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black rounded-lg hover:brightness-110 transition-all duration-200 shadow-md"
        >
          আবার চেষ্টা করুন
        </button>
        <button
          onClick={() => router.push("/admin")}
          className="px-5 py-2 text-xs md:text-sm font-medium bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-all duration-200"
        >
          ড্যাশবোর্ড হোম
        </button>
      </div>
    </div>
  );
}