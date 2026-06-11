"use client";

import React, { useState, useEffect } from "react";
import { 
  RefreshCw, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Database
} from "lucide-react";

// ফুটবল-ডাটার সাপোর্টেড কম্পিটিশন লিস্ট (image_0ddbb9.png রেফারেন্স অনুযায়ী)
const AVAILABLE_COMPETITIONS = [
  { code: "WC", name: "FIFA World Cup" },
  { code: "CL", name: "UEFA Champions League" },
  { code: "PL", name: "Premier League (England)" },
  { code: "PD", name: "La Liga (Spain)" },
  { code: "SA", name: "Serie A (Italy)" },
  { code: "BL1", name: "Bundesliga (Germany)" },
  { code: "FL1", name: "Ligue 1 (France)" },
  { code: "DED", name: "Eredivisie (Netherlands)" },
  { code: "PPL", name: "Primeira Liga (Portugal)" },
  { code: "BSA", name: "Campeonato Brasileiro Série A" },
  { code: "ELC", name: "Championship (England)" },
  { code: "EC", name: "European Championship" },
];

interface Category {
  id: string;
  // আপনার স্কিমা অনুযায়ী CategoryTranslation থেকে নাম আসবে, এখানে ড্রপডাউনের জন্য সাধারণ ইন্টারফেস
  name: string; 
}

