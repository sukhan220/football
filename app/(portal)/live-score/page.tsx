"use client";

import React, { useEffect, useState, useRef } from "react";
import { Timer, Trophy, ShieldAlert } from "lucide-react";

// 💡 ১. এপিআই রেসপন্স অনুযায়ী ইন্টারফেস টাইপ একদম নিখুঁত করা হলো
interface LiveMatchResponse {
  fixture: {
    id: number;
    status: {
      long: string;
      elapsed: number;
    };
  };
  teams: {
    home: { 
      id: number;
      name?: string; // এপিআই থেকে নাম না আসলে যেন অপশনাল থাকে
      logo?: string; 
      goals: number;  // 💡 গোলের ডাটা মূলত এখানেই আছে
    };
    away: { 
      id: number;
      name?: string; 
      logo?: string; 
      goals: number; 
    };
  };
}

export default function EMagazineRootPage() {
  const [liveMatch, setLiveMatch] = useState<LiveMatchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isMatchFinished =
    liveMatch?.fixture.status.long.toLowerCase().includes("finish") ||
    liveMatch?.fixture.status.long.toLowerCase() === "ft";

  // 🔒 নিজস্ব ব্যাকএন্ড রুট থেকে ডাটা নিয়ে আসা
  const fetchLiveScoreFromBackend = async () => {
    try {
      const response = await fetch("/api/fixtures/live-score", {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Backend internal fetch error");
      const data = await response.json();

      // ব্যাকঅ্যান্ড রেসপন্স স্ট্রাকচার (data.data) ভেরিফিকেশন
      if (data && data.success && data.data && data.data.length > 0) {
        setLiveMatch(data.data[0]); 
      } else {
        setLiveMatch(null);
      }
    } catch (error) {
      console.error("Internal API Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveScoreFromBackend();

    // প্রতি ১ মিনিটে রিয়েল-টাইম অটো আপডেট
    intervalRef.current = setInterval(fetchLiveScoreFromBackend, 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black p-6 shadow-2xl">
        
        {/* গ্লোয়িং ইফেক্ট */}
        <div className={`absolute -right-16 -top-16 h-32 w-32 rounded-full blur-[80px] ${isMatchFinished ? "bg-neutral-500/10" : "bg-red-500/10"}`} />

        {/* টপ বার */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {!isMatchFinished && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isMatchFinished ? "bg-neutral-500" : "bg-red-500"}`}></span>
            </span>
            <h2 className={`text-xs font-bold uppercase tracking-widest ${isMatchFinished ? "text-neutral-400" : "text-red-400"}`}>
              {isMatchFinished ? "Match Finished" : "Live Scoreboard"}
            </h2>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-neutral-900/80 px-3 py-1 border border-neutral-800">
            <Trophy className="h-3 w-3 text-amber-500" />
            <span className="text-[10px] text-neutral-400 font-medium">API-Sports Live</span>
          </div>
        </div>

        {/* লোডিং বা কন্টেন্ট স্টেট */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            <p className="text-neutral-400 text-xs font-medium">লাইভ স্কোরবোর্ড আপডেট হচ্ছে...</p>
          </div>
        ) : liveMatch ? (
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
            
            {/* স্কোর সেকশন */}
            <div className="md:col-span-2 flex items-center justify-between bg-neutral-900/30 backdrop-blur-sm rounded-xl p-4 border border-neutral-900/50">
              
              {/* হোম টিম */}
              <div className="flex flex-col items-center flex-1 text-center">
                <div className="relative flex items-center justify-center bg-neutral-900/60 p-2.5 rounded-2xl border border-neutral-800 w-16 h-16">
                  {liveMatch.teams.home.logo ? (
                    <img src={liveMatch.teams.home.logo} alt="Home Logo" className="w-12 h-12 object-contain" />
                  ) : (
                    <div className="w-12 h-12 bg-neutral-800 rounded-md flex items-center justify-center text-[10px] text-neutral-500">No Logo</div>
                  )}
                </div>
                <p className="text-xs text-neutral-200 font-bold mt-3 max-w-[120px] truncate uppercase tracking-wide">
                  {liveMatch.teams.home.name || `TEAM ${liveMatch.teams.home.id}`}
                </p>
                {/* 💡 গোলের ডাটা এখন সরাসরি সঠিক অবজেক্ট থেকে রিড হবে */}
                <p className="text-4xl md:text-5xl font-black text-white mt-2 font-mono tracking-tighter bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
                  {liveMatch.teams.home.goals ?? 0}
                </p>
              </div>

              {/* VS */}
              <div className="px-4 text-center">
                <span className="text-xs font-black tracking-widest text-neutral-700 bg-neutral-950 px-2.5 py-1 rounded-md border border-neutral-900 font-mono">VS</span>
              </div>

              {/* অ্যাওয়ে টিম */}
              <div className="flex flex-col items-center flex-1 text-center">
                <div className="relative flex items-center justify-center bg-neutral-900/60 p-2.5 rounded-2xl border border-neutral-800 w-16 h-16">
                  {liveMatch.teams.away.logo ? (
                    <img src={liveMatch.teams.away.logo} alt="Away Logo" className="w-12 h-12 object-contain" />
                  ) : (
                    <div className="w-12 h-12 bg-neutral-800 rounded-md flex items-center justify-center text-[10px] text-neutral-500">No Logo</div>
                  )}
                </div>
                <p className="text-xs text-neutral-200 font-bold mt-3 max-w-[120px] truncate uppercase tracking-wide">
                  {liveMatch.teams.away.name || `TEAM ${liveMatch.teams.away.id}`}
                </p>
                {/* 💡 গোলের ডাটা এখন সরাসরি সঠিক অবজেক্ট থেকে রিড হবে */}
                <p className="text-4xl md:text-5xl font-black text-white mt-2 font-mono tracking-tighter bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
                  {liveMatch.teams.away.goals ?? 0}
                </p>
              </div>

            </div>

            {/* টাইমার সেকশন */}
            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-neutral-900/60 to-neutral-950/40 border border-neutral-800 px-5 py-6 rounded-xl h-full">
              <div className="p-2.5 rounded-xl bg-neutral-950 mb-3 border border-neutral-800">
                <Timer className={`w-5 h-5 ${isMatchFinished ? "text-neutral-500" : "text-emerald-400 animate-pulse"}`} />
              </div>
              <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest text-center mb-1">
                {liveMatch.fixture.status.long}
              </p>
              <p className="text-xl font-mono font-black tracking-tight text-emerald-400">
                {liveMatch.fixture.status.elapsed}' MINS
              </p>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
            <ShieldAlert className="h-6 w-6 text-neutral-600" />
            <p className="text-neutral-400 text-xs font-semibold tracking-wide">
              এই মুহূর্তে কোনো লাইভ ম্যাচ পাওয়া যায়নি।
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

