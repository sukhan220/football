// app/admin/news/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutGrid, Table2, Edit, Trash2, Globe, Eye, MessageSquare, ThumbsUp, Plus, Loader2 } from "lucide-react";


// ================= উপ-কম্পোনেন্ট: টেবিল ভিউ (TableView) =================
function TableView({ articles, lang, onDelete }: {articles: any[] | undefined; lang: "BN" | "EN"; onDelete: (id: string) => void }) {
  // শুধুমাত্র সিলেক্টেড ল্যাঙ্গুয়েজের ট্রান্সলেশন থাকা নিউজ ফিল্টার করা হচ্ছে
  const filteredArticles = articles?.filter(art => art.translations.some((t: any) => t.language === lang)) || [];

  if (filteredArticles.length === 0) {
    return <div className="text-center py-20 text-gray-500 text-sm border border-dashed border-emerald-950/60 rounded-3xl">এই ভাষায় কোনো নিউজ পাওয়া যায়নি।</div>;
  }

  return (
    <div className="bg-[#0b130e]/30 border border-emerald-950/60 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-emerald-950 bg-[#0b130e]/80 text-xs font-bold text-emerald-500 tracking-wider">
              <th className="p-5">কভার ইমেজ</th>
              <th className="p-5">শিরোনাম</th>
              <th className="p-5">স্ট্যাটাস</th>
              <th className="p-5">পরিসংখ্যান</th>
              <th className="p-5 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-950/50 text-sm">
            {filteredArticles.map((art) => {
              const trans = art.translations.find((t: any) => t.language === lang);
              return (
                <tr key={art.id} className="hover:bg-emerald-950/10 transition-colors group">
                  <td className="p-5">
                    <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-emerald-950/80 bg-emerald-950/20">
                      <img src={art.coverImage || "/default-news.png"} alt="Cover" className="object-cover w-full h-full" />
                    </div>
                  </td>
                  <td className="p-5 max-w-xs sm:max-w-md">
                    <h3 className="font-bold text-gray-200 line-clamp-1 group-hover:text-emerald-400 transition-colors">{trans?.title}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">ID: {art.id.slice(0, 8)}...</p>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex px-2.5 py-1 text-[10px] font-black rounded-md tracking-wider uppercase ${
                      art.status === "PUBLISHED" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/20" : "bg-amber-950/80 text-amber-400 border border-amber-500/20"
                    } border`}>
                      {art.status}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1" title="Views"><Eye className="w-3.5 h-3.5" /> {art.views}</span>
                      <span className="flex items-center gap-1" title="Likes"><ThumbsUp className="w-3.5 h-3.5" /> {art.likesCount}</span>
                      <span className="flex items-center gap-1" title="Comments"><MessageSquare className="w-3.5 h-3.5" /> {art.commentsCount}</span>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/news/edit/${art.id}?lang=${lang}`} className="p-2 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/30 text-emerald-400 rounded-xl transition-all">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => onDelete(art.id)} className="p-2 bg-red-950/60 hover:bg-red-900 border border-red-900/30 text-red-400 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ================= উপ-কম্পোনেন্ট: কার্ড ভিউ (CardView) =================
function CardView({ articles, lang, onDelete }: { articles: any[] | undefined; lang: "BN" | "EN"; onDelete: (id: string) => void }) {
  const filteredArticles = articles?.filter(art => art.translations.some((t: any) => t.language === lang)) || [];

  if (filteredArticles.length === 0) {
    return <div className="text-center py-20 text-gray-500 text-sm border border-dashed border-emerald-950/60 rounded-3xl">এই ভাষায় কোনো নিউজ পাওয়া যায়নি।</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredArticles.map((art) => {
        const trans = art.translations.find((t: any) => t.language === lang);
        return (
          <div key={art.id} className="group bg-[#0b130e]/20 border border-emerald-950/40 rounded-3xl overflow-hidden hover:border-emerald-500/30 hover:bg-[#0b130e]/40 transition-all flex flex-col h-full shadow-lg">
            
            {/* কভার ইমেজ ও স্ট্যাটাস ট্যাগ */}
            <div className="relative aspect-[16/10] w-full bg-emerald-950/20 overflow-hidden border-b border-emerald-950/40">
              <img src={art.coverImage || "/default-news.png"} alt="Cover" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                <span className={`px-2.5 py-1 text-[10px] font-black rounded-md tracking-wider uppercase border shadow-md ${
                  art.status === "PUBLISHED" ? "bg-emerald-950 text-emerald-400 border-emerald-500/30" : "bg-amber-950 text-amber-400 border-amber-500/30"
                }`}>
                  {art.status}
                </span>
              </div>
            </div>

            {/* কার্ড বডি কন্টেন্ট */}
            <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-gray-100 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug text-base">
                  {trans?.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 font-normal leading-relaxed">
                  {trans?.excerpt || "কোনো সারসংক্ষেপ দেওয়া হয়নি..."}
                </p>
              </div>

              {/* পরিসংখ্যান ও অ্যাকশন বাটন গ্রুপ */}
              <div className="flex items-center justify-between border-t border-emerald-950/50 pt-4 mt-auto">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {art.views}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {art.commentsCount}</span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/news/edit/${art.id}?lang=${lang}`} className="p-2 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/30 text-emerald-400 rounded-xl transition-all" title="Edit">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => onDelete(art.id)} className="p-2 bg-red-950/60 hover:bg-red-900 border border-red-900/30 text-red-400 rounded-xl transition-all" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default function AdminNewsDashboard() {
  const [articles, setArticles] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [langTab, setLangTab] = useState<"BN" | "EN">("BN");

  // ডেটা লোড করা
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/articles");
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // ডিলিট হ্যান্ডলার
  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত? এই সংবাদের সমস্ত কমেন্ট ও ইমেজ স্থায়ীভাবে মুছে যাবে!")) return;
    
    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: "DELETE" });
      if (res.ok) {
       setArticles((prev) => prev?.filter((art) => art.id !== id) || []);
      } else {
        alert("ডিলিট করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b08] text-gray-100 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-emerald-500/70 font-medium animate-pulse">নিউজ ডেটা লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b08] text-gray-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* হেডার সেকশন */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0b130e]/40 border border-emerald-950/60 p-6 rounded-3xl backdrop-blur-md">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">নিউজ ম্যানেজমেন্ট</h1>
            <p className="text-xs text-emerald-500/60 mt-1">পোর্টালের সমস্ত খবর কন্ট্রোল ও মনিটর করুন</p>
          </div>
          <Link href="/admin/news/create" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-5 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-950/50">
            <Plus className="w-4 h-4" /> নতুন নিউজ যুক্ত করুন
          </Link>
        </div>

        {/* ফিল্টার এবং টগল কন্ট্রোল */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* ভাষা ফিল্টার ট্যাব */}
          <div className="flex bg-[#0b130e] border border-emerald-950/80 p-1 rounded-2xl w-full sm:w-auto">
            <button 
              onClick={() => setLangTab("BN")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${langTab === "BN" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/30" : "text-gray-400 hover:text-gray-200"}`}
            >
              <Globe className="w-4 h-4" /> বাংলা নিউজ
            </button>
            <button 
              onClick={() => setLangTab("EN")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${langTab === "EN" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/30" : "text-gray-400 hover:text-gray-200"}`}
            >
              <Globe className="w-4 h-4" /> English News
            </button>
          </div>

          {/* লেআউট টগল বাটন */}
          <div className="flex bg-[#0b130e] border border-emerald-950/80 p-1 rounded-xl self-end sm:self-auto">
            <button 
              onClick={() => setViewMode("table")}
              className={`p-2.5 rounded-lg transition-all ${viewMode === "table" ? "bg-emerald-950 text-emerald-400" : "text-gray-500 hover:text-gray-300"}`}
              title="Table View"
            >
              <Table2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode("card")}
              className={`p-2.5 rounded-lg transition-all ${viewMode === "card" ? "bg-emerald-950 text-emerald-400" : "text-gray-500 hover:text-gray-300"}`}
              title="Card View"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* নিউজ ডিসপ্লে রেন্ডারার */}
        {viewMode === "table" ? (
          <TableView articles={articles} lang={langTab} onDelete={handleDelete} />
        ) : (
          <CardView articles={articles} lang={langTab} onDelete={handleDelete} />
        )}

      </div>
    </div>
  );
}