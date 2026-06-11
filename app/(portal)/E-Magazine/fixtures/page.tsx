// "use client";

// import React, { useState, useEffect } from "react";
// import { MapPin, Trophy, Calendar, Clock } from "lucide-react";

// interface Fixture {
//   id: string;
//   season: string;
//   homeTeam: string;
//   awayTeam: string;
//   homeTeamLogo: string | null;
//   awayTeamLogo: string | null;
//   matchDate: string;
//   round: string | null;
//   venue: string | null;
//   homeScore: number | null;
//   awayScore: number | null;
//   status: "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" | "CANCELLED";
// }

// export default function FixturesPage() {
//   const [fixtures, setFixtures] = useState<Fixture[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         // 💡 পরিবর্তন: এখন ডাটা সরাসরি আমাদের লোকাল ডাটাবেজ কুয়েরি API থেকে আসবে
//         const res = await fetch("/api/fixtures?competitionCode=WC&season=2026");
//         const data = await res.json();
        
//         if (Array.isArray(data)) {
//           setFixtures(data);
//         }
//       } catch (error) {
//         console.error("Error fetching fixtures:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   // স্ট্যাটাস অনুযায়ী ব্যাজের স্টাইল নির্ধারণ
//   const getStatusStyles = (status: Fixture["status"]) => {
//     switch (status) {
//       case "LIVE":
//         return "bg-rose-50 text-rose-600 border border-rose-200 animate-pulse";
//       case "FINISHED":
//         return "bg-emerald-50 text-emerald-600 border border-emerald-200";
//       case "SCHEDULED":
//         return "bg-blue-50 text-blue-600 border border-blue-100";
//       default:
//         return "bg-slate-50 text-slate-500 border border-slate-200";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
        
//         {/* হেডার সেকশন */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 shadow-sm">
//               <Trophy className="w-6 h-6 text-amber-500" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-black text-slate-950 tracking-tight">FIFA World Cup 2026</h1>
//               <p className="text-xs text-slate-500 font-medium mt-0.5">Match Fixtures & Results</p>
//             </div>
//           </div>
//         </div>

