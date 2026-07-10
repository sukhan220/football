// // // // // // ফিক্সচার পেজ

// // "use client";

// // import React, { useState, useEffect, useRef } from "react";
// // import { ChevronRight, List, BarChart3, X } from "lucide-react";

// // interface Fixture {
// //   id: string;
// //   season: string;
// //   homeTeam: string;
// //   awayTeam: string;
// //   homeTeamLogo: string | null;
// //   awayTeamLogo: string | null;
// //   matchDate: string;
// //   round: string | null;
// //   groupName: string | null;
// //   stage?: string;
// //   venue: string | null;
// //   homeScore: number | null;
// //   awayScore: number | null;
// //   status: "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" | "CANCELLED";
// // }

// // const stageNames: Record<string, string> = {
// //   GROUP_STAGE: "গ্রুপ স্টেজ",
// //   LAST_32: "রাউন্ড অব ৩২",
// //   ROUND_OF_32: "রাউন্ড অব ৩২",
// //   LAST_16: "রাউন্ড অব ১৬",
// //   ROUND_OF_16: "রাউন্ড অব ১৬",
// //   QUARTER_FINALS: "কোয়ার্টার ফাইনাল",
// //   SEMI_FINALS: "সেমি ফাইনাল",
// //   THIRD_PLACE: "তৃতীয় স্থান নির্ধারণী",
// //   FINAL: "ফাইনাল",
// //   KNOCKOUT_STAGE: "নকআউট স্টেজ"
// // };

// // type StandingTeam = {
// //   name: string;
// //   logo: string | null;
// //   mp: number;
// //   w: number;
// //   d: number;
// //   l: number;
// //   gf: number;
// //   ga: number;
// //   pts: number;
// // };

// // export default function FixturesPage() {
// //   const [fixtures, setFixtures] = useState<Fixture[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [mobileTab, setMobileTab] = useState<"matches" | "standings">("matches");
// //   const [isAllMatchesOpen, setIsAllMatchesOpen] = useState(false);
// //   const currentMatchRef = useRef<HTMLDivElement | null>(null);

// //   useEffect(() => {
// //     async function fetchData() {
// //       try {
// //         const res = await fetch("/api/fixtures?competitionCode=WC&season=2026");
// //         if (!res.ok) throw new Error(`API error! Status: ${res.status}`);
// //         const data = await res.json();
        
// //         if (Array.isArray(data)) {
// //           const sorted = data.sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
// //           setFixtures(sorted);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching fixtures:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //     fetchData();
// //   }, []);

// //   useEffect(() => {
// //     if (isAllMatchesOpen && currentMatchRef.current) {
// //       setTimeout(() => {
// //         currentMatchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
// //       }, 100);
// //     }
// //   }, [isAllMatchesOpen]);

// //   const formatMatchTime = (dateString: string) => {
// //     const date = new Date(dateString);
// //     const today = new Date();
// //     const tomorrow = new Date(today);
// //     tomorrow.setDate(tomorrow.getDate() + 1);

// //     const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

// //     if (date.toDateString() === today.toDateString()) {
// //       return { day: "আজ", time: timeStr, isCurrent: true };
// //     } else if (date.toDateString() === tomorrow.toDateString()) {
// //       return { day: "আগামীকাল", time: timeStr, isCurrent: true };
// //     } else {
// //       const formattedDay = date.toLocaleDateString("bn-BD", { weekday: "long", month: "short", day: "numeric" });
// //       return { day: formattedDay, time: timeStr, isCurrent: false };
// //     }
// //   };

// //   const currentMatches = fixtures.filter((match) => {
// //     if (match.status === "LIVE") return true;
// //     const { isCurrent } = formatMatchTime(match.matchDate);
// //     return isCurrent;
// //   });

// //   console.log("Current Matches:", currentMatches);

// //   // গ্রুপ বা স্টেজের নাম ফরম্যাট করার হেল্পার ফাংশন
// //   const formatGroupName = (match: Fixture) => {
// //     if (match.stage && match.stage !== "GROUP_STAGE") {
// //       return stageNames[match.stage] || match.stage;
// //     }
// //     if (match.groupName) {
// //       const cleanGroup = match.groupName.replace("GROUP_", "").replace("Group_", "").toUpperCase();
// //       return `গ্রুপ ${cleanGroup}`;
// //     }
// //     return "";
// //   };

// //   const getGroupedFixtures = (matchList: Fixture[]) => {
// //     const groupsMap: Record<string, { stageKey: string; groupName: string; isCurrentGroup: boolean; matches: Fixture[] }> = {};
// //     const groupOrder: string[] = [];

// //     matchList.forEach((match) => {
// //       const stageKey = match.stage || (match.groupName ? "GROUP_STAGE" : "KNOCKOUT_STAGE");
// //       const { day, isCurrent } = formatMatchTime(match.matchDate);
      
// //       const displayStageOrGroup = (stageKey === "GROUP_STAGE" && match.groupName)
// //         ? `গ্রুপ ${match.groupName.replace("GROUP_", "").replace("Group_", "").toUpperCase()}` 
// //         : (stageNames[stageKey] || stageKey);

// //       const groupName = `${displayStageOrGroup} · ${day}`;
// //       const uniqueKey = `${stageKey}_${groupName}`;

// //       if (!groupsMap[uniqueKey]) {
// //         groupsMap[uniqueKey] = { 
// //           stageKey, 
// //           groupName, 
// //           isCurrentGroup: isCurrent || match.status === "LIVE", 
// //           matches: [] 
// //         };
// //         groupOrder.push(uniqueKey);
// //       }
// //       groupsMap[uniqueKey].matches.push(match);
// //     });

// //     return groupOrder.map((key) => groupsMap[key]);
// //   };

// //   const generateGroupStandings = (matches: Fixture[]) => {
// //     const standingsMap: Record<string, Record<string, StandingTeam>> = {};
// //     matches.forEach(match => {
// //       if (match.status !== "FINISHED" || !match.groupName) return;
// //       const group = match.groupName.replace("GROUP_", "").replace("Group_", "").toUpperCase();
// //       if (!standingsMap[group]) standingsMap[group] = {};
      
// //       [match.homeTeam, match.awayTeam].forEach(team => {
// //         if (!standingsMap[group][team]) {
// //           standingsMap[group][team] = {
// //             name: team,
// //             logo: team === match.homeTeam ? match.homeTeamLogo : match.awayTeamLogo,
// //             mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0
// //           };
// //         }
// //       });

// //       const home = standingsMap[group][match.homeTeam];
// //       const away = standingsMap[group][match.awayTeam];
// //       const hScore = match.homeScore ?? 0;
// //       const aScore = match.awayScore ?? 0;

// //       home.mp += 1; away.mp += 1;
// //       home.gf += hScore; home.ga += aScore;
// //       away.gf += aScore; away.ga += hScore;

// //       if (hScore > aScore) { home.w += 1; home.pts += 3; away.l += 1; }
// //       else if (hScore < aScore) { away.w += 1; away.pts += 3; home.l += 1; }
// //       else { home.d += 1; away.d += 1; home.pts += 1; away.pts += 1; }
// //     });

