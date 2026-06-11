"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar, Trophy, Zap, ShieldAlert, Layers, HelpCircle } from "lucide-react";

// আপনার দেওয়া রিকোয়ারমেন্ট অনুযায়ী ই-ম্যাগাজিন মেনু আইটেম
const MAGAZINE_TABS = [
  { name: "Fixture", path: "/E-Magazine/fixtures", icon: "📅" },
  { name: "Ball", path: "/E-Magazine/ball", icon: "⚽" },
  { name: "Mascot", path: "/E-Magazine/mascot", icon: "🎭" },
  { name: "Technology", path: "/E-Magazine/technology", icon: "🤖" },
  { name: "New Rules", path: "/E-Magazine/new-rules", icon: "📜" },
  { name: "Champion", path: "/E-Magazine/champion", icon: "🏆" },
  { name: "Stadium", path: "/E-Magazine/stadium", icon: "🏟️" },
];

export default function EMagazineLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // মেনুবার বামে-ডানে স্ক্রোল করার জন্য হ্যান্ডলার (মোবাইল ও বড় স্ক্রিনের জন্য)
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.5;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#070b08] text-gray-100 antialiased font-sans selection:bg-emerald-500 selection:text-black">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
        
        {/* ================= ১. টপ হরাইজন্টাল স্লাইডিং মেনুবার ================= */}
        <div className="relative bg-[#0b130e]/80 border border-emerald-950/60 rounded-2xl p-2.5 backdrop-blur-md flex items-center group shadow-2xl">
          
          {/* বামে স্ক্রোল বাটন */}
          <button 
            onClick={() => scroll("left")} 
            className="absolute left-2 z-10 p-1.5 rounded-lg bg-[#070b08] border border-emerald-950 text-gray-400 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* স্ক্রোলযোগ্য ক্যাটাগরি কন্টেইনার */}
          <div 
            ref={scrollContainerRef}
            className="flex items-center gap-2.5 overflow-x-auto scrollbar-none w-full px-6 py-0.5"
            style={{ scrollbarWidth: "none" }}
          >
            {MAGAZINE_TABS.map((tab) => {
              const isActive = pathname.startsWith(tab.path);
              return (
                <Link
                  key={tab.name}
                  href={tab.path}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap border shrink-0 ${
                    isActive
                      ? "bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20 scale-[1.02]"
                      : "bg-[#0f1b14] text-gray-400 border-emerald-950/40 hover:border-emerald-500/30 hover:text-gray-200"
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.name}
                </Link>
              );
            })}
          </div>

          {/* ডানে স্ক্রোল বাটন */}
          <button 
            onClick={() => scroll("right")} 
            className="absolute right-2 z-10 p-1.5 rounded-lg bg-[#070b08] border border-emerald-950 text-gray-400 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ================= ২. মেইন লেআউট গ্রিড (Content + Sidebar) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* [বাম পাশে] মেইন কন্টেন্ট এরিয়া (৩ কলাম দখল করবে) */}
          <main className="lg:col-span-3 min-h-[70vh] bg-[#0b130e]/20 border border-emerald-950/40 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
            {children}
          </main>

          {/* [ডান পাশে] উইজেট বা ট্রেন্ডিং সাইডবার (১ কলাম দখল করবে) */}
          <aside className="space-y-6">
            
            {/* সাইডবার কার্ড ১: লেটেস্ট আপডেট বা নোটিশ */}
            <div className="bg-[#0b130e]/40 border border-emerald-950/60 rounded-3xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 text-emerald-400 border-b border-emerald-950/80 pb-3">
                <Zap className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-black uppercase tracking-wider">Latest Highlights</h3>
              </div>
              <ul className="space-y-3 text-xs">
                <li className="p-3 bg-[#070b08]/50 border border-emerald-950/40 rounded-xl hover:border-emerald-500/20 transition-all cursor-pointer">
                  <span className="text-emerald-500 font-mono block mb-1">Mascot Unveiled</span>
                  <p className="text-gray-400 line-clamp-2 leading-relaxed">এই সিজনের অফিশিয়াল মাসকটের থিম এবং ব্যাকস্টোরি রিলিজ করা হয়েছে...</p>
                </li>
                <li className="p-3 bg-[#070b08]/50 border border-emerald-950/40 rounded-xl hover:border-emerald-500/20 transition-all cursor-pointer">
                  <span className="text-emerald-500 font-mono block mb-1">New Offside Tech</span>
                  <p className="text-gray-400 line-clamp-2 leading-relaxed">সেমি-অটোমেটেড অফসাইড ট্র্যাকিং সিস্টেমে নতুন কী পরিবর্তন আসছে?</p>
                </li>
              </ul>
            </div>

            {/* সাইডবার কার্ড ২: কুইক ফ্যাক্টস বা স্ট্যাটস */}
            <div className="bg-[#0b130e]/40 border border-emerald-950/60 rounded-3xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Tournament Quick Stats</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="bg-[#070b08]/50 p-3 rounded-xl border border-emerald-950/40 text-center">
                  <div className="text-lg font-black font-mono text-white">08</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Stadiums</div>
                </div>
                <div className="bg-[#070b08]/50 p-3 rounded-xl border border-emerald-950/40 text-center">
                  <div className="text-lg font-black font-mono text-emerald-500">32</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Total Teams</div>
                </div>
              </div>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}