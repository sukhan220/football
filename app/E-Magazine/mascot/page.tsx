


"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const worldCupBalls = [
  {
    year: "1970",
    name: "Telstar",
    edition: "Mexico World Cup",
    desc: "The iconic 32-panel black and white design made for TV.",
    tech: "Genuine leather construction.",
    image: "https://assets.adidas.com/images/w_1880,f_auto,q_auto/994fc1f0b1f94f59b25355d996262e53_9366/JY8892_01_00_standard.jpg",
  },
  {
    year: "1998",
    name: "Tricolore",
    edition: "France World Cup",
    desc: "The first multi-colored official match ball with French colors.",
    tech: "Syntactic foam layer for better bounce.",
    image: "https://assets.adidas.com/images/w_1880,f_auto,q_auto/994fc1f0b1f94f59b25355d996262e53_9366/JY8892_01_00_standard.jpg",
  },
  {
    year: "2010",
    name: "Jabulani",
    edition: "South Africa World Cup",
    desc: "Infamous for its unpredictable flight paths and speed.",
    tech: "Thermally bonded 3D panels.",
    image: "https://assets.adidas.com/images/w_1880,f_auto,q_auto/994fc1f0b1f94f59b25355d996262e53_9366/JY8892_01_00_standard.jpg",
  },
  {
    year: "2014",
    name: "Brazuca",
    edition: "Brazil World Cup",
    desc: "Vibrant design reflecting Brazilian wish bands.",
    tech: "Six identical panels for aerodynamic stability.",
    image: "https://assets.adidas.com/images/w_1880,f_auto,q_auto/994fc1f0b1f94f59b25355d996262e53_9366/JY8892_01_00_standard.jpg",
  },
  {
    year: "2022",
    name: "Al Rihla",
    edition: "Qatar World Cup",
    desc: "Designed to travel faster in flight than any other ball.",
    tech: "Speedshell polyurethane skin with microtextures.",
    image: "https://assets.adidas.com/images/w_1880,f_auto,q_auto/994fc1f0b1f94f59b25355d996262e53_9366/JY8892_01_00_standard.jpg",
  },
];

