

"use client";

import React, { useState, useEffect, useRef } from "react";

type WorldCupRecord = {
  year: number;
  host: string;
  hostCode: string;
  champion: string;
  champCode: string;
  runnerUp: string;
  runnerCode: string;
  score: string;
};

const historicalData: WorldCupRecord[] = [
  { year: 1930, host: "Uruguay", hostCode: "uy", champion: "Uruguay", champCode: "uy", runnerUp: "Argentina", runnerCode: "ar", score: "4 - 2" },
  { year: 1934, host: "Italy", hostCode: "it", champion: "Italy", champCode: "it", runnerUp: "Czechoslovakia", runnerCode: "cz", score: "2 - 1 (AET)" },
  { year: 1938, host: "France", hostCode: "fr", champion: "Italy", champCode: "it", runnerUp: "Hungary", runnerCode: "hu", score: "4 - 2" },
  { year: 1950, host: "Brazil", hostCode: "br", champion: "Uruguay", champCode: "uy", runnerUp: "Brazil", runnerCode: "br", score: "2 - 1" },
  { year: 1954, host: "Switzerland", hostCode: "ch", champion: "Germany", champCode: "de", runnerUp: "Hungary", runnerCode: "hu", score: "3 - 2" },
  { year: 1958, host: "Sweden", hostCode: "se", champion: "Brazil", champCode: "br", runnerUp: "Sweden", runnerCode: "se", score: "5 - 2" },
  { year: 1962, host: "Chile", hostCode: "cl", champion: "Brazil", champCode: "br", runnerUp: "Czechoslovakia", runnerCode: "cz", score: "3 - 1" },
  { year: 1966, host: "England", hostCode: "gb", champion: "England", champCode: "gb", runnerUp: "West Germany", runnerCode: "de", score: "4 - 2 (AET)" },
  { year: 1970, host: "Mexico", hostCode: "mx", champion: "Brazil", champCode: "br", runnerUp: "Italy", runnerCode: "it", score: "4 - 1" },
  { year: 1974, host: "West Germany", hostCode: "de", champion: "Germany", champCode: "de", runnerUp: "Netherlands", runnerCode: "nl", score: "2 - 1" },
  { year: 1978, host: "Argentina", hostCode: "ar", champion: "Argentina", champCode: "ar", runnerUp: "Netherlands", runnerCode: "nl", score: "3 - 1 (AET)" },
  { year: 1982, host: "Spain", hostCode: "es", champion: "Italy", champCode: "it", runnerUp: "West Germany", runnerCode: "de", score: "3 - 1" },
  { year: 1986, host: "Mexico", hostCode: "mx", champion: "Argentina", champCode: "ar", runnerUp: "West Germany", runnerCode: "de", score: "3 - 2" },
  { year: 1990, host: "Italy", hostCode: "it", champion: "Germany", champCode: "de", runnerUp: "Argentina", runnerCode: "ar", score: "1 - 0" },
  { year: 1994, host: "United States", hostCode: "us", champion: "Brazil", champCode: "br", runnerUp: "Italy", runnerCode: "it", score: "3 - 2 (Pen)" },
  { year: 1998, host: "France", hostCode: "fr", champion: "France", champCode: "fr", runnerUp: "Brazil", runnerCode: "br", score: "3 - 0" },
  { year: 2002, host: "South Korea / Japan", hostCode: "kr", champion: "Brazil", champCode: "br", runnerUp: "Germany", runnerCode: "de", score: "2 - 0" },
  { year: 2006, host: "Germany", hostCode: "de", champion: "Italy", champCode: "it", runnerUp: "France", runnerCode: "fr", score: "5 - 3 (Pen)" },
  { year: 2010, host: "South Africa", hostCode: "za", champion: "Spain", champCode: "es", runnerUp: "Netherlands", runnerCode: "nl", score: "1 - 0 (AET)" },
  { year: 2014, host: "Brazil", hostCode: "br", champion: "Germany", champCode: "de", runnerUp: "Argentina", runnerCode: "ar", score: "1 - 0 (AET)" },
  { year: 2018, host: "Russia", hostCode: "ru", champion: "France", champCode: "fr", runnerUp: "Croatia", runnerCode: "hr", score: "4 - 2" },
  { year: 2022, host: "Qatar", hostCode: "qa", champion: "Argentina", champCode: "ar", runnerUp: "France", runnerCode: "fr", score: "4 - 2 (Pen)" }
];

const countryCodes: { [key: string]: string } = {
  "Brazil": "br", "Italy": "it", "Germany": "de", "Argentina": "ar",
  "France": "fr", "Uruguay": "uy", "England": "gb", "Spain": "es"
};

