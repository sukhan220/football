 //layout.tsx


"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const navContainerRef = useRef<HTMLDivElement>(null);

  // 📱 মোবাইল ভিউতে একটিভ বা সিলেক্টেড ট্যাবকে অটোমেটিক স্ক্রল করে স্ক্রিনের মাঝখানে আনার লজিক
  useEffect(() => {
    const activeTab = navContainerRef.current?.querySelector(".is-scrolling-selected, .bg-emerald-500");
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [pathname]);

  // GSAP ক্লাস চেঞ্জের ওপর নজর রাখার জন্য একটি MutationObserver (মোবাইল স্ক্রল ফিক্স)
  useEffect(() => {
    if (!navContainerRef.current) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const target = mutation.target as HTMLElement;
          if (target.classList.contains("is-scrolling-selected")) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          }
        }
      });
    });

    const tabs = navContainerRef.current.querySelectorAll(".nav-tab");
    tabs.forEach((tab) => observer.observe(tab, { attributes: true }));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#252725] text-gray-100 antialiased font-sans selection:bg-emerald-500 selection:text-black relative">
      
      {/* ================= 🌌 ১. ফিক্সড ৩ডি পার্সপেক্টিভ নেভিগেশন বার ================= */}
      <nav 
        className="fixed top-1 left-1/2 -translate-x-1/2 z-[999] w-full max-w-5xl px-4 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
        style={{ perspective: "800px" }}
      >
        <div 
          ref={navContainerRef}
          className="bg-[#090f0c]/90 border border-emerald-500/10 rounded-2xl p-2 backdrop-blur-md flex items-center justify-start md:justify-center gap-1.5 sm:gap-2 transition-all duration-500 overflow-x-auto no-scrollbar scroll-smooth"
          style={{ transform: "rotateX(8deg)" }}
        >
          {MAGAZINE_TABS.map((tab) => {
            const isActive = pathname.startsWith(tab.path);
            const slug = tab.path.split("/").pop(); 

            return (
              <Link
                key={tab.name}
                href={tab.path}
                data-tab-slug={slug}
                className={`nav-tab relative flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black tracking-wide transition-all duration-300 whitespace-nowrap shrink-0 overflow-hidden group border ${
                  isActive
                    ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_10px_25px_rgba(16,185,129,0.3)] -translate-y-1.5 is-scrolling-selected"
                    : "bg-[#0b120e]/60 text-zinc-400 border-zinc-900 hover:border-emerald-500/20 hover:text-white hover:-translate-y-1"
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* কাস্টম বর্ডার ইন্ডিকেটর */}
                <div className="absolute inset-0 border-2 border-emerald-400/80 rounded-xl pointer-events-none opacity-0 scale-105 transition-all duration-300 [.is-scrolling-selected_&]:opacity-100 [.is-scrolling-selected_&]:scale-100" />

                {!isActive && (
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                
                <span className={`text-sm sm:text-base transition-transform duration-300 group-hover:scale-110 ${isActive ? "scale-105" : "filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"}`}>
                  {tab.icon}
                </span>
                <span className="relative z-10">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ================= 📂 ২. মেইন কন্টেন্ট এরিয়া ================= */}
      <main className="w-full">
        {children}
      </main>

    </div>
  );
}