export default function FixtureManager() {
  // স্টেট ম্যানেজমেন্ট
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [season, setSeason] = useState("2026");
  
  // এপিআই সিঙ্ক স্টেট
  const [competitionCode, setCompetitionCode] = useState("PL");
  const [isSyncing, setIsSyncing] = useState(false);

  // CSV আপলোড স্টেট
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // নোটিফিকেশন স্টেট
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ডাটাবেজ থেকে অলরেডি ইনপুট থাকা ক্যাটাগরিগুলো লোড করা
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories"); // আপনার ক্যাটাগরি গেট এপিআই রাউট
        if (res.ok) {
          const data = await res.json();
          // ডাটা ফরম্যাট অনুযায়ী সেট করবেন (যেমন translations[0].name বা সরাসরি name)
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    loadCategories();
    
    // ব্যাকআপ ডেটা (যদি আপনার ক্যাটাগরি এপিআই রেডি না থাকে টেস্ট করার জন্য)
    if(categories.length === 0) {
      setCategories([
        { id: "ucl-uuid-12345", name: "UEFA Champions League" },
        { id: "pl-uuid-67890", name: "Premier League" },
        { id: "wc-uuid-11223", name: "FIFA World Cup" }
      ]);
    }
  }, []);

  // ১. ফুটবল-ডাটা এপিআই সিঙ্ক হ্যান্ডলার
  const handleApiSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) {
      setStatusMessage({ type: "error", text: "দয়া করে ডাটাবেজের একটি ক্যাটাগরি সিলেক্ট করুন!" });
      return;
    }

    setIsSyncing(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/fixtures/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: selectedCategoryId,
          competitionCode,
          season
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatusMessage({ type: "success", text: data.message || "ফিক্সচার সফলভাবে সিঙ্ক হয়েছে!" });
      } else {
        setStatusMessage({ type: "error", text: data.message || "সিঙ্ক করতে ব্যর্থ হয়েছে।" });
      }
    } catch (error) {
      setStatusMessage({ type: "error", text: "সার্ভারে কানেক্ট করতে সমস্যা হচ্ছে!" });
    } finally {
      setIsSyncing(false);
    }
  };

  // ২. ম্যানুয়াল CSV ফাইল আপলোড হ্যান্ডলার
  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId || !csvFile) {
      setStatusMessage({ type: "error", text: "ক্যাটাগরি এবং CSV ফাইল উভয়ই সিলেক্ট করা বাধ্যতামূলক!" });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("categoryId", selectedCategoryId);
    formData.append("season", season);

    try {
      const res = await fetch("/api/fixtures/bulk", {
        method: "POST",
        body: formData, // FormData পাঠালে Content-Type হেডার দেওয়া লাগে না
      });

      const data = await res.json();

      if (res.ok) {
        setStatusMessage({ type: "success", text: data.message || "CSV ফিক্সচার সফলভাবে আপলোড হয়েছে!" });
        setCsvFile(null);
        // ফাইল ইনপুট রিসেট
        const fileInput = document.getElementById("csv_reader") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setStatusMessage({ type: "error", text: data.message || "CSV আপলোড ব্যর্থ হয়েছে।" });
      }
    } catch (error) {
      setStatusMessage({ type: "error", text: "ফাইল আপলোড করার সময় কোনো সমস্যা হয়েছে!" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* হেডার সেকশন */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Database className="text-indigo-600 h-8 w-8" /> 
              ম্যাচ ফিক্সচার ম্যানেজার
            </h1>
            <p className="text-slate-500 mt-1">
              ফুটবল-ডাটা ডট অর্গ এপিআই অথবা ম্যানুয়াল CSV ফাইলের মাধ্যমে আপনার সিস্টেমে ম্যাচের সময়সূচী যুক্ত করুন।
            </p>
          </div>
        </div>

        {/* গ্লোবাল নোটিফিকেশন ব্যানার */}
        {statusMessage && (
          <div className={`p-4 rounded-xl mb-6 border flex items-start gap-3 animate-fade-in ${
            statusMessage.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}>
            {statusMessage.type === "success" ? <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-emerald-600" /> : <AlertCircle className="h-5 w-5 mt-0.5 shrink-0 text-rose-600" />}
            <div>
              <p className="font-medium">{statusMessage.type === "success" ? "সফল হয়েছে!" : "ত্রুটি (Error)"}</p>
              <p className="text-sm opacity-90 mt-0.5">{statusMessage.text}</p>
            </div>
          </div>
        )}

        {/* কমন কনফিগারেশন কার্ড (যা দুই অপশনের জন্যই লাগবে) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2 border-b pb-2">
            <span className="bg-slate-100 text-slate-700 h-6 w-6 rounded-full flex items-center justify-center text-xs">১</span>
            ধাপ ১: গন্তব্য ও সময়কাল নির্বাচন করুন
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                আপনার ডাটাবেজের ক্যাটাগরি (Tournament)
              </label>
              <select 
                value={selectedCategoryId} 
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">-- একটি টুর্নামেন্ট সিলেক্ট করুন --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">এই ক্যাটাগরির আন্ডারে ম্যাচগুলো ডাটাবেজে সেভ হবে।</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                সিজন (Season / Year)
              </label>
              <input 
                type="text" 
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="e.g. 2026 or 2025-26"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-400 mt-1">ফুটবল ডাটার জন্য সাধারণত স্টার্টিং বছরটি দিতে হয় (যেমন: 2025 বা 2026)।</p>
            </div>
          </div>
        </div>

        {/* দুই ধরণের সোর্স এর গ্রিড লেআউট */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* অপশন A: ফুটবল-ডাটা ডট অর্গ লাইভ সিঙ্ক */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2 border-b pb-2">
                <span className="bg-indigo-100 text-indigo-700 h-6 w-6 rounded-full flex items-center justify-center text-xs">A</span>
                অপশন A: লাইভ API ডাটা সিঙ্ক (প্রস্তাবিত)
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                ফুটবল-ডাটা ডট অর্গ থেকে সরাসরি সম্পূর্ণ লিগের অফিসিয়াল ফিক্সচার, টাইমজোন, টিমের অরিজিনাল নাম এবং লোগো অটোমেটিক নিয়ে আসবে।
              </p>

              <form onSubmit={handleApiSync} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ফুটবল-ডাটা এর কম্পিটিশন সোর্স
                  </label>
                  <select 
                    value={competitionCode} 
                    onChange={(e) => setCompetitionCode(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {AVAILABLE_COMPETITIONS.map((comp) => (
                      <option key={comp.code} value={comp.code}>
                        {comp.code} - {comp.name}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleApiSync}
                disabled={isSyncing || !selectedCategoryId}
                className={`w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all ${
                  (isSyncing || !selectedCategoryId) && "opacity-50 cursor-not-allowed bg-indigo-400"
                }`}
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "ডাটা সিঙ্ক হচ্ছে..." : "API থেকে লাইভ সিঙ্ক করুন"}
              </button>
            </div>
          </div>

          {/* অপশন B: ম্যানুয়াল CSV ফাইল বাল্ক আপলোড */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2 border-b pb-2">
                <span className="bg-teal-100 text-teal-700 h-6 w-6 rounded-full flex items-center justify-center text-xs">B</span>
                অপশন B: কাস্টম CSV ফাইল আপলোড
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                লোকাল কোনো টুর্নামেন্ট বা এমন কোনো ম্যাচের জন্য যার এপিআই সাপোর্ট নেই, সেটির সময়সূচী এক্সেল বা গুগল শিট থেকে ডিরেক্ট আপলোড করুন।
              </p>

              {/* কলাম গাইডলাইন পপওভার স্টাইল */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 mb-4 space-y-1">
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5 text-slate-500" /> CSV কলামের রিকোয়ার্ড ফরম্যাট:
                </span>
                <p><code className="bg-slate-200 px-1 rounded text-rose-600">homeTeam</code>, <code className="bg-slate-200 px-1 rounded text-rose-600">awayTeam</code>, <code className="bg-slate-200 px-1 rounded text-rose-600">matchDate</code> (ISO Format), <code className="bg-slate-200 px-1 rounded">round</code>, <code className="bg-slate-200 px-1 rounded">venue</code></p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    আপনার তৈরি করা CSV ফাইলটি দিন
                  </label>
                  <div className="relative border-2 border-dashed border-slate-300 rounded-xl hover:border-slate-400 transition-colors bg-slate-50/50 p-4 flex flex-col items-center justify-center text-center cursor-pointer">
                    <input 
                      type="file" 
                      id="csv_reader"
                      accept=".csv"
                      onChange={(e) => {
                        if(e.target.files && e.target.files[0]) {
                          setCsvFile(e.target.files[0]);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FileSpreadsheet className="h-8 w-8 text-slate-400 mb-2" />
                    {csvFile ? (
                      <p className="text-sm font-medium text-indigo-600 truncate max-w-xs">{csvFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-slate-600 font-medium">ক্লিক করে ফাইল সিলেক্ট করুন</p>
                        <p className="text-xs text-slate-400 mt-0.5">শুধুমাত্র .csv এক্সটেনশন সাপোর্টেড</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCsvUpload}
                disabled={isUploading || !csvFile || !selectedCategoryId}
                className={`w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all ${
                  (isUploading || !csvFile || !selectedCategoryId) && "opacity-50 cursor-not-allowed bg-teal-400"
                }`}
              >
                <Upload className="h-4 w-4" />
                {isUploading ? "ফাইল প্রসেস হচ্ছে..." : "CSV বাল্ক আপলোড করুন"}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}