// //     const sortedGroups: Record<string, StandingTeam[]> = {};
// //     Object.keys(standingsMap).sort().forEach(group => {
// //       sortedGroups[group] = Object.values(standingsMap[group]).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
// //     });
// //     return sortedGroups;
// //   };

// //   const groupStandings = generateGroupStandings(fixtures);

// //   const renderMatchCard = (match: Fixture) => {
// //     const { day, time } = formatMatchTime(match.matchDate);
// //     const displayGroupName = formatGroupName(match);

// //     return (
// //       <div 
// //         key={match.id} 
// //         className={`bg-[#171717] border rounded-xl p-4 flex flex-col justify-between hover:bg-[#202124] transition-all group ${
// //           match.status === "LIVE" ? "border-rose-500/50 ring-1 ring-rose-500/20" : "border-[#303134]"
// //         }`}
// //       >
// //         {/* 🏷️ কার্ডের একদম ওপরে গ্রুপের নাম (আপনার স্ক্রিনশট অনুযায়ী যোগ করা হলো) */}
// //         {displayGroupName && (
// //           <div className="text-[11px] font-medium text-gray-400 mb-2.5 pb-1 border-b border-[#303134]/30">
// //             {displayGroupName}
// //           </div>
// //         )}

// //         <div className="flex justify-between items-center w-full">
// //           <div className="space-y-3.5 flex-1 min-w-0 pr-2">
// //             {/* হোম টিম */}
// //             <div className="flex items-center gap-3">
// //               <div className="w-5 h-5 bg-[#303134]/50 rounded flex items-center justify-center overflow-hidden shrink-0">
// //                 {match.homeTeamLogo ? <img src={match.homeTeamLogo} alt="" className="w-full h-full object-cover" /> : <span className="text-[9px] text-gray-400 font-bold">{match.homeTeam.substring(0, 2)}</span>}
// //               </div>
// //               <span className="text-sm font-normal text-[#e8eaed] truncate group-hover:text-white">{match.homeTeam}</span>
// //             </div>
// //             {/* অ্যাওয়ে টিম */}
// //             <div className="flex items-center gap-3">
// //               <div className="w-5 h-5 bg-[#303134]/50 rounded flex items-center justify-center overflow-hidden shrink-0">
// //                 {match.awayTeamLogo ? <img src={match.awayTeamLogo} alt="" className="w-full h-full object-cover" /> : <span className="text-[9px] text-gray-400 font-bold">{match.awayTeam.substring(0, 2)}</span>}
// //               </div>
// //               <span className="text-sm font-normal text-[#e8eaed] truncate group-hover:text-white">{match.awayTeam}</span>
// //             </div>
// //           </div>