type CountryTrophyState = {
  name: string;
  code: string;
  count: number;
  winningYears: number[];
};

export default function WorldCupInteractiveTimeline() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentYear, setCurrentYear] = useState<number>(1930);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMobileScroll = () => {
      if (!mobileScrollRef.current || window.innerWidth >= 1024) return;
      const cards = mobileScrollRef.current.querySelectorAll(".timeline-card");
      const containerLeft = mobileScrollRef.current.getBoundingClientRect().left;
      let activeYear = 1930;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.left - containerLeft <= 120) {
          activeYear = parseInt(card.getAttribute("data-year") || "1930", 10);
        }
      });
      setCurrentYear(activeYear);
    };

    const mContainer = mobileScrollRef.current;
    if (mContainer) mContainer.addEventListener("scroll", handleMobileScroll);
    return () => mContainer?.removeEventListener("scroll", handleMobileScroll);
  }, []);

  useEffect(() => {
    const handleDesktopScroll = () => {
      if (!desktopScrollRef.current || window.innerWidth < 1024) return;
      const cards = desktopScrollRef.current.querySelectorAll(".timeline-card");
      const containerTop = desktopScrollRef.current.getBoundingClientRect().top;
      const containerHeight = desktopScrollRef.current.clientHeight;
      let activeYear = 1930;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top - containerTop + (rect.height / 2);
        if (cardCenter > 0 && cardCenter < containerHeight) {
          activeYear = parseInt(card.getAttribute("data-year") || "1930", 10);
        }
      });
      setCurrentYear(activeYear);
    };

    const dContainer = desktopScrollRef.current;
    if (dContainer) dContainer.addEventListener("scroll", handleDesktopScroll);
    return () => dContainer?.removeEventListener("scroll", handleDesktopScroll);
  }, []);

  const scrollToYear = (year: number) => {
    setCurrentYear(year);
    if (window.innerWidth < 1024 && mobileScrollRef.current) {
      const targetCard = mobileScrollRef.current.querySelector(`[data-year="${year}"]`) as HTMLElement;
      if (targetCard) {
        const containerWidth = mobileScrollRef.current.clientWidth;
        const cardWidth = targetCard.clientWidth;
        const targetScrollLeft = targetCard.offsetLeft - (containerWidth / 2) + (cardWidth / 2);
        mobileScrollRef.current.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
      }
    } else if (window.innerWidth >= 1024 && desktopScrollRef.current) {
      const targetCard = desktopScrollRef.current.querySelector(`[data-year="${year}"]`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleCountryClick = (countryName: string) => {
    const championships = historicalData
      .filter((cup) => cup.champion === countryName)
      .map((cup) => cup.year);
    
    if (championships.length > 0) {
      const latestYear = Math.max(...championships);
      scrollToYear(latestYear);
    }
  };

  const getDynamicLeaderboard = (): CountryTrophyState[] => {
    const counts: { [key: string]: number } = {};
    const yearsMap: { [key: string]: number[] } = {};
    const introducedCountries: string[] = [];

    historicalData.forEach((cup) => {
      if (cup.year <= currentYear) {
        const champ = cup.champion;
        counts[champ] = (counts[champ] || 0) + 1;
        
        if (!yearsMap[champ]) yearsMap[champ] = [];
        yearsMap[champ].push(cup.year);

        if (!introducedCountries.includes(champ)) {
          introducedCountries.push(champ);
        }
      }
    });

    return introducedCountries
      .map((name) => ({
        name,
        code: countryCodes[name] || "un",
        count: counts[name] || 0,
        winningYears: yearsMap[name] || [],
      }))
      .sort((a, b) => b.count - a.count);
  };

  const sortedCountries = getDynamicLeaderboard();

  const getFlagUrl = (code: string) => {
    const cleanCode = code.toLowerCase();
    if (cleanCode === "gb-eng") return "https://flagcdn.com/w160/gb-eng.png";
    return `https://fastly.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${cleanCode}.svg`;
  };

//   const renderCard = (cup: WorldCupRecord, index: number) => {
//     const isCurrentActive = currentYear === cup.year;
//     const isPassed = currentYear >= cup.year;
//     const edition = index + 1;

//     return (
//       <div
//         key={cup.year}
//         data-year={cup.year}
//         className={`timeline-card shrink-0 transition-all duration-75 snap-center flex flex-col justify-center items-center ${
//           isCurrentActive 
//             ? "opacity-100 scale-100 lg:scale-105" 
//             : isPassed 
//               ? "opacity-60 scale-95 lg:scale-90" 
//               : "opacity-25 scale-95 lg:scale-90"
//         } w-full sm:w-[340px] lg:w-full lg:h-[65vh] px-4 sm:px-0`}
//       >
//         <div className="w-full lg:max-w-xl">
//           <div className={`w-full bg-[#111622] border transition-all duration-75 rounded-2xl pt-10 lg:p-8 shadow-2xl relative ${isCurrentActive ? 'border-amber-500/30 bg-[#131927]' : 'border-white/[0.04]'}`}>
            
//             <div className="grid grid-cols-7 items-center text-center mb-4 lg:mb-6">
//               <div className="col-span-3 flex flex-col items-center">
//                 <div className={`rounded-full border border-amber-400/40 p-0.5 bg-gray-950 flex items-center justify-center transition-all duration-75 overflow-hidden shrink-0 ${isCurrentActive ? 'w-10 h-10 lg:w-16 lg:h-16' : 'w-8 h-8'}`}>
//                   <img src={getFlagUrl(cup.champCode)} alt={cup.champion} className="w-full h-full object-cover rounded-full aspect-square" />
//                 </div>
//                 <span className="text-[6px] lg:text-[9px] font-bold text-amber-400 uppercase tracking-wider mt-1.5">CHAMPION</span>
//                 <span className="text-[11px] lg:text-base font-black text-white truncate max-w-full mt-0.5">{cup.champion}</span>
//               </div>

//               <div className="col-span-1 flex flex-col items-center justify-center">
//                 <div className="relative flex items-center justify-center w-8 h-8 mb-1">
//                   <span className="text-xl lg:text-2xl select-none">🏆</span>
//                   <div className={`absolute -top-1.5 -right-2 flex items-center justify-center rounded-full font-sans font-bold text-[7px] lg:text-[9px] h-3.5 w-3.5 lg:h-4 lg:w-4 shadow-md border ${
//                     isCurrentActive ? "bg-white text-gray-950 border-white" : "bg-gray-800 text-gray-300 border-gray-700"
//                   }`}>
//                     {edition}
//                   </div>
//                 </div>
//                 <span className="text-[5px] lg:text-[7px] text-gray-500 font-bold mb-0.5">FINAL SCORE</span>
//                 <div className="bg-gray-950 px-1 py-0.5 rounded border border-white/5">
//                   <span className="text-[8px] lg:text-[10px] font-mono font-bold text-gray-300 whitespace-nowrap">{cup.score}</span>
//                 </div>
//               </div>

//               <div className="col-span-3 flex flex-col items-center">
//                 <div className={`rounded-full border border-white/10 p-0.5 bg-gray-950 flex items-center justify-center transition-all duration-75 overflow-hidden shrink-0 ${isCurrentActive ? 'w-10 h-10 lg:w-16 lg:h-16' : 'w-8 h-8'}`}>
//                   <img src={getFlagUrl(cup.runnerCode)} alt={cup.runnerUp} className="w-full h-full object-cover rounded-full aspect-square" />
//                 </div>
//                 <span className="text-[6px] lg:text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1.5">RUNNER-UP</span>
//                 <span className="text-[11px] lg:text-base font-bold text-gray-400 truncate max-w-full mt-0.5">{cup.runnerUp}</span>
//               </div>
//             </div>

//             <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] px-1">
//               <div className="flex items-center space-x-2">
//                 <span className={`font-mono font-black transition-all duration-75 ${isCurrentActive ? 'text-amber-400 text-sm lg:text-xl' : 'text-gray-500 text-xs lg:text-base'}`}>
//                   {cup.year}
//                 </span>
//                 <span className="text-[9px] lg:text-xs text-gray-400 font-medium">| Host: {cup.host}</span>
//               </div>
//               <div className="w-5 h-3.5 border border-white/10 rounded-xs overflow-hidden bg-gray-900 shrink-0">
//                 <img src={getFlagUrl(cup.hostCode)} alt={cup.host} className="w-full h-full object-cover" />
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     );
//   };
const renderCard = (cup: WorldCupRecord, index: number) => {
    const isCurrentActive = currentYear === cup.year;
    const isPassed = currentYear >= cup.year;
    const edition = index + 1;

    return (
      <div
        key={cup.year}
        data-year={cup.year}
        className={`timeline-card shrink-0 transition-all duration-75 snap-center flex flex-col justify-center items-center ${
          isCurrentActive 
            ? "opacity-100 scale-100 lg:scale-105" 
            : isPassed 
              ? "opacity-60 scale-95 lg:scale-90" 
              : "opacity-25 scale-95 lg:scale-90"
        } w-full sm:w-[320px] lg:w-full lg:h-[65vh] px-4 sm:px-0`}
      >
        <div className="w-full lg:max-w-xl">
          {/* মোবাইলে টপ প্যাডিং pt-10 থেকে কমিয়ে py-2.5 px-3 করা হয়েছে কার্ড ছোট করার জন্য */}
          <div className={`w-full bg-[#111622] border transition-all duration-75 rounded-2xl mt-3.5 py-2.5 px-3 lg:p-8 shadow-2xl relative ${isCurrentActive ? 'border-amber-500/30 bg-[#131927]' : 'border-white/[0.04]'}`}>
            
            {/* নিচের মার্জিন mb-4 থেকে কমিয়ে mb-2 করা হয়েছে */}
            <div className="grid grid-cols-7 items-center text-center mb-2 lg:mb-6">
              <div className="col-span-3 flex flex-col items-center">
                {/* ফ্ল্যাগ সাইজ মোবাইলে w-10 থেকে কমিয়ে w-8, h-8 করা হয়েছে */}
                <div className={`rounded-full border border-amber-400/40 p-0.5 bg-gray-950 flex items-center justify-center transition-all duration-75 overflow-hidden shrink-0 ${isCurrentActive ? 'w-8 h-8 lg:w-16 lg:h-16' : 'w-7 h-7'}`}>
                  <img src={getFlagUrl(cup.champCode)} alt={cup.champion} className="w-full h-full object-cover rounded-full aspect-square" />
                </div>
                {/* টেক্সট সাইজ এবং টপ মার্জিন কমানো হয়েছে */}
                <span className="text-[5px] lg:text-[9px] font-bold text-amber-400 uppercase tracking-wider mt-1">CHAMPION</span>
                <span className="text-[10px] lg:text-base font-black text-white truncate max-w-full mt-0.5">{cup.champion}</span>
              </div>

              <div className="col-span-1 flex flex-col items-center justify-center">
                {/* ট্রফি এবং এডিশন ব্যাজের সাইজ মোবাইলে ছোট করা হয়েছে */}
                <div className="relative flex items-center justify-center w-6 h-6 mb-0.5">
                  <span className="text-sm lg:text-2xl select-none">🏆</span>
                  <div className={`absolute -top-1 -right-1.5 flex items-center justify-center rounded-full font-sans font-bold text-[6px] lg:text-[9px] h-3 w-3 lg:h-4 lg:w-4 shadow-md border ${
                    isCurrentActive ? "bg-white text-gray-950 border-white" : "bg-gray-800 text-gray-300 border-gray-700"
                  }`}>
                    {edition}
                  </div>
                </div>
                <span className="text-[4px] lg:text-[7px] text-gray-500 font-bold mb-0.5">FINAL SCORE</span>
                <div className="bg-gray-950 px-1 py-0.5 rounded border border-white/5">
                  <span className="text-[7px] lg:text-[10px] font-mono font-bold text-gray-300 whitespace-nowrap">{cup.score}</span>
                </div>
              </div>

              <div className="col-span-3 flex flex-col items-center">
                {/* রানার-আপ ফ্ল্যাগ সাইজও মোবাইলে ছোট করা হয়েছে */}
                <div className={`rounded-full border border-white/10 p-0.5 bg-gray-950 flex items-center justify-center transition-all duration-75 overflow-hidden shrink-0 ${isCurrentActive ? 'w-8 h-8 lg:w-16 lg:h-16' : 'w-7 h-7'}`}>
                  <img src={getFlagUrl(cup.runnerCode)} alt={cup.runnerUp} className="w-full h-full object-cover rounded-full aspect-square" />
                </div>
                <span className="text-[5px] lg:text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1">RUNNER-UP</span>
                <span className="text-[10px] lg:text-base font-bold text-gray-400 truncate max-w-full mt-0.5">{cup.runnerUp}</span>
              </div>
            </div>

            {/* নিচের রো-এর প্যাডিং ও টেক্সট সাইজ ছোট করা হয়েছে */}
            <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.04] px-1">
              <div className="flex items-center space-x-1.5">
                <span className={`font-mono font-black transition-all duration-75 ${isCurrentActive ? 'text-amber-400 text-xs lg:text-xl' : 'text-gray-500 text-[10px] lg:text-base'}`}>
                  {cup.year}
                </span>
                <span className="text-[8px] lg:text-xs text-gray-400 font-medium">| Host: {cup.host}</span>
              </div>
              <div className="w-4 h-2.5 border border-white/10 rounded-xs overflow-hidden bg-gray-900 shrink-0">
                <img src={getFlagUrl(cup.hostCode)} alt={cup.host} className="w-full h-full object-cover" />
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="w-full h-screen bg-[#06080c] text-white font-sans overflow-hidden antialiased select-none relative">
      
      {isLoading && (
        <div className="absolute inset-0 bg-[#06080c] z-50 flex flex-col items-center justify-center">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/10 border-t-amber-500 animate-spin"></div>
            <span className="text-lg">🏆</span>
          </div>
        </div>
      )}

      <div className="w-full h-full flex flex-col lg:flex-row mt-0 m-0 p-0">
        
        {/* মোবাইল টাইমলাইন স্লাইডার (হাইট সামান্য কমানো হয়েছে লিডারবোর্ড ফিট করার জন্য) */}
        <div 
          ref={mobileScrollRef}
          className="w-full h-[28vh] min-h-[140px] flex lg:hidden items-center overflow-x-auto overflow-y-hidden pt-10 pb-1 shrink-0 order-1 scroll-smooth snap-x snap-mandatory custom-scrollbar bg-[#06080c]"
        >
          {historicalData.map((cup, index) => renderCard(cup, index))}
        </div>

        {/* লিডারবোর্ড সেকশন - মোবাইলে স্পেস বাড়ানো হয়েছে (h-[72vh] এবং mt-0) */}
        <div className="w-full lg:w-[38%] h-[65vh] lg:h-screen bg-[#090b0f] order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-white/5 p-3 flex flex-col overflow-hidden mt-0 lg:mt-24">
          <div className="mb-2 flex items-center justify-between pb-1 border-b border-white/5">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs">🏆</span>
              <h2 className="text-[10px] lg:text-xs font-bold uppercase tracking-wider text-amber-400">Leaderboard</h2>
            </div>
            <span className="text-[9px] font-mono text-gray-500">Active: {currentYear}</span>
          </div>

          {/* লিডারবোর্ড লিস্ট */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {sortedCountries.map((country) => {
              const isActiveChampion = historicalData.find(cup => cup.year === currentYear)?.champion === country.name;
              
              return (
                <div
                  key={country.name}
                  onClick={() => handleCountryClick(country.name)}
                  className={`flex items-center justify-between border rounded-lg py-1.5 px-2 bg-[#0f131a]/40 cursor-pointer hover:bg-amber-500/[0.02] transition-all duration-75 ${
                    isActiveChampion ? "border-amber-500/30 bg-amber-500/[0.02] shadow-[0_0_15px_rgba(245,158,11,0.04)]" : "border-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center space-x-2 shrink-0">
                    <div className="w-4 h-2.5 rounded-xs overflow-hidden shadow bg-gray-950 border border-white/5 shrink-0">
                      <img src={getFlagUrl(country.code)} alt={country.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] lg:text-xs font-semibold text-gray-300 tracking-wide">{country.name}</span>
                  </div>

                  <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-1">
                    <div className="flex items-center space-x-4">
                      {country.winningYears.map((year, i) => (
                        <div key={i} className="relative flex items-center justify-center w-5 h-5 shrink-0">
                          <span className="text-sm select-none">🏆</span>
                          {/* সাল সম্পূর্ণ রিডঅ্যাবল রাখার জন্য বর্ডার সার্কেল হালকা বড় করা হয়েছে */}
                          <div className="absolute -top-1.5 -right-3 flex items-center justify-center rounded-full font-sans font-bold text-[8px] h-4 min-w-[18px] px-0.5 shadow-md border border-amber-400 text-amber-400 bg-transparent tracking-tighter">
                             {year}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border border-amber-500/30 bg-amber-500/5 rounded px-1.5 py-0.5 min-w-[18px] text-center shrink-0">
                      <span className="text-[9px] font-sans font-bold text-amber-400 italic">
                        {country.count}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ডেক্সটপ টাইমলাইন সেকশন */}
        <div 
          ref={desktopScrollRef}
          className="hidden lg:flex lg:w-[62%] h-full flex-col overflow-y-auto overflow-x-hidden p-8 bg-[#06080c] order-2 scroll-smooth snap-y snap-mandatory custom-scrollbar"
          style={{ scrollPaddingTop: "24vh" }}
        >
          <div className="pt-[24vh] pb-[30vh] space-y-[12vh] max-w-xl mx-auto w-full">
            {historicalData.map((cup, index) => renderCard(cup, index))}
          </div>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 4px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

    </div>
  );
}