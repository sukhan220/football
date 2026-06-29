// //E-Magazine/ball/page.tsx


"use client";

import React, { useState, useRef, useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer"; // Observer প্লাগইন ইম্পোর্ট করা হয়েছে
import { useGSAP } from "@gsap/react"; 

// Observer প্লাগইন রেজিস্টার করা হয়েছে
gsap.registerPlugin(ScrollTrigger, Observer);

type BallTranslation = {
  language: "EN" | "BN" | string;
  title: string;
  subtitle: string;
  excerpt: string;
  technology: string;
};

type BallData = {
  id: string;
  year: string;
  translations: Record<string, BallTranslation>;
  image: string;
};

export default function BallPerspectivePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const mainTriggerRef = useRef<any>(null);

  const [worldCupBalls, setWorldCupBalls] = useState<BallData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const [lang, setLang] = useState<"EN" | "BN">("BN");
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (isExpanded) {
      handleCloseExpanded();
    }
  }, [activeIndex]);

  const handleCloseExpanded = () => {
    setIsExpanded(false);
    if (lenisRef.current) lenisRef.current.start();
    if (mainTriggerRef.current) mainTriggerRef.current.enable();
  };

  const handleOpenExpanded = () => {
    setIsExpanded(true);
    if (lenisRef.current) lenisRef.current.stop();
    if (mainTriggerRef.current) mainTriggerRef.current.disable(false);
  };

  // FETCH BALL DATA FROM DATABASE
  useEffect(() => {
    async function loadBalls() {
      try {
        const res = await fetch("/api/magazine/ball");
        const json = await res.json();
        const balls = json.data || [];

        const formatted = balls.map((ball: any) => {
          const translationsMap: Record<string, BallTranslation> = {};
          
          ball.translations?.forEach((t: any) => {
            translationsMap[t.language] = {
              language: t.language,
              title: t.title || "Unknown",
              subtitle: t.subtitle || "World Cup",
              excerpt: t.excerpt || t.content?.description || "",
              technology: t.content?.technology || "",
            };
          });

          const fallback = ball.translations?.[0];
          const defaultText = {
            language: "EN",
            title: fallback?.title || "Unknown",
            subtitle: fallback?.subtitle || "World Cup",
            excerpt: fallback?.excerpt || fallback?.content?.description || "",
            technology: fallback?.content?.technology || "",
          };

          return {
            id: ball.id || Math.random().toString(),
            year: String(ball.year),
            translations: {
              EN: translationsMap["EN"] || defaultText,
              BN: translationsMap["BN"] || defaultText,
            },
            image: ball.image || ""
          };
        });

        setWorldCupBalls(formatted);
      } catch (err) {
        console.error("Failed to load ball data:", err);
      }
    }
    loadBalls();
  }, []);

  // GSAP & LENIS ANIMATIONS
  useGSAP(() => {
    if (typeof window === "undefined" || !containerRef.current || worldCupBalls.length === 0) return;

    window.scrollTo(0, 0);

    const progressObj = { value: 0 };
    const loaderTween = gsap.to(progressObj, {
      value: 100,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        setLoadingProgress(Math.floor(progressObj.value));
      },
      onComplete: () => {
        gsap.to(".preloader-screen", {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            setIsLoading(false);
            setTimeout(() => {
              ScrollTrigger.refresh(true);
            }, 50);
          }
        });
      }
    });

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      // gestureOrientation সেট করা হয়েছে যাতে হরাইজন্টাল সোয়াইপ ট্র্যাক করা যায়
      gestureOrientation: "both", 
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickHandler = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickHandler);
    gsap.ticker.lagSmoothing(0);

    const balls = gsap.utils.toArray<HTMLElement>(".ball-item");
    const labels = gsap.utils.toArray<HTMLElement>(".timeline-label");
    
    const getStep = () => window.innerWidth < 768 ? 170 : 220;
    let step = getStep();

    const updatePositions = (progress: number) => {
      step = getStep(); 
      const move = progress * step * (worldCupBalls.length - 1);

      balls.forEach((ball, index) => {
        const x = (index * step) - move;
        const distance = Math.abs(x);
        
        const maxDist = window.innerWidth < 768 ? 400 : 500;
        const ratio = Math.min(distance / maxDist, 1);

        const scale = window.innerWidth < 768 ? (1.75 - ratio * 1.25) : (1.25 - ratio * 0.65);
        const opacity = 1 - ratio * 0.75;
        const rotate = x / 14;
        const y = ratio * (window.innerWidth < 768 ? 15 : 50);

        gsap.set(ball, {
          x, y, scale, rotateY: rotate, opacity,
          zIndex: 100 - Math.floor(distance),
          transformPerspective: 1200
        });

        if (labels[index]) {
          const labelRatio = Math.min(distance / 350, 1);
          const labelScale = window.innerWidth < 768 ? (1.05 - labelRatio * 0.15) : (1.15 - labelRatio * 0.25);
          const labelOpacity = 1 - labelRatio * 0.75;

          gsap.set(labels[index], {
            x, scale: labelScale, opacity: labelOpacity,
            color: distance < step / 2 ? "#0ba5ec" : "#98a2b3" 
          });
        }

        if (distance < step / 2) {
          setActiveIndex(index);
        }
      });
    };

    updatePositions(0);

    const mainTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: () => `+=${worldCupBalls.length * 500}`, 
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true, 
      onUpdate: (self) => updatePositions(self.progress)
    });
    mainTriggerRef.current = mainTrigger;

    // Observer ব্যবহার করে টাচ এবং পয়েন্টার সোয়াইপ ডিটেক্ট করা
    // এবং পেজের ন্যাচারাল স্ক্রল পজিশন চেঞ্জ করা
    Observer.create({
      target: containerRef.current,
      type: "pointer,touch",
      onPress: () => {
        // ড্র্যাগ করার সময় লেনিসের স্মুথ স্ক্রল বন্ধ করা হয়
        lenis.stop();
      },
      onRelease: () => {
        // ড্র্যাগ শেষ হলে লেনিস আবার চালু করা হয়
        lenis.start();
      },
      onDrag: (self) => {
        if (isExpanded) return;
        // ডেল্টা এক্স এর ওপর ভিত্তি করে পেজের মেইন স্ক্রল পজিশন চেঞ্জ করা
        // মোবাইলে রেসপন্স ভালো করার জন্য মাল্টিপ্লায়ার ব্যবহার করা হয়েছে
        const speedMultiplier = window.innerWidth < 768 ? 2 : 1; 
        const currentScroll = window.scrollY;
        const targetScroll = currentScroll - (self.deltaX * speedMultiplier);
        window.scrollTo(0, targetScroll);
        // ScrollTrigger আপডেট করা যাতে পজিশন ক্যালকুলেশন ঠিক থাকে
        mainTrigger.update();
      }
    });

    const resizeHandler = () => {
      updatePositions(mainTrigger.progress);
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", resizeHandler);

    ScrollTrigger.refresh();

    return () => {
      loaderTween.kill();
      mainTrigger.kill();
      gsap.ticker.remove(tickHandler);
      lenis.destroy();
      window.removeEventListener("resize", resizeHandler);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: containerRef, dependencies: [worldCupBalls] });

  const currentBall = worldCupBalls[activeIndex];
  const currentData = currentBall?.translations[lang];
  const fullDescription = currentData?.excerpt || "";

  const textLimit = 60;
  const isLongText = fullDescription.length > textLimit;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#0c111d] text-white font-outfit select-none z-10 touch-none"
      style={{ contentVisibility: "auto" }}
    >
      {/* বাম পাশের নিচে কোণায় লোগো ওয়াটারমার্ক */}
      <div className="fixed bottom-12 right-6 z-50 pointer-events-none select-none opacity-[0.5] filter grayscale">
        <img 
          src="/logo.png" 
          alt="Watermark" 
          className="w-16 md:w-20 object-contain select-none"
        />
      </div>

      {/* প্রি-লোডার স্ক্রিন */}
      {(isLoading || worldCupBalls.length === 0) && (
        <div className="preloader-screen fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0c111d]">
          <div className="relative flex flex-col items-center space-y-4">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-brand-500/10" />
              <div className="absolute inset-0 rounded-full border-t-2 border-brand-500 animate-spin" />
              <span className="text-xs font-bold text-brand-400">{loadingProgress}%</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 block">Loading Archive...</span>
            </div>
          </div>
        </div>
      )}

      {/* ল্যাঙ্গুয়েজ টগল বাটন */}
      <div className="fixed top-6 right-6 z-50 flex items-center bg-gray-900/80 border border-white/10 rounded-full p-1 backdrop-blur-md">
        <button
          onClick={() => setLang("EN")}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            lang === "EN" ? "bg-brand-500 text-black shadow-lg" : "text-gray-400 hover:text-white"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLang("BN")}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            lang === "BN" ? "bg-brand-500 text-black shadow-lg" : "text-gray-400 hover:text-white"
          }`}
        >
          BN
        </button>
      </div>

      {/* মেইন ভিউপোর্ট (বল ও টাইমলাইন ব্যাকগ্রাউন্ডে থাকবে) */}
      <div className="h-full w-full flex flex-col justify-center items-center relative z-20 pt-4 md:pt-12">
        
        {/* থ্রিডি বল সোয়াইপার কন্টেইনার */}
        <div
          className="relative w-full h-[230px] md:h-[300px] overflow-hidden flex items-center justify-center mt-[-50px] md:mt-0"
          style={{ perspective: "1200px" }}
        >
          <div className="absolute left-1/2 top-1/2">
            {worldCupBalls.map((ball) => (
              <div
                key={ball.id}
                onClick={() => setPreviewImage(ball.image)} // বল ক্লিক করলে ইমেজ বড় হবে
                className="ball-item absolute left-[-55px] top-[-55px] md:left-[-90px] md:top-[-90px] w-[110px] md:w-[180px] flex flex-col items-center transition-shadow cursor-pointer"
              >
                <div className="rounded-full bg-transparent border-2 border-white p-2 md:p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden flex items-center justify-center aspect-square w-full">
                  <img
                    src={ball.image}
                    alt={ball.translations[lang]?.title || "Ball"}
                    className="w-full h-full object-contain transform scale-105"
                  />
                </div>
                <div className="w-4/5 h-2 bg-black/50 blur-md rounded-full mt-3 opacity-80" />
              </div>
            ))}
          </div>
        </div>

        {/* টাইমলাইন ট্র্যাক */}
        <div className="relative w-full h-[60px] flex items-center justify-center overflow-hidden my-1 md:my-2">
          <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent top-1/2 -translate-y-1/2" />
          
          <div className="absolute w-[95px] md:w-[135px] h-[38px] md:h-[45px] border-x border-brand-500/30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex justify-between items-center px-1">
            <div className="w-1 h-1 border-t border-l border-brand-400 absolute top-0 left-0" />
            <div className="w-1 h-1 border-b border-l border-brand-400 absolute bottom-0 left-0" />
            <div className="w-1 h-1 border-t border-r border-brand-400 absolute top-0 right-0" />
            <div className="w-1 h-1 border-b border-r border-brand-400 absolute bottom-0 right-0" />
            <div className="absolute inset-0 bg-brand-500/[0.01] shadow-[inset_0_0_8px_rgba(70,95,255,0.03)] rounded-sm" />
          </div>

          <div className="absolute left-1/2 top-0 h-full flex items-center">
            {worldCupBalls.map((ball) => (
              <div
                key={`label-${ball.id}`}
                className="timeline-label absolute left-[-60px] w-[120px] flex flex-col items-center justify-center text-center will-change-transform z-20"
              >
                <span className="text-sm md:text-base font-bold tracking-wider leading-none">{ball.year}</span>
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.12em] mt-1 font-bold opacity-60">
                  {ball.translations[lang]?.title || ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* টেক্সট কন্টেন্ট প্যানেল (স্বাভাবিক মোড) */}
        {!isExpanded && (
          <div className="w-full max-w-xs md:max-w-md text-center px-4 flex flex-col items-center z-40 mt-2">
            <div>
              <span className="text-[9px] md:text-[10px] text-brand-400 bg-brand-950/30 border border-brand-900/40 px-3 py-0.5 rounded-full uppercase tracking-[0.18em] font-bold">
                {currentData?.subtitle || "World Cup"}
              </span>
            </div>

            <div className="relative w-full mt-2 flex flex-col justify-center">
              <div className="text-[11px] md:text-sm leading-relaxed text-gray-300 px-3 py-2 bg-black/20 rounded-lg relative overflow-hidden h-[42px]">
                <p>
                  {isLongText ? `${fullDescription.slice(0, textLimit)}` : fullDescription}
                  {isLongText && (
                    <button 
                      onClick={handleOpenExpanded}
                      className="text-brand-400 ml-1 font-bold hover:underline cursor-pointer inline-block"
                    >
                      ...more
                    </button>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ফুল স্ক্রিন স্ক্রলযোগ্য টেক্সট লেয়ার (মোর দিলে ব্যাকগ্রাউন্ড হালকা ব্ল্যাক শ্যাডো হবে) */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] overflow-y-auto px-6 py-24 flex flex-col items-center">
          {/* Top Right Close Button - ✕ */}
          <button 
            onClick={handleCloseExpanded}
            className="fixed top-6 right-6 text-gray-400 hover:text-white text-xl font-bold w-10 h-10 flex items-center justify-center z-[60] bg-gray-900/80 rounded-full border border-white/10 cursor-pointer shadow-2xl transition-colors"
            title="Close"
          >
            ✕
          </button>

          {/* স্ক্রলযোগ্য মেইন টেক্সট কন্টেন্ট */}
          <div className="w-full max-w-md text-center flex flex-col items-center animate-fadeIn z-50">
            <span className="text-[10px] text-brand-400 bg-gray-900/90 border border-brand-900/60 px-4 py-1 rounded-full uppercase tracking-[0.2em] font-bold mb-3 shadow-lg">
              {currentData?.subtitle || "World Cup"} {currentBall?.year}
            </span>
            
            <h2 className="text-xl font-bold text-white mb-6 tracking-wide drop-shadow-md bg-gray-900/80 px-4 py-1 rounded-lg border border-white/5">
              {currentData?.title}
            </h2>

            {/* বিবরণী বক্সটি সম্পূর্ণ ট্রান্সপারেন্ট */}
            <p className="text-sm md:text-base leading-relaxed text-white text-left bg-transparent p-5 rounded-xl drop-shadow-[0_4px_12px_rgba(0,0,0,1)] whitespace-pre-line mb-8 font-medium">
              {fullDescription}
            </p>

            {/* নিচে গোল ক্লোজ বাটন - ✕ */}
            <button 
              onClick={handleCloseExpanded}
              className="w-12 h-12 flex items-center justify-center bg-brand-500 text-black font-bold rounded-full text-lg hover:bg-brand-400 transition-colors shadow-2xl cursor-pointer"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ইমেজ লাইটবক্স মডাল (বল ক্লিক করলে ইমেজ আলাদাভাবে বড় দেখাবে) */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewImage(null)} // যেকোনো জায়গায় ক্লিক করলে বন্ধ হবে
        >
          <button 
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl font-bold p-2 bg-gray-950/50 rounded-full cursor-pointer z-[110]"
          >
            ✕
          </button>
          <div className="max-w-full max-h-[85vh] flex items-center justify-center pointer-events-none">
            <img 
              src={previewImage} 
              alt="Ball Preview" 
              className="max-w-full max-h-[80vh] object-contain transform scale-100 transition-transform duration-300 shadow-[0_0_50px_rgba(255,255,255,0.15)] animate-zoomIn"
            />
          </div>
        </div>
      )}

      {/* সাইড কাউন্টার */}
      <div className="fixed bottom-6 right-6 z-50 text-right hidden sm:block opacity-70">
        <span className="text-[8px] text-gray-500 tracking-wider block mb-0.5">BALL</span>
        <div className="text-xs font-bold text-brand-400">
          0{activeIndex + 1} <span className="text-gray-600">/</span> 0{worldCupBalls.length}
        </div>
      </div>
    </div>
  );
}