// //           {/* ডানপাশ: স্কোর/টাইম */}
// //           <div className="border-l border-[#303134] pl-4 flex flex-col items-center justify-center min-w-[100px] text-center">
// //             {match.status === "SCHEDULED" ? (
// //               <div className="space-y-0.5">
// //                 <span className="text-xs text-[#bdc1c6] block font-medium">{day}</span>
// //                 <span className="text-xs text-gray-400 block tracking-tight">{time}</span>
// //               </div>
// //             ) : (
// //               <div className="space-y-2">
// //                 <div className="flex items-center justify-center gap-2 font-mono text-sm font-bold bg-[#303134]/40 px-2.5 py-1 rounded border border-[#303134]">
// //                   <span className={match.status === "FINISHED" && match.homeScore! > match.awayScore! ? "text-white" : "text-gray-400"}>{match.homeScore ?? 0}</span>
// //                   <span className="text-gray-600">:</span>
// //                   <span className={match.status === "FINISHED" && match.awayScore! > match.homeScore! ? "text-white" : "text-gray-400"}>{match.awayScore ?? 0}</span>
// //                 </div>
// //                 <div className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border shadow-sm ${
// //                   match.status === "LIVE" ? "bg-rose-950/40 text-rose-400 border-rose-500/30 animate-pulse" : "bg-[#202124] text-gray-400 border-[#303134]"
// //                 }`}>
// //                   {match.status === "LIVE" ? "LIVE" : "MATCH STORY"}
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   let hasSetRef = false;
// //   const setScrollRef = (isCurrentGroup: boolean, element: HTMLDivElement | null) => {
// //     if (isCurrentGroup && !hasSetRef && element) {
// //       currentMatchRef.current = element;
// //       hasSetRef = true;
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-[#202124] text-[#e8eaed] font-sans pb-20 lg:pb-8">
      
// //       {/* 🔝 মেইন হেডার বার */}
// //       <div className="bg-[#171717] border-b border-[#303134] sticky top-0 z-40 shadow-sm">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <h1 className="text-xl md:text-2xl font-normal text-white tracking-tight">২০২৬ ফিফা ওয়ার্ল্ড কাপ</h1>
// //             <span className="text-gray-600 hidden sm:inline text-xl">|</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* 🏟️ কন্টেন্ট লেআউট */}
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
// //         {loading ? (
// //           <div className="h-32 bg-[#303134]/50 rounded-xl animate-pulse"></div>
// //         ) : (
// //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
// //             {/* 🕒 বাম কলাম: মেইন স্ক্রিন */}
// //             <div className={`lg:col-span-2 space-y-6 ${mobileTab === "matches" ? "block" : "hidden lg:block"}`}>
// //               <div className="text-lg font-normal text-white pb-2 border-b border-[#303134]">
// //                 <span>আজ ও আগামীকালের ম্যাচ</span>
// //               </div>

// //               {currentMatches.length === 0 ? (
// //                 <div className="text-center py-12 bg-[#171717] rounded-xl border border-[#303134] text-gray-500 text-sm px-4">
// //                   আজ বা আগামীকাল কোনো match সিডিউল নেই। নিচের বাটনে ক্লিক করে সব ম্যাচ দেখুন।
// //                 </div>
// //               ) : (
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                   {currentMatches.map(match => renderMatchCard(match))}
// //                 </div>
// //               )}

// //               {/* 🔘 আরও ম্যাচ দেখার বাটন */}
// //               <div className="pt-2">
// //                 <button 
// //                   onClick={() => {
// //                     hasSetRef = false;
// //                     setIsAllMatchesOpen(true);
// //                   }}
// //                   className="w-full py-3 bg-[#171717] hover:bg-[#303134]/50 border border-[#303134] rounded-full text-sm font-medium text-gray-300 transition flex items-center justify-center gap-2"
// //                 >
// //                   আরও ম্যাচ <ChevronRight className="w-4 h-4" />
// //                 </button>
// //               </div>
// //             </div>

// //             {/* 📊 ডান কলাম: পজিশন/অবстояние টেবিল */}
// //             <div className={`space-y-6 ${mobileTab === "standings" ? "block" : "hidden lg:block"}`}>
// //               <div className="text-lg font-normal text-white pb-2 border-b border-[#303134]">
// //                 <span>অবস্থান</span>
// //               </div>
// //               <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
// //                 {Object.entries(groupStandings).map(([groupName, teams]) => (
// //                   <div key={groupName} className="bg-[#171717] border border-[#303134] rounded-xl p-4">
// //                     <div className="text-xs font-bold text-amber-500 mb-3 uppercase tracking-wider">গ্রুপ {groupName}</div>
                    
// //                     <div className="w-full overflow-x-auto scrollbar-none">
// //                       <table className="w-full text-left text-xs text-[#bdc1c6] min-w-[240px]">
// //                         <thead>
// //                           <tr className="border-b border-[#303134] text-[10px] text-gray-500 font-medium">
// //                             <th className="py-2 pr-2">টিম</th>
// //                             <th className="py-2 text-center w-8">MP</th>
// //                             <th className="py-2 text-center w-8 hidden sm:table-cell">W</th>
// //                             <th className="py-2 text-center w-8 hidden sm:table-cell">D</th>
// //                             <th className="py-2 text-center w-8 hidden sm:table-cell">L</th>
// //                             <th className="py-2 text-center w-10 hidden sm:table-cell">GF</th>
// //                             <th className="py-2 text-center w-10 hidden sm:table-cell">GA</th>
// //                             <th className="py-2 text-center w-10">PTS</th>
// //                           </tr>
// //                         </thead>
// //                         <tbody className="divide-y divide-[#303134]/30">
// //                           {teams.map((team, idx) => (
// //                             <tr key={team.name} className="hover:bg-[#202124]/50 transition">
// //                               <td className="py-2 pr-2 flex items-center gap-2 max-w-[110px] sm:max-w-none">
// //                                 <span className="text-gray-600 text-[10px] shrink-0">{idx + 1}</span>
// //                                 <span className="text-gray-200 font-medium truncate">{team.name}</span>
// //                               </td>
// //                               <td className="py-2 text-center font-mono text-gray-400">{team.mp}</td>
// //                               <td className="py-2 text-center font-mono text-gray-400 hidden sm:table-cell">{team.w}</td>
// //                               <td className="py-2 text-center font-mono text-gray-400 hidden sm:table-cell">{team.d}</td>
// //                               <td className="py-2 text-center font-mono text-gray-400 hidden sm:table-cell">{team.l}</td>
// //                               <td className="py-2 text-center font-mono text-gray-400 hidden sm:table-cell">{team.gf}</td>
// //                               <td className="py-2 text-center font-mono text-gray-400 hidden sm:table-cell">{team.ga}</td>
// //                               <td className="py-2 text-center font-mono font-bold text-white">{team.pts}</td>
// //                             </tr>
// //                           ))}
// //                         </tbody>
// //                       </table>
// //                     </div>

// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //           </div>
// //         )}
// //       </div>

// //       {/* 🗺️ ফুল-স্ক্রিন ওভারলে মডাল */}
// //       {isAllMatchesOpen && (
// //         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-end md:items-center p-0 md:p-4 animate-fadeIn">
// //           <div className="bg-[#202124] w-full max-w-4xl h-[90vh] md:h-[85vh] rounded-t-2xl md:rounded-2xl border border-[#303134] flex flex-col overflow-hidden shadow-2xl">
            
// //             <div className="bg-[#171717] px-6 py-4 border-b border-[#303134] flex items-center justify-between shrink-0">
// //               <h2 className="text-md md:text-lg font-normal text-white truncate pr-4">২০২৬ ফিফা ওয়ার্ল্ড কাপ ম্যাচ (সমস্ত সময়সূচী)</h2>
// //               <button 
// //                 onClick={() => setIsAllMatchesOpen(false)}
// //                 className="p-1 rounded-full hover:bg-[#303134] text-gray-400 hover:text-white transition shrink-0"
// //               >
// //                 <X className="w-5 h-5" />
// //               </button>
// //             </div>

// //             <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-[#1f2023] scrollbar-thin scrollbar-thumb-[#303134]">
// //               {getGroupedFixtures(fixtures).map(({ groupName, isCurrentGroup, matches }, idx) => (
// //                 <div 
// //                   key={idx} 
// //                   className="space-y-3"
// //                   ref={(el) => setScrollRef(isCurrentGroup, el)}
// //                 >
// //                   <div className={`text-xs font-medium px-4 py-2 rounded-lg border ${
// //                     isCurrentGroup 
// //                       ? "bg-amber-950/20 text-amber-400 border-amber-500/30" 
// //                       : "bg-[#282a2d] text-gray-300 border-[#303134]/60"
// //                   }`}>
// //                     {groupName} {isCurrentGroup && "• (চলমান)"}
// //                   </div>
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                     {matches.map(match => renderMatchCard(match))}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //           </div>
// //         </div>
// //       )}

// //       {/* 📱 রেসপনসিভ মোবাইল বটম বার */}
// //       <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#171717] border-t border-[#303134] h-14 z-40 flex items-center justify-around px-4">
// //         <button onClick={() => setMobileTab("matches")} className={`flex flex-col items-center justify-center w-20 h-full ${mobileTab === "matches" ? "text-amber-500 font-bold" : "text-gray-500"}`}>
// //           <List className="w-5 h-5 mb-0.5" /><span className="text-[10px]">খেলা</span>
// //         </button>
// //         <button onClick={() => setMobileTab("standings")} className={`flex flex-col items-center justify-center w-20 h-full ${mobileTab === "standings" ? "text-amber-500 font-bold" : "text-gray-500"}`}>
// //           <BarChart3 className="w-5 h-5 mb-0.5" /><span className="text-[10px]">অবস্থান</span>
// //         </button>
// //       </div>

// //     </div>
// //   );
// // }


// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { ChevronRight, List, BarChart3, X, GitCommit } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// interface Fixture {
//   id: string;
//   season: string;
//   homeTeam: string;
//   awayTeam: string;
//   homeTeamLogo: string | null;
//   awayTeamLogo: string | null;
//   matchDate: string;
//   round: string | null;
//   groupName: string | null;
//   stage?: string;
//   venue: string | null;
//   homeScore: number | null;
//   awayScore: number | null;
//   status: "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" | "CANCELLED";
// }

// const stageNames: Record<string, string> = {
//   GROUP_STAGE: "গ্রুপ স্টেজ",
//   ROUND_OF_32: "রাউন্ড অব ৩২",
//   LAST_32: "রাউন্ড অব ৩২",
//   ROUND_OF_16: "রাউন্ড অব ১৬",
//   LAST_16: "রাউন্ড অব ১৬",
//   QUARTER_FINALS: "কোয়ার্টার ফাইনাল",
//   SEMI_FINALS: "সেমি ফাইনাল",
//   THIRD_PLACE: "তৃতীয় স্থান নির্ধারণী",
//   FINAL: "ফাইনাল",
//   KNOCKOUT_STAGE: "নকআউট স্টেজ"
// };

// // ব্র্যাকেট অর্ডারের জন্য স্টেজের সিকোয়েন্স
// const bracketStagesOrder = [
//   "ROUND_OF_16",
//   "QUARTER_FINALS",
//   "SEMI_FINALS",
//   "FINAL"
// ];

// type StandingTeam = {
//   name: string;
//   logo: string | null;
//   mp: number;
//   w: number;
//   d: number;
//   l: number;
//   gf: number;
//   ga: number;
//   pts: number;
// };

// export default function FixturesPage() {
//   const [fixtures, setFixtures] = useState<Fixture[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [mobileTab, setMobileTab] = useState<"matches" | "standings" | "bracket">("matches");
//   const [isAllMatchesOpen, setIsAllMatchesOpen] = useState(false);
//   const currentMatchRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const res = await fetch("/api/fixtures?competitionCode=WC&season=2026");
//         if (!res.ok) throw new Error(`API error! Status: ${res.status}`);
//         const data = await res.json();
        
//         if (Array.isArray(data)) {
//           const sorted = data.sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
//           setFixtures(sorted);
//         }
//       } catch (error) {
//         console.error("Error fetching fixtures:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   const formatMatchTime = (dateString: string) => {
//     const date = new Date(dateString);
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

//     if (date.toDateString() === today.toDateString()) {
//       return { day: "আজ", time: timeStr, isCurrent: true };
//     } else if (date.toDateString() === tomorrow.toDateString()) {
//       return { day: "আগামীকাল", time: timeStr, isCurrent: true };
//     } else {
//       const formattedDay = date.toLocaleDateString("bn-BD", { weekday: "long", month: "short", day: "numeric" });
//       return { day: formattedDay, time: timeStr, isCurrent: false };
//     }
//   };

//   const currentMatches = fixtures.filter((match) => {
//     if (match.status === "LIVE") return true;
//     const { isCurrent } = formatMatchTime(match.matchDate);
//     return isCurrent;
//   });

//   const formatGroupName = (match: Fixture) => {
//     if (match.stage && match.stage !== "GROUP_STAGE") {
//       return stageNames[match.stage] || match.stage;
//     }
//     if (match.groupName) {
//       return `গ্রুপ ${match.groupName.replace("GROUP_", "").replace("Group_", "").toUpperCase()}`;
//     }
//     return "";
//   };

//   const getGroupedFixtures = (matchList: Fixture[]) => {
//     const groupsMap: Record<string, { stageKey: string; groupName: string; isCurrentGroup: boolean; matches: Fixture[] }> = {};
//     const groupOrder: string[] = [];

//     matchList.forEach((match) => {
//       const stageKey = match.stage || (match.groupName ? "GROUP_STAGE" : "KNOCKOUT_STAGE");
//       const { day, isCurrent } = formatMatchTime(match.matchDate);
      
//       const displayStageOrGroup = (stageKey === "GROUP_STAGE" && match.groupName)
//         ? `গ্রুপ ${match.groupName.replace("GROUP_", "").replace("Group_", "").toUpperCase()}` 
//         : (stageNames[stageKey] || stageKey);

//       const groupName = `${displayStageOrGroup} · ${day}`;
//       const uniqueKey = `${stageKey}_${groupName}`;

//       if (!groupsMap[uniqueKey]) {
//         groupsMap[uniqueKey] = { 
//           stageKey, 
//           groupName, 
//           isCurrentGroup: isCurrent || match.status === "LIVE", 
//           matches: [] 
//         };
//         groupOrder.push(uniqueKey);
//       }
//       groupsMap[uniqueKey].matches.push(match);
//     });

//     return groupOrder.map((key) => groupsMap[key]);
//   };

//   const generateGroupStandings = (matches: Fixture[]) => {
//     const standingsMap: Record<string, Record<string, StandingTeam>> = {};
//     matches.forEach(match => {
//       if (match.status !== "FINISHED" || !match.groupName) return;
//       const group = match.groupName.replace("GROUP_", "").replace("Group_", "").toUpperCase();
//       if (!standingsMap[group]) standingsMap[group] = {};
      
//       [match.homeTeam, match.awayTeam].forEach(team => {
//         if (!standingsMap[group][team]) {
//           standingsMap[group][team] = {
//             name: team,
//             logo: team === match.homeTeam ? match.homeTeamLogo : match.awayTeamLogo,
//             mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0
//           };
//         }
//       });

//       const home = standingsMap[group][match.homeTeam];
//       const away = standingsMap[group][match.awayTeam];
//       const hScore = match.homeScore ?? 0;
//       const aScore = match.awayScore ?? 0;

//       home.mp += 1; away.mp += 1;
//       home.gf += hScore; home.ga += aScore;
//       away.gf += aScore; away.ga += hScore;

//       if (hScore > aScore) { home.w += 1; home.pts += 3; away.l += 1; }
//       else if (hScore < aScore) { away.w += 1; away.pts += 3; home.l += 1; }
//       else { home.d += 1; away.d += 1; home.pts += 1; away.pts += 1; }
//     });

//     const sortedGroups: Record<string, StandingTeam[]> = {};
//     Object.keys(standingsMap).sort().forEach(group => {
//       sortedGroups[group] = Object.values(standingsMap[group]).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
//     });
//     return sortedGroups;
//   };

//   const groupStandings = generateGroupStandings(fixtures);

//   // ব্র্যাকেট ডেটা প্রিপারেশন
//   const getBracketData = () => {
//     return bracketStagesOrder.map(stage => {
//       return {
//         stageKey: stage,
//         stageName: stageNames[stage],
//         matches: fixtures.filter(f => f.stage === stage || (stage === "ROUND_OF_16" && f.stage === "LAST_16"))
//       };
//     });
//   };

//   const renderMatchCard = (match: Fixture, compact = false) => {
//     const { day, time } = formatMatchTime(match.matchDate);
//     const displayGroupName = formatGroupName(match);

//     return (
//       <motion.div 
//         key={match.id} 
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -10 }}
//         className={`bg-[#171717] border rounded-xl flex flex-col justify-between hover:bg-[#202124] transition-all group ${
//           compact ? "p-3 text-xs w-64 md:w-72 shrink-0 border-amber-500/20" : "p-4 border-[#303134]"
//         } ${match.status === "LIVE" ? "border-rose-500/50 ring-1 ring-rose-500/20" : ""}`}
//       >
//         {!compact && displayGroupName && (
//           <div className="text-[11px] font-medium text-gray-400 mb-2.5 pb-1 border-b border-[#303134]/30">
//             {displayGroupName}
//           </div>
//         )}

