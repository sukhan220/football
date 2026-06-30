

"use client";

import React, { useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type RuleCard = {
  id: { en: string; bn: string }; // ID-কেও এন/বিএন ফরম্যাটে করা হলো
  tag: { en: string; bn: string };
  title: { en: string; bn: string };
  desc: { en: string; bn: string };
};

export default function Full360WheelBioscope() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const mainWheelRef = useRef<HTMLDivElement>(null);
  
  const [language, setLanguage] = useState<"en" | "bn">("bn");

  // ডাটাতে আইডিগুলো ইংরেজি ও বাংলায় আলাদা করে দেওয়া হলো
  const rulesData: RuleCard[] = [
    {
      id: { en: "01", bn: "০১" },
      tag: { en: "Format", bn: "ফরম্যাট" },
      title: { en: "48-Team Mega Battle & Best 3rd Place", bn: "৪৮ দলের মহাসমর ও সেরা ৩য় দল" },
      desc: { 
        en: "Breaking the 32-team tradition, a record 48 nations are participating. Along with top 2 from 12 groups, the best 8 'third-placed' teams will secure knockout tickets.", 
        bn: "৩২ দলের প্রথা ভেঙে এবারই প্রথম রেকর্ড ৪৮টি দেশ অংশ নিচ্ছে বিশ্বমঞ্চে। ১২টি গ্রুপের শীর্ষ ২টি দলের সাথে সেরা ৮টি 'তৃতীয় স্থান অর্জনকারী' দলও নকআউটের টিকিট পাবে।" 
      },
    },
    {
      id: { en: "02", bn: "০২" },
      tag: { en: "Tiebreaker", bn: "টাইব্রেকার" },
      title: { en: "Group Stage Tiebreaker (Head-to-Head)", bn: "গ্রুপ পর্বের টাইব্রেকার (Head-to-Head)" },
      desc: { 
        en: "If points are tied in the group stage, traditional goal difference is out! The head-to-head match winner gets direct priority for the knockouts.", 
        bn: "গ্রুপ পর্বের পয়েন্ট সমান হলে গোল ব্যবধানের ঐতিহ্যবাহী হিসাব এবার বাদ! সবার আগে দেখা হবে মুখোমুখি লড়াইয়ে যে দল জিতেছিল, তারাই সরাসরি নকআউটে অগ্রাধিকার পাবে।" 
      },
    },
    {
      id: { en: "03", bn: "০৩" },
      tag: { en: "Time", bn: "সময়" },
      title: { en: "Strict Countdown (5 & 10 Seconds)", bn: "কঠোর কাউন্টডাউন (৫ ও ১০ সেকেন্ড)" },
      desc: { 
        en: "Delaying more than 5 seconds for throw-ins or goal-kicks awards a corner to the opponent! Failing to substitute out in 10 seconds means a 1-minute sideline penalty.", 
        bn: "থ্রো-ইন বা গোল-কিক নিতে ৫ সেকেন্ডের বেশি অযথা দেরি করলে প্রতিপক্ষ সরাসরি কর্নার পাবে! খেলোয়াড় বদলের সময় ১০ সেকেন্ডে মাঠ না ছাড়লে ১ মিনিট সাইডলাইনে শাস্তি পেতে হবে।" 
      },
    },
    {
      id: { en: "04", bn: "০৪" },
      tag: { en: "Injury", bn: "ইনজুরি" },
      title: { en: "60-Second Rule to Stop Injury Drama", bn: "ইনজুরির নাটক বন্ধে ৬০ সেকেন্ড নিয়ম" },
      desc: { 
        en: "If a physio is called onto the pitch, the recovered player must stay off the field for at least 60 seconds. This completely eliminates tactical time-wasting.", 
        bn: "মাঠে ফিজিও ডেকে চিকিৎসা নিলে, সুস্থ হওয়ার পর খেলোয়াড়কে বাধ্যতামূলকভাবে কমপক্ষে ৬০ সেকেন্ড মাঠের বাইরে থাকতে হবে। এর ফলে ট্যাকটিকাল টাইম-ওয়েস্টিং সম্পূর্ণ বন্ধ হবে।" 
      },
    },
  ];

  useGSAP(() => {
    if (typeof window === "undefined" || !containerRef.current || !triggerRef.current || !mainWheelRef.current) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tickHandler = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickHandler);

    const cards = gsap.utils.toArray<HTMLElement>(".wheel-card");
    const radius = 480; 

    cards.forEach((card, index) => {
      const angleDegree = index * 90; 
      const angleRadian = (angleDegree * Math.PI) / 180;

      const xPos = radius * Math.sin(angleRadian);
      const yPos = -radius * Math.cos(angleRadian);

      gsap.set(card, {
        xPercent: -50,
        yPercent: -50,
        left: "50%",
        top: "50%",
        x: xPos,
        y: yPos,
        rotation: angleDegree,
      });
    });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: "+=4000", 
        pin: true,
        scrub: 0.6,
      }
    });

    masterTl.to(mainWheelRef.current, {
      rotation: -360, 
      ease: "none",
    }, 0);

    return () => {
      gsap.ticker.remove(tickHandler);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full bg-[#0a0705] text-[#ebdccb] font-sans relative overflow-x-hidden select-none">
      
      {/* ল্যাঙ্গুয়েজ টগল বাটন */}
      <div className="absolute top-6 right-6 z-50 flex items-center bg-[#ebdccb]/5 backdrop-blur-md rounded-lg mt-14 p-1 border border-[#ebdccb]/10 shadow-xl">
        <button
          onClick={() => setLanguage("en")}
          className={`px-4 py-1.5 rounded text-xs font-black tracking-wider transition-all ${
            language === "en" ? "bg-[#ebdccb] text-[#0a0705] skew-x-[-12deg]" : "text-[#ebdccb]/60 hover:text-[#ebdccb]"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage("bn")}
          className={`px-4 py-1.5 rounded text-xs font-black tracking-wider transition-all ${
            language === "bn" ? "bg-[#ebdccb] text-[#0a0705] skew-x-[-12deg]" : "text-[#ebdccb]/60 hover:text-[#ebdccb]"
          }`}
        >
          বাং
        </button>
      </div>

      <div ref={triggerRef} className="w-full h-screen flex items-center justify-center relative z-10 overflow-hidden">
        
        <div 
          ref={mainWheelRef}
          className="absolute w-[960px] h-[960px] rounded-full border border-dashed border-[#ebdccb]/15 flex items-center justify-center will-change-transform top-[52%]"
          style={{ transformOrigin: "center center" }}
        >
          <div className="absolute w-[940px] h-[940px] rounded-full border border-dotted border-[#ebdccb]/5" />

          <div className="absolute inset-0">
            {rulesData.map((rule, idx) => (
              <div
                key={idx}
                className="wheel-card absolute w-[380px] md:w-[440px] flex flex-col items-center text-center will-change-transform p-6 rounded-2xl bg-[#0a0705]/40 backdrop-blur-sm border border-[#ebdccb]/5"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* ডাইনামিক বিগ নাম্বার (বাংলায় ১,২ এবং ইংরেজিতে 1,2) */}
                <h2 
                  className="text-[120px] md:text-[160px] font-black leading-none tracking-tighter italic select-none"
                  style={{
                    fontFamily: language === "en" ? '"Impact", "Arial Black", sans-serif' : 'sans-serif',
                    WebkitTextStroke: "2px rgba(235, 220, 203, 0.4)",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {rule.id[language]}
                </h2>

                <div className="mt-[-15px] inline-flex items-center space-x-1.5 bg-[#ebdccb] text-[#0a0705] font-black text-[10px] uppercase tracking-widest px-4 py-1 skew-x-[-12deg] shadow-lg">
                  <span className="w-1 h-3 bg-[#0a0705] block italic" />
                  <span>{rule.tag[language]}</span>
                </div>
                
                <h3 className="mt-5 text-xl md:text-2xl font-black text-[#ebdccb] tracking-tight uppercase italic leading-tight max-w-[95%]">
                  {rule.title[language]}
                </h3>
                
                <p className="mt-3 text-xs md:text-sm leading-relaxed text-[#d9c3b0]/80 font-normal max-w-[90%] text-center">
                  {rule.desc[language]}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}