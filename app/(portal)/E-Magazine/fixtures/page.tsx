// // // // ফিক্সচার পেজ

"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, List, BarChart3, X } from "lucide-react";

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
  GROUP_STAGE: "গ্রুপ স্টেজ",
  LAST_32: "রাউন্ড অব ৩২",
  ROUND_OF_32: "রাউন্ড অব ৩২",
  LAST_16: "রাউন্ড অব ১৬",
  ROUND_OF_16: "রাউন্ড অব ১৬",
  QUARTER_FINALS: "কোয়ার্টার ফাইনাল",
  SEMI_FINALS: "সেমি ফাইনাল",
  THIRD_PLACE: "তৃতীয় স্থান নির্ধারণী",
  FINAL: "ফাইনাল",
  KNOCKOUT_STAGE: "নকআউট স্টেজ"
};

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
  const [mobileTab, setMobileTab] = useState<"matches" | "standings">("matches");
  const [isAllMatchesOpen, setIsAllMatchesOpen] = useState(false);
  const currentMatchRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (isAllMatchesOpen && currentMatchRef.current) {
      setTimeout(() => {
        currentMatchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [isAllMatchesOpen]);

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

  console.log("Current Matches:", currentMatches);

  // গ্রুপ বা স্টেজের নাম ফরম্যাট করার হেল্পার ফাংশন
  const formatGroupName = (match: Fixture) => {
    if (match.stage && match.stage !== "GROUP_STAGE") {
      return stageNames[match.stage] || match.stage;
    }
    if (match.groupName) {
      const cleanGroup = match.groupName.replace("GROUP_", "").replace("Group_", "").toUpperCase();
      return `গ্রুপ ${cleanGroup}`;
    }
    return "";
  };

  const getGroupedFixtures = (matchList: Fixture[]) => {
    const groupsMap: Record<string, { stageKey: string; groupName: string; isCurrentGroup: boolean; matches: Fixture[] }> = {};
    const groupOrder: string[] = [];

    matchList.forEach((match) => {
      const stageKey = match.stage || (match.groupName ? "GROUP_STAGE" : "KNOCKOUT_STAGE");
      const { day, isCurrent } = formatMatchTime(match.matchDate);
      
      const displayStageOrGroup = (stageKey === "GROUP_STAGE" && match.groupName)
        ? `গ্রুপ ${match.groupName.replace("GROUP_", "").replace("Group_", "").toUpperCase()}` 
        : (stageNames[stageKey] || stageKey);

      const groupName = `${displayStageOrGroup} · ${day}`;
      const uniqueKey = `${stageKey}_${groupName}`;

      if (!groupsMap[uniqueKey]) {
        groupsMap[uniqueKey] = { 
          stageKey, 
          groupName, 
          isCurrentGroup: isCurrent || match.status === "LIVE", 
          matches: [] 
        };
        groupOrder.push(uniqueKey);
      }
      groupsMap[uniqueKey].matches.push(match);
    });

    return groupOrder.map((key) => groupsMap[key]);
  };

  const generateGroupStandings = (matches: Fixture[]) => {
    const standingsMap: Record<string, Record<string, StandingTeam>> = {};
    matches.forEach(match => {
      if (match.status !== "FINISHED" || !match.groupName) return;
      const group = match.groupName.replace("GROUP_", "").replace("Group_", "").toUpperCase();
      if (!standingsMap[group]) standingsMap[group] = {};
      
      [match.homeTeam, match.awayTeam].forEach(team => {
        if (!standingsMap[group][team]) {
          standingsMap[group][team] = {
            name: team,
            logo: team === match.homeTeam ? match.homeTeamLogo : match.awayTeamLogo,
            mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0
          };
        }
      });

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
    });

    const sortedGroups: Record<string, StandingTeam[]> = {};
    Object.keys(standingsMap).sort().forEach(group => {
      sortedGroups[group] = Object.values(standingsMap[group]).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
    });
    return sortedGroups;
  };

  const groupStandings = generateGroupStandings(fixtures);

  const renderMatchCard = (match: Fixture) => {
    const { day, time } = formatMatchTime(match.matchDate);
    const displayGroupName = formatGroupName(match);

    return (
      <div 
        key={match.id} 
        className={`bg-[#171717] border rounded-xl p-4 flex flex-col justify-between hover:bg-[#202124] transition-all group ${
          match.status === "LIVE" ? "border-rose-500/50 ring-1 ring-rose-500/20" : "border-[#303134]"
        }`}
      >
        {/* 🏷️ কার্ডের একদম ওপরে গ্রুপের নাম (আপনার স্ক্রিনশট অনুযায়ী যোগ করা হলো) */}
        {displayGroupName && (
          <div className="text-[11px] font-medium text-gray-400 mb-2.5 pb-1 border-b border-[#303134]/30">
            {displayGroupName}
          </div>
        )}

        <div className="flex justify-between items-center w-full">
          <div className="space-y-3.5 flex-1 min-w-0 pr-2">
            {/* হোম টিম */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#303134]/50 rounded flex items-center justify-center overflow-hidden shrink-0">
                {match.homeTeamLogo ? <img src={match.homeTeamLogo} alt="" className="w-full h-full object-cover" /> : <span className="text-[9px] text-gray-400 font-bold">{match.homeTeam.substring(0, 2)}</span>}
              </div>
              <span className="text-sm font-normal text-[#e8eaed] truncate group-hover:text-white">{match.homeTeam}</span>
            </div>
            {/* অ্যাওয়ে টিম */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#303134]/50 rounded flex items-center justify-center overflow-hidden shrink-0">
                {match.awayTeamLogo ? <img src={match.awayTeamLogo} alt="" className="w-full h-full object-cover" /> : <span className="text-[9px] text-gray-400 font-bold">{match.awayTeam.substring(0, 2)}</span>}
              </div>
              <span className="text-sm font-normal text-[#e8eaed] truncate group-hover:text-white">{match.awayTeam}</span>
            </div>
          </div>

          {/* ডানপাশ: স্কোর/টাইম */}
          <div className="border-l border-[#303134] pl-4 flex flex-col items-center justify-center min-w-[100px] text-center">
            {match.status === "SCHEDULED" ? (
              <div className="space-y-0.5">
                <span className="text-xs text-[#bdc1c6] block font-medium">{day}</span>
                <span className="text-xs text-gray-400 block tracking-tight">{time}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 font-mono text-sm font-bold bg-[#303134]/40 px-2.5 py-1 rounded border border-[#303134]">
                  <span className={match.status === "FINISHED" && match.homeScore! > match.awayScore! ? "text-white" : "text-gray-400"}>{match.homeScore ?? 0}</span>
                  <span className="text-gray-600">:</span>
                  <span className={match.status === "FINISHED" && match.awayScore! > match.homeScore! ? "text-white" : "text-gray-400"}>{match.awayScore ?? 0}</span>
                </div>
                <div className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border shadow-sm ${
                  match.status === "LIVE" ? "bg-rose-950/40 text-rose-400 border-rose-500/30 animate-pulse" : "bg-[#202124] text-gray-400 border-[#303134]"
                }`}>
                  {match.status === "LIVE" ? "LIVE" : "MATCH STORY"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  let hasSetRef = false;
  const setScrollRef = (isCurrentGroup: boolean, element: HTMLDivElement | null) => {
    if (isCurrentGroup && !hasSetRef && element) {
      currentMatchRef.current = element;
      hasSetRef = true;
    }
  };

  return (
    <div className="min-h-screen bg-[#202124] text-[#e8eaed] font-sans pb-20 lg:pb-8">
      
      {/* 🔝 মেইন হেডার বার */}
      <div className="bg-[#171717] border-b border-[#303134] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-normal text-white tracking-tight">২০২৬ ফিফা ওয়ার্ল্ড কাপ</h1>
            <span className="text-gray-600 hidden sm:inline text-xl">|</span>
          </div>
        </div>
      </div>

      {/* 🏟️ কন্টেন্ট লেআউট */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="h-32 bg-[#303134]/50 rounded-xl animate-pulse"></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* 🕒 বাম কলাম: মেইন স্ক্রিন */}
            <div className={`lg:col-span-2 space-y-6 ${mobileTab === "matches" ? "block" : "hidden lg:block"}`}>
              <div className="text-lg font-normal text-white pb-2 border-b border-[#303134]">
                <span>আজ ও আগামীকালের ম্যাচ</span>
              </div>

              {currentMatches.length === 0 ? (
                <div className="text-center py-12 bg-[#171717] rounded-xl border border-[#303134] text-gray-500 text-sm px-4">
                  আজ বা আগামীকাল কোনো match সিডিউল নেই। নিচের বাটনে ক্লিক করে সব ম্যাচ দেখুন।
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentMatches.map(match => renderMatchCard(match))}
                </div>
              )}

              {/* 🔘 আরও ম্যাচ দেখার বাটন */}
              <div className="pt-2">
                <button 
                  onClick={() => {
                    hasSetRef = false;
                    setIsAllMatchesOpen(true);
                  }}
                  className="w-full py-3 bg-[#171717] hover:bg-[#303134]/50 border border-[#303134] rounded-full text-sm font-medium text-gray-300 transition flex items-center justify-center gap-2"
                >
                  আরও ম্যাচ <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 📊 ডান কলাম: পজিশন/অবстояние টেবিল */}
            <div className={`space-y-6 ${mobileTab === "standings" ? "block" : "hidden lg:block"}`}>
              <div className="text-lg font-normal text-white pb-2 border-b border-[#303134]">
                <span>অবস্থান</span>
              </div>
              <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
                {Object.entries(groupStandings).map(([groupName, teams]) => (
                  <div key={groupName} className="bg-[#171717] border border-[#303134] rounded-xl p-4">
                    <div className="text-xs font-bold text-amber-500 mb-3 uppercase tracking-wider">গ্রুপ {groupName}</div>
                    
                    <div className="w-full overflow-x-auto scrollbar-none">
                      <table className="w-full text-left text-xs text-[#bdc1c6] min-w-[240px]">
                        <thead>
                          <tr className="border-b border-[#303134] text-[10px] text-gray-500 font-medium">
                            <th className="py-2 pr-2">টিম</th>
                            <th className="py-2 text-center w-8">MP</th>
                            <th className="py-2 text-center w-8 hidden sm:table-cell">W</th>
                            <th className="py-2 text-center w-8 hidden sm:table-cell">D</th>
                            <th className="py-2 text-center w-8 hidden sm:table-cell">L</th>
                            <th className="py-2 text-center w-10 hidden sm:table-cell">GF</th>
                            <th className="py-2 text-center w-10 hidden sm:table-cell">GA</th>
                            <th className="py-2 text-center w-10">PTS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#303134]/30">
                          {teams.map((team, idx) => (
                            <tr key={team.name} className="hover:bg-[#202124]/50 transition">
                              <td className="py-2 pr-2 flex items-center gap-2 max-w-[110px] sm:max-w-none">
                                <span className="text-gray-600 text-[10px] shrink-0">{idx + 1}</span>
                                <span className="text-gray-200 font-medium truncate">{team.name}</span>
                              </td>
                              <td className="py-2 text-center font-mono text-gray-400">{team.mp}</td>
                              <td className="py-2 text-center font-mono text-gray-400 hidden sm:table-cell">{team.w}</td>
                              <td className="py-2 text-center font-mono text-gray-400 hidden sm:table-cell">{team.d}</td>
                              <td className="py-2 text-center font-mono text-gray-400 hidden sm:table-cell">{team.l}</td>
                              <td className="py-2 text-center font-mono text-gray-400 hidden sm:table-cell">{team.gf}</td>
                              <td className="py-2 text-center font-mono text-gray-400 hidden sm:table-cell">{team.ga}</td>
                              <td className="py-2 text-center font-mono font-bold text-white">{team.pts}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 🗺️ ফুল-স্ক্রিন ওভারলে মডাল */}
      {isAllMatchesOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-end md:items-center p-0 md:p-4 animate-fadeIn">
          <div className="bg-[#202124] w-full max-w-4xl h-[90vh] md:h-[85vh] rounded-t-2xl md:rounded-2xl border border-[#303134] flex flex-col overflow-hidden shadow-2xl">
            
            <div className="bg-[#171717] px-6 py-4 border-b border-[#303134] flex items-center justify-between shrink-0">
              <h2 className="text-md md:text-lg font-normal text-white truncate pr-4">২০২৬ ফিফা ওয়ার্ল্ড কাপ ম্যাচ (সমস্ত সময়সূচী)</h2>
              <button 
                onClick={() => setIsAllMatchesOpen(false)}
                className="p-1 rounded-full hover:bg-[#303134] text-gray-400 hover:text-white transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-[#1f2023] scrollbar-thin scrollbar-thumb-[#303134]">
              {getGroupedFixtures(fixtures).map(({ groupName, isCurrentGroup, matches }, idx) => (
                <div 
                  key={idx} 
                  className="space-y-3"
                  ref={(el) => setScrollRef(isCurrentGroup, el)}
                >
                  <div className={`text-xs font-medium px-4 py-2 rounded-lg border ${
                    isCurrentGroup 
                      ? "bg-amber-950/20 text-amber-400 border-amber-500/30" 
                      : "bg-[#282a2d] text-gray-300 border-[#303134]/60"
                  }`}>
                    {groupName} {isCurrentGroup && "• (চলমান)"}
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

      {/* 📱 রেসপনসিভ মোবাইল বটম বার */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#171717] border-t border-[#303134] h-14 z-40 flex items-center justify-around px-4">
        <button onClick={() => setMobileTab("matches")} className={`flex flex-col items-center justify-center w-20 h-full ${mobileTab === "matches" ? "text-amber-500 font-bold" : "text-gray-500"}`}>
          <List className="w-5 h-5 mb-0.5" /><span className="text-[10px]">খেলা</span>
        </button>
        <button onClick={() => setMobileTab("standings")} className={`flex flex-col items-center justify-center w-20 h-full ${mobileTab === "standings" ? "text-amber-500 font-bold" : "text-gray-500"}`}>
          <BarChart3 className="w-5 h-5 mb-0.5" /><span className="text-[10px]">অবস্থান</span>
        </button>
      </div>

    </div>
  );
}