//         {/* লোডিং স্টেট (Skeleton Loader) */}
//         {loading ? (
//           <div className="space-y-4">
//             {[1, 2, 3].map((n) => (
//               <div key={n} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 animate-pulse">
//                 <div className="flex justify-between">
//                   <div className="h-4 w-24 bg-slate-200 rounded"></div>
//                   <div className="h-4 w-20 bg-slate-200 rounded"></div>
//                 </div>
//                 <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
//               </div>
//             ))}
//           </div>
//         ) : fixtures.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400 font-medium">
//             No fixtures found at the moment.
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {fixtures.map((match) => {
//               const dateObj = new Date(match.matchDate);
//               const formattedDate = dateObj.toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' });
//               const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//               return (
//                 <div 
//                   key={match.id} 
//                   className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-200 overflow-hidden"
//                 >
//                   {/* টপ মেটা বার */}
//                   <div className="bg-slate-50/70 px-6 py-2.5 border-b border-slate-100 flex justify-between items-center text-[11px] font-bold tracking-wider text-slate-500 uppercase">
//                     <span>{match.round?.replace("_", " ") || "MATCH"}</span>
//                     <span className="flex items-center gap-1">
//                       <Calendar className="w-3 h-3 text-slate-400" /> {formattedDate}
//                     </span>
//                   </div>

//                   {/* মেইন ম্যাচカード */}
//                   <div className="p-6">
//                     <div className="grid grid-cols-3 items-center gap-2">
                      
//                       {/* হোম টিম */}
//                       <div className="flex flex-col items-center text-center gap-2.5">
//                         <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center p-2 border border-slate-100/80 shadow-inner">
//                           {match.homeTeamLogo ? (
//                             <img 
//                               src={match.homeTeamLogo} 
//                               alt={match.homeTeam} 
//                               className="w-full h-full object-contain" 
//                               loading="lazy"
//                             />
//                           ) : (
//                             <div className="w-full h-full bg-slate-200 rounded flex items-center justify-center font-bold text-slate-400 text-xs">
//                               {match.homeTeam.substring(0, 3).toUpperCase()}
//                             </div>
//                           )}
//                         </div>
//                         <span className="font-bold text-slate-800 text-xs sm:text-sm max-w-[120px] line-clamp-2 leading-tight">
//                           {match.homeTeam}
//                         </span>
//                       </div>

//                       {/* মিডল সেকশন (স্কোর / সময়) */}
//                       <div className="flex flex-col items-center justify-center gap-2">
//                         {match.status === "SCHEDULED" ? (
//                           <div className="flex items-center gap-1 text-slate-700 font-mono font-bold text-xs sm:text-sm bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/40">
//                             <Clock className="w-3.5 h-3.5 text-slate-400" />
//                             {formattedTime}
//                           </div>
//                         ) : (
//                           <div className="flex items-center gap-3 font-mono text-2xl sm:text-3xl font-black text-slate-900 bg-slate-50 px-4 py-1.5 rounded-2xl border border-slate-100">
//                             <span>{match.homeScore ?? 0}</span>
//                             <span className="text-slate-300 text-xl font-normal">:</span>
//                             <span>{match.awayScore ?? 0}</span>
//                           </div>
//                         )}
                        
//                         <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold tracking-wide uppercase ${getStatusStyles(match.status)}`}>
//                           {match.status}
//                         </span>
//                       </div>

//                       {/* অ্যাওয়ে টিম */}
//                       <div className="flex flex-col items-center text-center gap-2.5">
//                         <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center p-2 border border-slate-100/80 shadow-inner">
//                           {match.awayTeamLogo ? (
//                             <img 
//                               src={match.awayTeamLogo} 
//                               alt={match.awayTeam} 
//                               className="w-full h-full object-contain" 
//                               loading="lazy"
//                             />
//                           ) : (
//                             <div className="w-full h-full bg-slate-200 rounded flex items-center justify-center font-bold text-slate-400 text-xs">
//                               {match.awayTeam.substring(0, 3).toUpperCase()}
//                             </div>
//                           )}
//                         </div>
//                         <span className="font-bold text-slate-800 text-xs sm:text-sm max-w-[120px] line-clamp-2 leading-tight">
//                           {match.awayTeam}
//                         </span>
//                       </div>

//                     </div>

//                     {/* ভেন্যু ফুটনোট */}
//                     {match.venue && (
//                       <div className="mt-5 pt-3.5 border-t border-dashed border-slate-100 flex items-center justify-center gap-1.5 text-slate-400 text-[11px] font-medium">
//                         <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" /> 
//                         <span className="truncate">{match.venue}</span>
//                       </div>
//                     )}
//                   </div>

//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Trophy, Calendar, Clock, Layers } from "lucide-react";

interface Fixture {
  id: string;
  season: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string | null;
  awayTeamLogo: string | null;
  matchDate: string;
  round: string | null;
  groupName: string | null; // 💡 নতুন স্কিমা ফিল্ড যুক্ত করা হলো
  venue: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status: "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" | "CANCELLED";
}

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/fixtures?competitionCode=WC&season=2026");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setFixtures(data);
        }
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 💡 ম্যাচগুলোকে গ্রুপ অনুযায়ী ভাগ (Group) করার লজিক
  const groupedFixtures = fixtures.reduce((acc: Record<string, Fixture[]>, match) => {
    // যদি গ্রুপনেম থাকে (যেমন: "GROUP A"), না থাকলে সেটাকে "Knockout Stage" বা "Other Matches" হিসেবে ধরবে
    const groupKey = match.groupName ? match.groupName.toUpperCase() : "KNOCKOUT STAGE";
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(match);
    return acc;
  }, {});

  // স্ট্যাটাস অনুযায়ী ব্যাজের স্টাইল নির্ধারণ
  const getStatusStyles = (status: Fixture["status"]) => {
    switch (status) {
      case "LIVE":
        return "bg-rose-50 text-rose-600 border border-rose-200 animate-pulse";
      case "FINISHED":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      case "SCHEDULED":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      default:
        return "bg-slate-50 text-slate-500 border border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* হেডার সেকশন */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 shadow-sm">
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight">FIFA World Cup 2026</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Match Fixtures & Results</p>
            </div>
          </div>
        </div>

        {/* লোডিং স্টেট (Skeleton Loader) */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-slate-200 rounded"></div>
                  <div className="h-4 w-20 bg-slate-200 rounded"></div>
                </div>
                <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : fixtures.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400 font-medium">
            No fixtures found at the moment.
          </div>
        ) : (
          // 💡 গ্রুপ লুপ চালানো (Object.entries দিয়ে প্রতিটি গ্রুপ আলাদা করা হচ্ছে)
          <div className="space-y-10">
            {Object.entries(groupedFixtures).map(([groupName, groupMatches]) => (
              <div key={groupName} className="space-y-4">
                
                {/* 🏷️ গ্রুপের টাইটেল বার */}
                <div className="flex items-center gap-2 px-1">
                  <Layers className="w-4 h-4 text-slate-400" />
                  <h2 className="text-sm font-black text-slate-800 tracking-wider uppercase">
                    {groupName}
                  </h2>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {groupMatches.length} Matches
                  </span>
                </div>

                {/* গ্রুপের ভেতরের ম্যাচগুলোর লিস্ট */}
                <div className="space-y-4">
                  {groupMatches.map((match) => {
                    const dateObj = new Date(match.matchDate);
                    const formattedDate = dateObj.toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' });
                    const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div 
                        key={match.id} 
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-200 overflow-hidden"
                      >
                        {/* টপ মেটা বার */}
                        <div className="bg-slate-50/70 px-6 py-2.5 border-b border-slate-100 flex justify-between items-center text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                          <span>{match.round?.replace("_", " ") || "MATCH"}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" /> {formattedDate}
                          </span>
                        </div>

                        {/* মেইন ম্যাচ কার্ড */}
                        <div className="p-6">
                          <div className="grid grid-cols-3 items-center gap-2">
                            
                            {/* হোম টিম */}
                            <div className="flex flex-col items-center text-center gap-2.5">
                              <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center p-2 border border-slate-100/80 shadow-inner">
                                {match.homeTeamLogo ? (
                                  <img 
                                    src={match.homeTeamLogo} 
                                    alt={match.homeTeam} 
                                    className="w-full h-full object-contain" 
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-slate-200 rounded flex items-center justify-center font-bold text-slate-400 text-xs">
                                    {match.homeTeam.substring(0, 3).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <span className="font-bold text-slate-800 text-xs sm:text-sm max-w-[120px] line-clamp-2 leading-tight">
                                {match.homeTeam}
                              </span>
                            </div>

                            {/* মিডল সেকশন (স্কোর / সময়) */}
                            <div className="flex flex-col items-center justify-center gap-2">
                              {match.status === "SCHEDULED" ? (
                                <div className="flex items-center gap-1 text-slate-700 font-mono font-bold text-xs sm:text-sm bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/40">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  {formattedTime}
                                </div>
                              ) : (
                                <div className="flex items-center gap-3 font-mono text-2xl sm:text-3xl font-black text-slate-900 bg-slate-50 px-4 py-1.5 rounded-2xl border border-slate-100">
                                  <span>{match.homeScore ?? 0}</span>
                                  <span className="text-slate-300 text-xl font-normal">:</span>
                                  <span>{match.awayScore ?? 0}</span>
                                </div>
                              )}
                              
                              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold tracking-wide uppercase ${getStatusStyles(match.status)}`}>
                                {match.status}
                              </span>
                            </div>

                            {/* অ্যাওয়ে টিম */}
                            <div className="flex flex-col items-center text-center gap-2.5">
                              <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center p-2 border border-slate-100/80 shadow-inner">
                                {match.awayTeamLogo ? (
                                  <img 
                                    src={match.awayTeamLogo} 
                                    alt={match.awayTeam} 
                                    className="w-full h-full object-contain" 
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-slate-200 rounded flex items-center justify-center font-bold text-slate-400 text-xs">
                                    {match.awayTeam.substring(0, 3).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <span className="font-bold text-slate-800 text-xs sm:text-sm max-w-[120px] line-clamp-2 leading-tight">
                                {match.awayTeam}
                              </span>
                            </div>

                          </div>

                          {/* ভেন্যু ফুটনোট */}
                          {match.venue && (
                            <div className="mt-5 pt-3.5 border-t border-dashed border-slate-100 flex items-center justify-center gap-1.5 text-slate-400 text-[11px] font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" /> 
                              <span className="truncate">{match.venue}</span>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}