//         <div className="flex justify-between items-center w-full gap-2">
//           <div className="space-y-2.5 flex-1 min-w-0">
//             {/* হোম টিম */}
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-[#303134]/50 rounded flex items-center justify-center overflow-hidden shrink-0">
//                 {match.homeTeamLogo ? <img src={match.homeTeamLogo} alt="" className="w-full h-full object-cover" /> : <span className="text-[8px] text-gray-400 font-bold">{match.homeTeam.substring(0, 2)}</span>}
//               </div>
//               <span className="font-normal text-[#e8eaed] truncate group-hover:text-white">{match.homeTeam}</span>
//             </div>
//             {/* অ্যাওয়ে টিম */}
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-[#303134]/50 rounded flex items-center justify-center overflow-hidden shrink-0">
//                 {match.awayTeamLogo ? <img src={match.awayTeamLogo} alt="" className="w-full h-full object-cover" /> : <span className="text-[8px] text-gray-400 font-bold">{match.awayTeam.substring(0, 2)}</span>}
//               </div>
//               <span className="font-normal text-[#e8eaed] truncate group-hover:text-white">{match.awayTeam}</span>
//             </div>
//           </div>

//           {/* স্কোর/টাইম সেকশন */}
//           <div className="border-l border-[#303134] pl-2 flex flex-col items-center justify-center min-w-[70px] text-center shrink-0">
//             {match.status === "SCHEDULED" ? (
//               <div className="space-y-0.5">
//                 <span className="text-[10px] text-[#bdc1c6] block font-medium">{day}</span>
//                 <span className="text-[10px] text-gray-400 block tracking-tight">{time}</span>
//               </div>
//             ) : (
//               <div className="space-y-1">
//                 <div className="flex items-center justify-center gap-1.5 font-mono text-xs font-bold bg-[#303134]/40 px-2 py-0.5 rounded border border-[#303134]">
//                   <span className={match.status === "FINISHED" && match.homeScore! > match.awayScore! ? "text-white" : "text-gray-400"}>{match.homeScore ?? 0}</span>
//                   <span className="text-gray-600">:</span>
//                   <span className={match.status === "FINISHED" && match.awayScore! > match.homeScore! ? "text-white" : "text-gray-400"}>{match.awayScore ?? 0}</span>
//                 </div>
//                 <div className={`text-[8px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
//                   match.status === "LIVE" ? "bg-rose-950/40 text-rose-400 border border-rose-500/30 animate-pulse" : "bg-[#202124] text-gray-500"
//                 }`}>
//                   {match.status === "LIVE" ? "LIVE" : "FINISHED"}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </motion.div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-[#202124] text-[#e8eaed] font-sans pb-20 lg:pb-8 selection:bg-amber-500/30 selection:text-white">
      
//       {/* 🔝 মেইন হেডার বার */}
//       <div className="bg-[#171717] border-b border-[#303134] sticky top-0 z-40 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <h1 className="text-xl md:text-2xl font-normal text-white tracking-tight">২০২৬ ফিফা ওয়ার্ল্ড কাপ</h1>
//             <span className="text-gray-600 hidden sm:inline text-xl">|</span>
//           </div>
//           {/* ডেস্কটপ বাটন টু সুইচ টু রোডম্যাপ ভিউ */}
//           <div className="hidden md:flex bg-[#1f2023] p-1 rounded-full border border-[#303134]">
//             <button 
//               onClick={() => setMobileTab("matches")} 
//               className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${mobileTab === "matches" ? "bg-amber-500 text-black shadow" : "text-gray-400 hover:text-white"}`}
//             >
//               ম্যাচসমূহ
//             </button>
//             <button 
//               onClick={() => setMobileTab("bracket")} 
//               className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${mobileTab === "bracket" ? "bg-amber-500 text-black shadow" : "text-gray-400 hover:text-white"}`}
//             >
//               নকআউট রোডম্যাপ
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* 🏟️ কন্টেন্ট লেআউট */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {loading ? (
//           <div className="h-40 bg-[#303134]/50 rounded-xl animate-pulse"></div>
//         ) : (
//           <AnimatePresence mode="wait">
//             {/* 🗺️ রোডম্যাপ ব্র্যাকেট ভিউ (যদি রোডম্যাপ সিলেক্টেড থাকে) */}
//             {mobileTab === "bracket" ? (
//               <motion.div 
//                 key="bracket-view"
//                 initial={{ opacity: 0, scale: 0.98 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.98 }}
//                 transition={{ duration: 0.3 }}
//                 className="space-y-6"
//               >
//                 <div className="text-lg font-normal text-white pb-2 border-b border-[#303134] flex items-center gap-2">
//                   <GitCommit className="w-5 h-5 text-amber-500" />
//                   <span>নকআউট রোডম্যাপ ব্র্যাকেট</span>
//                 </div>
                
//                 {/* হরাইজন্টাল স্ক্রোল কন্টেইনার (মোবাইলের জন্য দারুণ, ডেস্কটপেও রোডম্যাপ লুক দেবে) */}
//                 <div className="w-full overflow-x-auto pb-6 pt-4 flex gap-8 items-start scrollbar-thin scrollbar-thumb-[#303134] overflow-y-visible">
//                   {getBracketData().map((stage, stageIdx) => (
//                     <div key={stage.stageKey} className="flex flex-col gap-6 items-center relative min-w-[260px] md:min-w-[290px]">
//                       {/* রাউন্ড হেডার */}
//                       <div className="bg-[#171717] px-4 py-1.5 rounded-full border border-amber-500/30 text-xs text-amber-400 font-medium tracking-wide shadow-sm">
//                         {stage.stageName}
//                       </div>

//                       {/* রাউন্ডের ম্যাচ কালেকশন */}
//                       <div className="flex flex-col gap-8 justify-around h-full py-2 z-10">
//                         {stage.matches.length === 0 ? (
//                           <div className="text-center py-6 text-gray-500 text-xs w-64">
//                             ম্যাচ নির্ধারিত হয়নি
//                           </div>
//                         ) : (
//                           stage.matches.map(match => renderMatchCard(match, true))
//                         )}
//                       </div>

//                       {/* রোডম্যাপ কানেক্টিং লাইন (পরের রাউন্ডের সাথে জোড়া লাগানোর জন্য) */}
//                       {stageIdx < bracketStagesOrder.length - 1 && (
//                         <div className="hidden md:block absolute top-1/2 -right-6 w-4 h-0.5 bg-[#303134] z-0" />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <p className="text-[11px] text-gray-500 italic text-center md:hidden">💡 সম্পূর্ণ রোডম্যাপ দেখতে ডানে-বামে (Left/Right) সোয়াইপ করুন।</p>
//               </motion.div>
//             ) : (
//               /* 🕒 ডিফল্ট ভিউ: ম্যাচ ও পয়েন্ট টেবিল */
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
//                 {/* বাম কলাম: ম্যাচ স্ক্রিন */}
//                 <div className={`lg:col-span-2 space-y-6 ${mobileTab === "matches" ? "block" : "hidden lg:block"}`}>
//                   <div className="text-lg font-normal text-white pb-2 border-b border-[#303134]">
//                     <span>আজ ও আগামীকালের ম্যাচ</span>
//                   </div>

//                   {currentMatches.length === 0 ? (
//                     <div className="text-center py-12 bg-[#171717] rounded-xl border border-[#303134] text-gray-500 text-sm px-4">
//                       আজ বা আগামীকাল কোনো ম্যাচ সিডিউল নেই। নিচের বাটনে ক্লিক করে সব ম্যাচ দেখুন।
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                       {currentMatches.map(match => renderMatchCard(match))}
//                     </div>
//                   )}

//                   <div className="pt-2">
//                     <button 
//                       onClick={() => setIsAllMatchesOpen(true)}
//                       className="w-full py-3 bg-[#171717] hover:bg-[#303134]/50 border border-[#303134] rounded-full text-sm font-medium text-gray-300 transition flex items-center justify-center gap-2"
//                     >
//                       সব ম্যাচ একসাথে দেখুন <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* ডান কলাম: অবস্থান টেবিল */}
//                 <div className={`space-y-6 ${mobileTab === "standings" ? "block" : "hidden lg:block"}`}>
//                   <div className="text-lg font-normal text-white pb-2 border-b border-[#303134]">
//                     <span>অবস্থান</span>
//                   </div>
//                   <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1 scrollbar-none">
//                     {Object.entries(groupStandings).map(([groupName, teams]) => (
//                       <div key={groupName} className="bg-[#171717] border border-[#303134] rounded-xl p-4">
//                         <div className="text-xs font-bold text-amber-500 mb-3 uppercase tracking-wider">গ্রুপ {groupName}</div>
                        
//                         <div className="w-full overflow-x-auto scrollbar-none">
//                           <table className="w-full text-left text-xs text-[#bdc1c6] min-w-[240px]">
//                             <thead>
//                               <tr className="border-b border-[#303134] text-[10px] text-gray-500 font-medium">
//                                 <th className="py-2 pr-2">টিম</th>
//                                 <th className="py-2 text-center w-8">MP</th>
//                                 <th className="py-2 text-center w-8 hidden sm:table-cell">W</th>
//                                 <th className="py-2 text-center w-8 hidden sm:table-cell">D</th>
//                                 <th className="py-2 text-center w-8 hidden sm:table-cell">L</th>
//                                 <th className="py-2 text-center w-10">PTS</th>
//                               </tr>
//                             </thead>
//                             <tbody className="divide-y divide-[#303134]/30">
//                               {teams.map((team, idx) => (
//                                 <tr key={team.name} className="hover:bg-[#202124]/50 transition">
//                                   <td className="py-2 pr-2 flex items-center gap-2 max-w-[110px] sm:max-w-none">
//                                     <span className="text-gray-600 text-[10px] shrink-0">{idx + 1}</span>
//                                     <span className="text-gray-200 font-medium truncate">{team.name}</span>
//                                   </td>
//                                   <td className="py-2 text-center font-mono text-gray-400">{team.mp}</td>
//                                   <td className="py-2 text-center font-mono text-gray-400 hidden sm:table-cell">{team.w}</td>
//                                   <td className="py-2 text-center font-mono text-gray-400 hidden sm:table-cell">{team.d}</td>
//                                   <td className="py-2 text-center font-mono text-gray-400 hidden sm:table-cell">{team.l}</td>
//                                   <td className="py-2 text-center font-mono font-bold text-white">{team.pts}</td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//               </div>
//             )}
//           </AnimatePresence>
//         )}
//       </div>

//       {/* 🗺️ সমস্ত ম্যাচের ওভারলে মডাল */}
//       {isAllMatchesOpen && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-end md:items-center p-0 md:p-4">
//           <div className="bg-[#202124] w-full max-w-4xl h-[90vh] md:h-[85vh] rounded-t-2xl md:rounded-2xl border border-[#303134] flex flex-col overflow-hidden shadow-2xl">
//             <div className="bg-[#171717] px-6 py-4 border-b border-[#303134] flex items-center justify-between shrink-0">
//               <h2 className="text-sm md:text-md font-normal text-white truncate pr-4">২০২৬ ফিফা ওয়ার্ল্ড কাপ (সমস্ত সময়সূচী)</h2>
//               <button onClick={() => setIsAllMatchesOpen(false)} className="p-1 rounded-full hover:bg-[#303134] text-gray-400 hover:text-white transition"><X className="w-5 h-5" /></button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-[#1f2023] scrollbar-thin scrollbar-thumb-[#303134]">
//               {getGroupedFixtures(fixtures).map(({ groupName, isCurrentGroup, matches }, idx) => (
//                 <div key={idx} className="space-y-3">
//                   <div className={`text-xs font-medium px-4 py-2 rounded-lg border ${isCurrentGroup ? "bg-amber-950/20 text-amber-400 border-amber-500/30" : "bg-[#282a2d] text-gray-300 border-[#303134]/60"}`}>
//                     {groupName} {isCurrentGroup && "• (চলমান)"}
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {matches.map(match => renderMatchCard(match))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 📱 রেসপনসিভ মোবাইল বটম নেভিগেশন বার (৩টি ট্যাব করা হয়েছে) */}
//       <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#171717] border-t border-[#303134] h-14 z-40 flex items-center justify-around px-2">
//         <button onClick={() => setMobileTab("matches")} className={`flex flex-col items-center justify-center w-20 h-full ${mobileTab === "matches" ? "text-amber-500 font-bold" : "text-gray-500"}`}>
//           <List className="w-5 h-5 mb-0.5" /><span className="text-[10px]">খেলা</span>
//         </button>
//         <button onClick={() => setMobileTab("bracket")} className={`flex flex-col items-center justify-center w-24 h-full ${mobileTab === "bracket" ? "text-amber-500 font-bold" : "text-gray-500"}`}>
//           <GitCommit className="w-5 h-5 mb-0.5" /><span className="text-[10px]">রোডম্যাপ</span>
//         </button>
//         <button onClick={() => setMobileTab("standings")} className={`flex flex-col items-center justify-center w-20 h-full ${mobileTab === "standings" ? "text-amber-500 font-bold" : "text-gray-500"}`}>
//           <BarChart3 className="w-5 h-5 mb-0.5" /><span className="text-[10px]">অবস্থান</span>
//         </button>
//       </div>

//     </div>
//   );
// }

"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Fixture {
  id: string;
  season: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string | null;
  awayTeamLogo: string | null;
  matchDate: string;
  round: string | null;
  groupName: string | null;
  stage?: string;
  venue: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status: "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" | "CANCELLED";
}

const stageNames: Record<string, string> = {
  GROUP_STAGE: "গ্রুপ পর্ব",
  ROUND_OF_32: "রাউন্ড অফ ৩২",
  ROUND_OF_16: "রাউন্ড অফ ১৬",
  QUARTER_FINALS: "কোয়ার্টার-ফাইনালস",
  SEMI_FINALS: "সেমি-ফাইনালস",
  FINAL: "ফাইনাল",
};

const bracketStagesOrder = [
  "ROUND_OF_32",
  "ROUND_OF_16",
  "QUARTER_FINALS",
  "SEMI_FINALS",
  "FINAL"
];

type StandingTeam = {
  name: string;
  logo: string | null;
  mp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  pts: number;
};

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  
  // পেজের নিজস্ব ইন্টারনাল সাব-ট্যাব (খেলা, ব্র্যাকেট, অবস্থান)
  const [fixtureTab, setFixtureTab] = useState<"matches" | "bracket" | "standings">("bracket");
  const [activeBracketStage, setActiveBracketStage] = useState("ROUND_OF_32"); 
  const [isAllMatchesOpen, setIsAllMatchesOpen] = useState(false);
  
  const stageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/fixtures?competitionCode=WC&season=2026");
        if (!res.ok) throw new Error(`API error! Status: ${res.status}`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
          setFixtures(sorted);
        }
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ব্র্যাকেট স্ক্রোল ট্র্যাকিং (যা ডিসপ্লেতে থাকবে সেটাই একটিভ দেখাবে)
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const containerLeft = scrollContainerRef.current.getBoundingClientRect().left;
    
    let currentActive = activeBracketStage;
    let minDistance = Infinity;

    bracketStagesOrder.forEach((stageKey) => {
      const el = stageRefs.current[stageKey];
      if (el) {
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.left - containerLeft);
        if (distance < minDistance) {
          minDistance = distance;
          currentActive = stageKey;
        }
      }
    });

    if (currentActive !== activeBracketStage) {
      setActiveBracketStage(currentActive);
    }
  };

  const scrollToStage = (stageKey: string) => {
    setActiveBracketStage(stageKey);
    const element = stageRefs.current[stageKey];
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start"
      });
    }
  };

  const formatMatchTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

    if (date.toDateString() === today.toDateString()) {
      return { day: "আজ", time: timeStr, isCurrent: true };
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return { day: "আগামীকাল", time: timeStr, isCurrent: true };
    } else {
      const formattedDay = date.toLocaleDateString("bn-BD", { weekday: "long", month: "short", day: "numeric" });
      return { day: formattedDay, time: timeStr, isCurrent: false };
    }
  };

  const currentMatches = fixtures.filter((match) => {
    if (match.status === "LIVE") return true;
    const { isCurrent } = formatMatchTime(match.matchDate);
    return isCurrent;
  });

  const getGroupedFixtures = (matchList: Fixture[]) => {
    const groupsMap: Record<string, { stageKey: string; groupName: string; isCurrentGroup: boolean; matches: Fixture[] }> = {};
    const groupOrder: string[] = [];

    matchList.forEach((match) => {
      const currentRound = match.round || match.stage || "GROUP_STAGE";
      let stageKey = currentRound.toUpperCase().replace(/\s+/g, "_");
      
      if (stageKey === "LAST_32") stageKey = "ROUND_OF_32";
      if (stageKey === "LAST_16") stageKey = "ROUND_OF_16";

      const { day, isCurrent } = formatMatchTime(match.matchDate);
      
      let displayStageOrGroup = stageNames[stageKey] || stageKey;
      if (stageKey === "GROUP_STAGE" && match.groupName) {
        const cleanGroupName = match.groupName.replace("GROUP_", "").replace("Group_", "").toUpperCase();
        displayStageOrGroup = `গ্রুপ ${cleanGroupName}`;
      }

      const groupName = `${displayStageOrGroup} · ${day}`;
      const uniqueKey = `${stageKey}_${groupName}`;

      if (!groupsMap[uniqueKey]) {
        groupsMap[uniqueKey] = { stageKey, groupName, isCurrentGroup: isCurrent || match.status === "LIVE", matches: [] };
        groupOrder.push(uniqueKey);
      }
      groupsMap[uniqueKey].matches.push(match);
    });

    return groupOrder.map((key) => groupsMap[key]);
  };

  const generateGroupStandings = (matches: Fixture[]) => {
    const standingsMap: Record<string, Record<string, StandingTeam>> = {};
    matches.forEach(match => {
      const currentRound = match.round || match.stage || "";
      if (currentRound.toUpperCase() !== "GROUP_STAGE" && !match.groupName) return;
      
      const group = (match.groupName || "A").replace("GROUP_", "").replace("Group_", "").toUpperCase();
      if (!standingsMap[group]) standingsMap[group] = {};
      
      [{ name: match.homeTeam, logo: match.homeTeamLogo }, { name: match.awayTeam, logo: match.awayTeamLogo }].forEach(team => {
        if (!standingsMap[group][team.name]) {
          standingsMap[group][team.name] = { name: team.name, logo: team.logo, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
        }
      });

      if (match.status === "FINISHED") {
        const home = standingsMap[group][match.homeTeam];
        const away = standingsMap[group][match.awayTeam];
        const hScore = match.homeScore ?? 0;
        const aScore = match.awayScore ?? 0;

        home.mp += 1; away.mp += 1;
        home.gf += hScore; home.ga += aScore;
        away.gf += aScore; away.ga += hScore;

        if (hScore > aScore) { home.w += 1; home.pts += 3; away.l += 1; }
        else if (hScore < aScore) { away.w += 1; away.pts += 3; home.l += 1; }
        else { home.d += 1; away.d += 1; home.pts += 1; away.pts += 1; }
      }
    });

    const sortedGroups: Record<string, StandingTeam[]> = {};
    Object.keys(standingsMap).sort().forEach(group => {
      sortedGroups[group] = Object.values(standingsMap[group]).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
    });
    return sortedGroups;
  };

  const groupStandings = generateGroupStandings(fixtures);

  const getBracketData = () => {
    return bracketStagesOrder.map(stage => {
      const filteredMatches = fixtures.filter(f => {
        const matchRound = f.round || f.stage;
        if (!matchRound) return false;
        const formattedAPIStage = matchRound.toUpperCase().replace(/\s+/g, "_");
        return (
          formattedAPIStage === stage || 
          (stage === "ROUND_OF_32" && formattedAPIStage === "LAST_32") ||
          (stage === "ROUND_OF_16" && formattedAPIStage === "LAST_16")
        );
      });
      
      return {
        stageKey: stage,
        stageName: stageNames[stage] || stage,
        matches: filteredMatches
      };
    });
  };

  const renderMatchCard = (match: Fixture, compact = false) => {
    const { day, time } = formatMatchTime(match.matchDate);
    return (
      <div 
        key={match.id} 
        className={`bg-[#161617] border rounded-2xl flex flex-col justify-between p-4 transition-all duration-200 ${
          compact ? "text-xs w-[290px] md:w-[330px] shrink-0 border-[#28282a]" : "border-[#28282a]"
        } hover:bg-[#222224]`}
      >
        <div className="text-[11px] text-gray-400 mb-2.5 font-medium tracking-wide">{day} · {time}</div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 truncate">
              {match.homeTeamLogo ? (
                <img src={match.homeTeamLogo} alt="" className="w-4 h-4 object-contain" />
              ) : (
                <div className="w-4 h-4 bg-gray-700 rounded-full" />
              )}
              <span className="text-[#e8eaed] font-medium truncate">{match.homeTeam}</span>
            </div>
            <span className="font-mono font-bold text-gray-200 text-sm">{match.homeScore !== null ? match.homeScore : "-"}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 truncate">
              {match.awayTeamLogo ? (
                <img src={match.awayTeamLogo} alt="" className="w-4 h-4 object-contain" />
              ) : (
                <div className="w-4 h-4 bg-gray-700 rounded-full" />
              )}
              <span className="text-[#e8eaed] font-medium truncate">{match.awayTeam}</span>
            </div>
            <span className="font-mono font-bold text-gray-200 text-sm">{match.awayScore !== null ? match.awayScore : "-"}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#0a0a0b] text-[#e8eaed] py-20  font-sans antialiased">
      
      {/* 📌 স্টিকি কন্টেইনার: সাব-মেনুবার এবং রাউন্ড সিলেকশন একসাথে লক থাকবে */}
      <div className="bg-[#0a0a0b] sticky top-0 z-40 shadow-md">
        
        {/* সাব-ট্যাব মেনু (খেলা, ব্র্যাকেট, অবস্থান) */}
        <div className="px-4 flex gap-5 text-xs font-medium border-b border-[#1e1e20] bg-[#111112]">
          <button onClick={() => setFixtureTab("matches")} className={`pb-3 pt-3 border-b-2 transition-all ${fixtureTab === "matches" ? "border-[#00e676] text-[#00e676]" : "border-transparent text-gray-400 hover:text-white"}`}>খেলা</button>
          <button onClick={() => setFixtureTab("bracket")} className={`pb-3 pt-3 border-b-2 transition-all ${fixtureTab === "bracket" ? "border-[#00e676] text-[#00e676]" : "border-transparent text-gray-400 hover:text-white"}`}>ব্র্যাকেট</button>
          <button onClick={() => setFixtureTab("standings")} className={`pb-3 pt-3 border-b-2 transition-all ${fixtureTab === "standings" ? "border-[#00e676] text-[#00e676]" : "border-transparent text-gray-400 hover:text-white"}`}>অবস্থান</button>
        </div>

        {/* রাউন্ড মেনু (শুধুমাত্র ব্র্যাকেট মোডে টপ সাব-মেনুর নিচে স্টিকি থাকবে) */}
        {fixtureTab === "bracket" && !loading && (
          <div className="bg-[#141416] border-b border-[#222224] px-4 py-2.5 flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
            {bracketStagesOrder.map((stageKey) => (
              <button
                key={stageKey}
                onClick={() => scrollToStage(stageKey)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeBracketStage === stageKey 
                    ? "bg-[#24342d] text-[#00e676] border border-[#00e676]/30" 
                    : "bg-[#1c1c1e] text-gray-400 border border-transparent hover:bg-[#26262a]"
                }`}
              >
                {stageNames[stageKey] || stageKey}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 📌 মূল বডি কন্টেন্ট */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        {loading ? (
          <div className="h-44 bg-[#111112] border border-[#222224] rounded-2xl animate-pulse" />
        ) : (
          <AnimatePresence mode="wait">
            
            {/* 🗺️ ব্র্যাকেট ভিউ */}
            {fixtureTab === "bracket" && (
              <motion.div key="bracket" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div 
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="w-full overflow-x-auto pb-6 flex gap-6 items-start scroll-smooth scrollbar-thin scrollbar-thumb-[#222224] snap-x snap-mandatory"
                >
                  {getBracketData().map((stage) => (
                    <div 
                      key={stage.stageKey} 
                      ref={(el) => { stageRefs.current[stage.stageKey] = el; }}
                      className="flex flex-col gap-4 min-w-[290px] md:min-w-[330px] snap-start"
                    >
                      <div className={`text-xs font-bold px-1 tracking-wider uppercase transition-colors ${
                        activeBracketStage === stage.stageKey ? "text-[#00e676]" : "text-gray-400"
                      }`}>
                        {stage.stageName}
                      </div>

                      <div className="flex flex-col gap-3.5 w-full">
                        {stage.matches.length === 0 ? (
                          <div className="text-left py-7 text-gray-500 text-xs bg-[#111112] border border-[#222224] rounded-2xl px-4">
                            পরে সিদ্ধান্ত নেওয়া হবে
                          </div>
                        ) : (
                          stage.matches.map(match => renderMatchCard(match, true))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 📊 অবস্থান ভিউ */}
            {fixtureTab === "standings" && (
              <motion.div key="standings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {Object.keys(groupStandings).length === 0 ? (
                  <div className="text-center py-12 bg-[#111112] rounded-2xl border border-[#222224] text-gray-500 text-xs">
                    কোনো গ্রুপ ডাটা পাওয়া যায়নি।
                  </div>
                ) : (
                  Object.entries(groupStandings).map(([groupName, teams]) => (
                    <div key={groupName} className="bg-[#111112] border border-[#222224] rounded-2xl p-4">
                      <div className="text-xs font-bold text-[#00e676] mb-3">গ্রুপ {groupName}</div>
                      
                      <div className="w-full overflow-x-auto scrollbar-none">
                        <table className="w-full text-left text-xs text-[#bdc1c6] min-w-[280px]">
                          <thead>
                            <tr className="border-b border-[#222224] text-gray-500 font-medium">
                              <th className="py-2 text-left">টিম</th>
                              <th className="py-2 text-center w-7">MP</th>
                              <th className="py-2 text-center w-7">W</th>
                              <th className="py-2 text-center w-7">D</th>
                              <th className="py-2 text-center w-7">L</th>
                              <th className="py-2 text-center w-9 text-white font-bold">PTS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {teams.map((team, idx) => (
                              <tr key={team.name} className="border-b border-[#222224]/30 last:border-0">
                                <td className="py-3 flex items-center gap-2">
                                  <span className="text-gray-500 text-[11px]">{idx + 1}</span>
                                  {team.logo && <img src={team.logo} alt="" className="w-3.5 h-3.5 object-contain" />}
                                  <span className="text-gray-200 font-medium truncate max-w-[130px]">{team.name}</span>
                                </td>
                                <td className="py-3 text-center font-mono text-gray-400">{team.mp}</td>
                                <td className="py-3 text-center font-mono text-gray-400">{team.w}</td>
                                <td className="py-3 text-center font-mono text-gray-400">{team.d}</td>
                                <td className="py-3 text-center font-mono text-gray-400">{team.l}</td>
                                <td className="py-3 text-center font-mono font-bold text-[#00e676]">{team.pts}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* 🕒 খেলা ভিউ */}
            {fixtureTab === "matches" && (
              <motion.div key="matches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="text-xs font-medium text-white pb-2 border-b border-[#222224]">
                  আজ ও আগামীকালের ম্যাচ
                </div>
                {currentMatches.length === 0 ? (
                  <div className="text-center py-12 bg-[#111112] rounded-2xl border border-[#222224] text-gray-500 text-xs">
                    আজ বা আগামীকাল কোনো ম্যাচ শিডিউল নেই।
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {currentMatches.map(match => renderMatchCard(match))}
                  </div>
                )}
                <button 
                  onClick={() => setIsAllMatchesOpen(true)}
                  className="w-full py-3 bg-[#111112] border border-[#222224] rounded-full text-xs text-gray-300 flex items-center justify-center gap-1.5 hover:bg-[#1c1c1e] transition-all"
                >
                  সব ম্যাচ একসাথে দেখুন <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>

      {/* সমস্ত ম্যাচের মডাল */}
      {isAllMatchesOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex justify-center items-end md:items-center">
          <div className="bg-[#0a0a0b] w-full max-w-2xl h-[82vh] rounded-t-2xl md:rounded-2xl border border-[#222224] flex flex-col overflow-hidden">
            <div className="bg-[#111112] px-4 py-3.5 border-b border-[#222224] flex items-center justify-between">
              <span className="text-xs text-white font-medium">সমস্ত ম্যাচের সময়সূচী</span>
              <button onClick={() => setIsAllMatchesOpen(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0b]">
              {getGroupedFixtures(fixtures).map(({ groupName, matches }, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-[10px] font-semibold bg-[#111112] px-3 py-1 rounded-md text-gray-400 border border-[#222224] w-fit">
                    {groupName}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {matches.map(match => renderMatchCard(match))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}