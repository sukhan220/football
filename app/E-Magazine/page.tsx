 //page.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function EMagazineRootPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0); // ⚡ প্রোগ্রেসবার ট্র্যাকিং স্টেট

  const magazineSections = [
    {
      title: "MATCH FIXTURES",
      slug: "fixtures",
      desc: "Schedules, group standings, and venue timelines.",
      path: "/E-Magazine/fixtures",
      color: "from-blue-500",
      image: "https://www.shutterstock.com/image-vector/isometric-smartphone-football-live-score-260nw-2748383631.jpg",
    },
    {
      title: "OFFICIAL BALL",
      slug: "ball",
      desc: "Aerodynamics, modern design, and historical evolution.",
      path: "/E-Magazine/ball",
      color: "from-amber-500",
      image: "https://assets.adidas.com/images/w_1880,f_auto,q_auto/994fc1f0b1f94f59b25355d996262e53_9366/JY8892_01_00_standard.jpg",
    },
    {
      title: "MASCOT ARENA",
      slug: "mascot",
      desc: "Official mascot themes and identity.",
      path: "/E-Magazine/mascot",
      color: "from-purple-500",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe0D47gJHV0yb7Schu7ZRrWKdCkrX0YSvMmHpdjaMjug&s",
    },
    {
      title: "NEW TECH",
      slug: "technology",
      desc: "VAR data, smart chip balls and future tech.",
      path: "/E-Magazine/technology",
      color: "from-cyan-500",
      image: "https://www.globalconsultantsreview.com/newstransfer/upload/vyj6Goal_Line_Technology_Diagram.png",
    },
    {
      title: "NEW RULES",
      slug: "new-rules",
      desc: "Latest FIFA rules and gameplay updates.",
      path: "/E-Magazine/new-rules",
      color: "from-rose-500",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRfxHAvMS-Obqx1FpAheGho16jRs3ASDUz0805QRa0tshbi_dile8_QGg&s=10",
    },
    {
      title: "CHAMPIONS",
      slug: "champion",
      desc: "Historical winners gallery.",
      path: "/E-Magazine/champion",
      color: "from-emerald-500",
      image: "https://static.vecteezy.com/system/resources/previews/023/659/130/non_2x/single-continuous-line-drawing-soccer-ball-and-trophy-cup-over-virtual-football-field-smartphone-screen-mobile-football-soccer-online-soccer-game-with-live-mobile-app-one-line-draw-design-vector.jpg",
    },
    {
      title: "STADIUM VENUES",
      slug: "stadium",
      desc: "World-class stadium architecture.",
      path: "/E-Magazine/stadium",
      color: "from-indigo-500",
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=500",
    },
  ];

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, path: string) => {
    const card = e.currentTarget;

    gsap.to(card, {
      scale: 3.5,
      z: 300,
      opacity: 1,
      duration: 0.8,
      ease: "power2.in",
      onComplete: () => {
        router.push(path);
      },
    });
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // ⚡ দ্রুত স্ক্রল রেসপন্সের জন্য ডিউরেশন কিছুটা কমানো হলো
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0, // ⚡ হুইল মাল্টিপ্লায়ার স্ট্যান্ডার্ড করা হলো যাতে ফাস্ট স্ক্রল ইম্প্যাক্ট ধরে
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const updateNavbarSelection = (slug: string) => {
      document.querySelectorAll(".nav-tab").forEach((tab) => {
        const tabSlug = tab.getAttribute("data-tab-slug");
        if (tabSlug === slug) {
          tab.classList.add("is-scrolling-selected");
        } else {
          tab.classList.remove("is-scrolling-selected");
        }
      });
    };

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");

      // ইনিশিয়াল সিলেকশন ফিক্সড
      updateNavbarSelection(magazineSections[0].slug);

      const totalSections = magazineSections.length;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${totalSections * 550}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8, // ⚡ স্ক্রাব একটু কমানো হলো যাতে স্ক্রল করার সাথে সাথে কার্ড লক ইন হয়
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            setScrollProgress(Math.round(progress * 100));
            
            // ⚡ ডাইনামিক রেঞ্জ ক্যালকুলেশন লজিক (যা ফাস্ট স্ক্রল করলেও মিস হবে না)
            // প্রোগ্রেসকে সেকশন সংখ্যা দিয়ে ভাগ করে একদম নিখুঁত ইনডেক্স বাউন্ডারি ডিফাইন করা হয়েছে
            let currentIndex = Math.floor(progress * totalSections);
            
            // বাউন্ডারি সেফটি চেক
            if (currentIndex >= totalSections) currentIndex = totalSections - 1;
            if (currentIndex < 0) currentIndex = 0;

            // কারেন্ট একটিভ কার্ডের স্লুগ অনুযায়ী ন্যাভবার আপডেট
            const activeSection = magazineSections[currentIndex];
            if (activeSection) {
              updateNavbarSelection(activeSection.slug);
            }
          },
        },
      });

      cards.forEach((card, index) => {
        const rotation = (index - Math.floor(totalSections / 2)) * 8;

        if (index === 0) {
          gsap.set(card, { rotation });
          return;
        }

        tl.fromTo(
          card,
          {
            x: "100vw",
            rotation: rotation + 90,
            scale: 0.6,
            opacity: 1,
          },
          {
            x: 0,
            rotation,
            scale: 1,
            opacity: 1,
            ease: "power1.out",
          },
          "+=0.25" // ⚡ টাইমলাইনের মাঝে গ্যাপ কিছুটা বাড়ানো হলো যাতে প্রতিটি কার্ড তার নিজের স্পেসে পারফেক্টলি বসে
        );
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#030503]">
      
      {/* 🌟 টপ ফিক্সড প্রোগ্রেসবার */}
      <div className="fixed top-0 left-0 w-full h-[5px] bg-zinc-900/50 z-[1000] backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 transition-all duration-75 ease-out rounded-r"
          style={{ width: `${scrollProgress}%` }}
        />
        <span className="absolute top-3 right-4 text-[10px] tracking-widest font-mono text-zinc-500 uppercase select-none">
          Progress: {scrollProgress}%
        </span>
      </div>

      {/* 🌟 ফিক্সড লোগো ইমেজ */}
      <div className="fixed bottom-15 right-10 md:right-15 pointer-events-none select-none z-[999]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="h-10 md:h-12 w-auto object-contain opacity-90" 
        />
      </div>

      {/* কন্টেইনার */}
      <div
        ref={containerRef}
        className="relative w-full h-screen bg-[#030503] text-white flex justify-center items-center overflow-hidden px-4 md:px-8 font-mono"
        style={{ perspective: "1000px" }}
      >
        <div className="absolute text-[10vw] font-black tracking-[0.2em] text-emerald-500/[0.03]">
          E-MAGAZINE
        </div>

        <div className="relative z-10 w-full max-w-4xl h-[460px] md:h-[500px] flex items-center justify-center bg-[#090e0b]/10 border border-zinc-900/30 rounded-3xl p-3 sm:p-8 backdrop-blur-sm">
          {magazineSections.map((item, index) => (
            <div
              key={item.title}
              onClick={(e) => handleCardClick(e, item.path)}
              className="stack-card absolute inset-0 m-auto transform-gpu origin-center h-[300px] md:h-[340px] w-[220px] md:w-[240px] rounded-2xl bg-gradient-to-b from-zinc-200 via-zinc-400 to-zinc-600 p-[3px] shadow-[0px_15px_50px_rgba(0,0,0,0.8)] cursor-pointer select-none"
              style={{ zIndex: index + 1 }}
            >
              <div className="w-full h-full rounded-xl bg-zinc-950 overflow-hidden flex flex-col justify-between items-center relative">
                
                {/* কার্ড হেডার */}
                <div className="relative z-20 w-full p-3 bg-white border-b-4 border-red-600 text-black">
                  <h3 className="font-black text-sm uppercase text-center">{item.title}</h3>
                </div>

                {/* ইমেজ সেকশন */}
                <div className="absolute inset-x-2 top-[62px] bottom-[90px] rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-tr ${item.color} opacity-20`} />
                </div>

                {/* কার্ড ফুটার */}
                <div className="relative z-20 w-full p-3 bg-zinc-900 border-t border-zinc-800 text-center">
                  <p className="text-[10px] text-zinc-400">{item.desc}</p>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold mt-1 block">
                    CLICK TO OPEN →
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}