export default function BallPerspectivePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    // ১. প্রি-লোডার কাউন্টডাউন অ্যানিমেশন
    const progressObj = { value: 0 };
    const loaderTween = gsap.to(progressObj, {
      value: 100,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        setLoadingProgress(Math.floor(progressObj.value));
      },
      onComplete: () => {
        // লোডার ফেড আউট হবে
        gsap.to(".preloader-screen", {
          opacity: 0,
          scale: 1.05,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            setIsLoading(false);
            runCinemaIntro(); // লোডিং শেষ হওয়া মাত্রই 'মেন সিনেমাটিক ইন্ট্রো' শুরু হবে
          }
        });
      }
    });

    let lenis: Lenis | null = null;
    let ctx: gsap.Context | null = null;
    let updateRaf: ((time: number) => void) | null = null;

    // ২. মেইন সিনেমাটিক ইন্ট্রো টেক্সট অ্যানিমেশন (যা আপনি চাচ্ছিলেন)
    const runCinemaIntro = () => {
      const introTl = gsap.timeline({
        onComplete: () => {
          // ইন্ট্রো টেক্সট শেষ হলে মেইন স্ক্রোল ট্রিগার ও প্যারালাক্স চালু হবে
          initScrollAnimations();
        }
      });

      // ইন্ট্রো এলিমেন্টগুলো স্ক্রিনে রিভিল হওয়া
      introTl.fromTo(".cinema-intro-screen", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
             .fromTo(".intro-title span", 
                { y: 40, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power4.out" }
             )
             .fromTo(".intro-subtitle", 
                { opacity: 0, letterSpacing: "0.2em" }, 
                { opacity: 0.6, letterSpacing: "0.5em", duration: 1.2, ease: "power2.out" }, 
                "-=0.4"
             )
             // ২ সেকেন্ড ইউজারকে ইন্ট্রো লেখাটি দেখানো (Hold)
             .to(".cinema-intro-screen", { delay: 1.5, duration: 0.6, opacity: 0, scale: 0.95, filter: "blur(10px)", ease: "power3.inOut" });
    };

    // ৩. মেইন স্ক্রোল এবং হাই-স্পিড প্যারালাক্স অ্যানিমেশন
    const initScrollAnimations = () => {
      lenis = new Lenis({
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);
      
      updateRaf = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(updateRaf);

      ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".perspective-card");
        const totalCards = cards.length;

        // মেইন কন্টেন্ট এন্ট্রান্স ড্রামা
        gsap.fromTo(".tunnel-bg", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 0.4, duration: 1 });
        gsap.fromTo(".watermark-text", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.2)" });
        gsap.fromTo(".back-btn", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });

        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${totalCards * 1100}`, 
            pin: true,
            pinSpacing: true,
            scrub: 0.35, // হাই-স্পিড রেসপন্স
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              let index = Math.floor(progress * totalCards);
              if (index >= totalCards) index = totalCards - 1;
              if (index < 0) index = 0;
              setActiveIndex(index);
            },
          },
        });

        // হাই-স্পিড প্যারালাক্স লুপ
        cards.forEach((card, index) => {
          const ballImg = card.querySelector(".ball-img");
          const leftText = card.querySelector(".left-text");
          const rightText = card.querySelector(".right-text");

          gsap.set(card, { autoAlpha: 0, zIndex: 1 });
          gsap.set(ballImg, { scale: 0.05, opacity: 0 });
          gsap.set(leftText, { x: -120, opacity: 0, scale: 0.8 });
          gsap.set(rightText, { x: 120, opacity: 0, scale: 0.8 });

          mainTl.to(
            card,
            { autoAlpha: 1, zIndex: 10, ease: "none" },
            index * 1.5
          )
          .to(
            ballImg,
            { scale: 1, opacity: 1, ease: "power2.out" },
            `<=`
          )
          .to(
            [leftText, rightText],
            { x: 0, opacity: 1, scale: 1, ease: "power3.out" },
            `<=+0.1` 
          )
          .to(
            ballImg,
            { scale: 2.8, opacity: 0, ease: "power2.in" },
            `>+0.3` 
          )
          .to(
            leftText,
            { x: -260, opacity: 0, scale: 1.2, ease: "power1.in" },
            `<=` 
          )
          .to(
            rightText,
            { x: 260, opacity: 0, scale: 1.2, ease: "power1.in" },
            `<=` 
          )
          .to(
            card,
            { autoAlpha: 0, zIndex: 1, ease: "none" },
            `<=+0.1`
          );
        });

      }, containerRef);
    };

    return () => {
      loaderTween.kill();
      if (ctx) ctx.revert();
      if (updateRaf) gsap.ticker.remove(updateRaf);
      if (lenis) lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#090b09] text-white font-mono overflow-hidden select-none">
      
      {/* ⚡ ১. প্রি-লোডার স্ক্রিন */}
      {isLoading && (
        <div className="preloader-screen fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070907] text-white font-mono">
          <div className="relative flex flex-col items-center space-y-6">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-500/10 border-t-emerald-500 animate-spin" />
            <div className="text-center space-y-1">
              <span className="text-xs uppercase tracking-[0.3em] text-zinc-500 block">Loading Assets</span>
              <span className="text-3xl font-black tracking-tight text-emerald-400">
                {loadingProgress}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 🎬 ২. নতুন ডেডিকেটেড সিনেমাটিক ইন্ট্রো স্ক্রিন (যা লোডিং এর ঠিক পরে এবং মেইন কনটেন্টের আগে আসবে) */}
      <div className="cinema-intro-screen invisible fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090b09] pointer-events-none">
        <div className="text-center space-y-3 px-4">
          <h1 className="intro-title text-2xl md:text-4xl font-black tracking-[0.2em] uppercase text-white flex justify-center items-center gap-1 overflow-hidden py-2">
            {"REVEALING THE LEGENDS".split(" ").map((word, i) => (
              <span key={i} className="inline-block mr-2">{word}</span>
            ))}
          </h1>
          <p className="intro-subtitle text-[10px] uppercase font-bold text-emerald-400 block tracking-[0.5em] transition-all duration-1000">
            SCROLL TO EXPLORE TIMELINE
          </p>
        </div>
      </div>

      {/* ব্যাক বাটন */}
      <Link 
        href="/E-Magazine" 
        className="back-btn fixed top-6 left-6 z-40 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white text-[10px] tracking-widest px-4 py-2 rounded-md uppercase transition-all"
      >
        ← Magazine Home
      </Link>

      {/* ব্যাকগ্রাউন্ড রেডিয়াল টানেল ভিব */}
      <div className="tunnel-bg absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,transparent_20%,#000_80%)] z-10" />
      
      {/* মেইন কন্টেইনার ভিউপোর্ট */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        
        {/* সেন্টার সুড়ঙ্গ ওয়াটারমার্ক */}
        <div className="watermark-text absolute text-[22px] md:text-[28px] font-black tracking-[0.4em] text-emerald-500/10 uppercase pointer-events-none z-0 mb-64 transition-all duration-300">
          {worldCupBalls[activeIndex]?.year} TIMELINE
        </div>

        {/* বল শোকেস লুপ */}
        {worldCupBalls.map((ball) => (
          <div
            key={ball.name}
            className="perspective-card absolute w-full max-w-5xl h-[400px] flex items-center justify-center"
          >
            <div className="w-full grid grid-cols-12 items-center gap-4 px-6 md:px-12">
              
              {/* বাম পাশ: ইয়ার ট্যাগ */}
              <div className="left-text col-span-3 text-right space-y-1 pr-6 border-r border-dashed border-white/10 hidden md:block will-change-transform">
                <span className="text-emerald-400 font-black text-5xl block tracking-tighter">
                  {ball.year}
                </span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block leading-tight">
                  {ball.edition}
                </span>
              </div>

              {/* সেন্টার: ফুটবল ইমেজ */}
              <div className="ball-img col-span-12 md:col-span-6 flex flex-col items-center justify-center relative will-change-transform">
                <div className="w-[240px] h-[240px] md:w-[310px] md:h-[310px] rounded-full flex items-center justify-center bg-black/50 border border-white/5 p-4 shadow-[0_0_70px_rgba(0,0,0,0.9)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={ball.image} 
                    alt={ball.name} 
                    className="w-full h-full object-contain filter drop-shadow-[0_12px_25px_rgba(16,185,129,0.2)]"
                  />
                </div>
                <h2 className="text-xl font-black tracking-widest uppercase mt-4 block md:hidden text-center">
                  {ball.name} <span className="text-emerald-400">({ball.year})</span>
                </h2>
              </div>

              {/* ডান পাশ: ইনফরমেশন */}
              <div className="right-text col-span-12 md:col-span-3 text-left space-y-3 pl-0 md:pl-6 will-change-transform">
                <div className="hidden md:block">
                  <h2 className="text-2xl font-black tracking-tight uppercase leading-none">
                    {ball.name}
                  </h2>
                  <span className="text-[9px] text-emerald-400 tracking-widest uppercase block mt-1">Official Match Ball</span>
                </div>
                
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  {ball.desc}
                </p>

                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg">
                  <span className="text-[9px] text-zinc-500 tracking-wider uppercase block mb-1">Tech Feature:</span>
                  <p className="text-[10px] text-emerald-400/90 leading-tight">
                    {ball.tech}
                  </p>
                </div>
              </div>

            </div>
          </div>
        ))}

      </div>

      {/* বটম প্রোগ্রেস লাইন */}
      <div className="fixed bottom-0 left-0 w-full h-[2px] bg-white/5 z-40">
        <div 
          className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-100" 
          style={{ width: `${((activeIndex + 1) / worldCupBalls.length) * 100}%` }}
        />
      </div>
    </div>
  );
}