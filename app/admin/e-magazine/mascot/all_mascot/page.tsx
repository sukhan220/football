"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutGrid, Table2, Edit, Trash2, Globe, Plus, Loader2, Image as ImageIcon, Calendar } from "lucide-react";

interface Translation {
  language: "BN" | "EN";
  title: string;
  content: string;
}

interface MascotData {
  id: string;
  seasonId: string;
  category: string;
  year: number;
  image: string;
  displayOrder: number;
  translations: Translation[];
}

// ================= উপ-কম্পোনেন্ট: টেবিল ভিউ (TableView) =================
function TableView({ mascots, lang, onDelete }: { mascots: MascotData[]; lang: "BN" | "EN"; onDelete: (id: string) => void }) {
  // শুধুমাত্র সিলেক্টেড ল্যাঙ্গুয়েজের ট্রান্সলেশন থাকা মাসকট ফিল্টার করা হচ্ছে
  const filteredMascots = mascots?.filter(mascot => mascot.translations.some((t) => t.language === lang)) || [];

  if (filteredMascots.length === 0) {
    return <div className="text-center py-20 text-gray-500 text-sm border border-dashed border-emerald-950/60 rounded-3xl">এই ভাষায় কোনো মাসকটের তথ্য পাওয়া যায়নি।</div>;
  }

  return (
    <div className="bg-[#0b130e]/30 border border-emerald-950/60 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-emerald-950 bg-[#0b130e]/80 text-xs font-bold text-emerald-500 tracking-wider">
              <th className="p-5">মাসকটের চিত্র</th>
              <th className="p-5">মাসকটের নাম</th>
              <th className="p-5 text-center">সাল / বছর</th>
              <th className="p-5 text-center">ডিসপ্লে অর্ডার</th>
              <th className="p-5 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-950/50 text-sm">
            {filteredMascots.map((mascot) => {
              const trans = mascot.translations.find((t) => t.language === lang);
              return (
                <tr key={mascot.id} className="hover:bg-emerald-950/10 transition-colors group">
                  <td className="p-5">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-emerald-950/80 bg-emerald-950/20 flex items-center justify-center">
                      {mascot.image ? (
                        <img src={mascot.image} alt="Mascot" className="object-cover w-full h-full" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-emerald-800" />
                      )}
                    </div>
                  </td>
                  <td className="p-5 max-w-xs sm:max-w-md">
                    <h3 className="font-bold text-gray-200 line-clamp-1 group-hover:text-emerald-400 transition-colors">{trans?.title || "Untitled Mascot"}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">ID: {mascot.id.slice(0, 8)}...</p>
                  </td>
                  <td className="p-5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-500/10">
                      <Calendar className="w-3 h-3" /> {mascot.year}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <span className="text-gray-400 font-mono text-xs">{mascot.displayOrder}</span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/e-magazine/mascot/edit/${mascot.id}?lang=${lang}`} className="p-2 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/30 text-emerald-400 rounded-xl transition-all">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => onDelete(mascot.id)} className="p-2 bg-red-950/60 hover:bg-red-900 border border-red-900/30 text-red-400 rounded-xl transition-all">
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
function CardView({ mascots, lang, onDelete }: { mascots: MascotData[]; lang: "BN" | "EN"; onDelete: (id: string) => void }) {
  const filteredMascots = mascots?.filter(mascot => mascot.translations.some((t) => t.language === lang)) || [];

  if (filteredMascots.length === 0) {
    return <div className="text-center py-20 text-gray-500 text-sm border border-dashed border-emerald-950/60 rounded-3xl">এই ভাষায় কোনো মাসকটের তথ্য পাওয়া যায়নি।</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredMascots.map((mascot) => {
        const trans = mascot.translations.find((t) => t.language === lang);
        return (
          <div key={mascot.id} className="group bg-[#0b130e]/20 border border-emerald-950/40 rounded-3xl overflow-hidden hover:border-emerald-500/30 hover:bg-[#0b130e]/40 transition-all flex flex-col h-full shadow-lg">
            
            {/* কভার ইমেজ ও বছর ট্যাগ */}
            <div className="relative aspect-square w-full bg-emerald-950/20 overflow-hidden border-b border-emerald-950/40 flex items-center justify-center p-6">
              {mascot.image ? (
                <img src={mascot.image} alt="Mascot" className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <ImageIcon className="w-12 h-12 text-emerald-900" />
              )}
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 text-[10px] font-black rounded-md tracking-wider uppercase border shadow-md bg-emerald-950 text-emerald-400 border-emerald-500/30 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {mascot.year}
                </span>
              </div>
            </div>

            {/* কার্ড বডি কন্টেন্ট */}
            <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-gray-100 group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug text-base">
                  {trans?.title || "Untitled Mascot"}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-3 font-normal leading-relaxed">
                  {trans?.content || "কোনো বিবরণ দেওয়া হয়নি..."}
                </p>
              </div>

              {/* অ্যাকশন বাটন গ্রুপ */}
              <div className="flex items-center justify-between border-t border-emerald-950/50 pt-4 mt-auto">
                <div className="text-xs text-gray-500">
                  Order: <span className="text-emerald-500 font-mono font-bold">{mascot.displayOrder}</span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/e-magazine/mascot/edit/${mascot.id}?lang=${lang}`} className="p-2 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/30 text-emerald-400 rounded-xl transition-all" title="Edit">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => onDelete(mascot.id)} className="p-2 bg-red-950/60 hover:bg-red-900 border border-red-900/30 text-red-400 rounded-xl transition-all" title="Delete">
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

// ================= মেইন ড্যাশবোর্ড কম্পোনেন্ট =================
export default function AdminMascotDashboard() {
  const [mascots, setMascots] = useState<MascotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [langTab, setLangTab] = useState<"BN" | "EN">("BN");

  // ডাটাবেজ থেকে মাসকটের তথ্য ফেচ করা (GET)
  const fetchMascots = async () => {
    try {
      setLoading(true);
      // 🎯 এন্ডপয়েন্ট চেঞ্জ করে /api/magazine/mascot করা হয়েছে
      const res = await fetch("/api/magazine/mascot"); 
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setMascots(result.data);
        } else {
          setMascots(result);
        }
      }
    } catch (error) {
      console.error("Error loading mascots:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMascots();
  }, []);

  // মাসকট ডিলিট হ্যান্ডলার (DELETE)
  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত ভাই? এই মাসকটের যাবতীয় তথ্য স্থায়ীভাবে মুছে যাবে!")) return;
    
    try {
      // 🎯 ডিলিট এন্ডপয়েন্টও /api/magazine/mascot করা হয়েছে
      const res = await fetch(`/api/magazine/mascot?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      
      if (res.ok && result.success) {
        setMascots((prev) => prev.filter((mascot) => mascot.id !== id));
      } else {
        alert("ডিলিট করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b08] text-gray-100 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-emerald-500/70 font-medium animate-pulse">টুর্নামেন্ট মাসকটের ডেটা লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b08] text-gray-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* হেডার সেকশন */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0b130e]/40 border border-emerald-950/60 p-6 rounded-3xl backdrop-blur-md">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">মাসকট ম্যানেজমেন্ট</h1>
            <p className="text-xs text-emerald-500/60 mt-1">সবগুলো সিজনের অফিসিয়াল টুর্নামেন্ট মাসকটের তালিকা কন্ট্রোল ও মনিটর করুন</p>
          </div>
          <Link href="/admin/e-magazine/mascot" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-5 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-950/50">
            <Plus className="w-4 h-4" /> নতুন মাসকট যুক্ত করুন
          </Link>
        </div>

        {/* ফিল্টার এবং লেআউট কন্ট্রোল */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* ভাষা ফিল্টার ট্যাব */}
          <div className="flex bg-[#0b130e] border border-emerald-950/80 p-1 rounded-2xl w-full sm:w-auto">
            <button 
              onClick={() => setLangTab("BN")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${langTab === "BN" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/30" : "text-gray-400 hover:text-gray-200"}`}
            >
              <Globe className="w-4 h-4" /> বাংলা তথ্য
            </button>
            <button 
              onClick={() => setLangTab("EN")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${langTab === "EN" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/30" : "text-gray-400 hover:text-gray-200"}`}
            >
              <Globe className="w-4 h-4" /> English Info
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

        {/* ডাটা রেন্ডারার */}
        {viewMode === "table" ? (
          <TableView mascots={mascots} lang={langTab} onDelete={handleDelete} />
        ) : (
          <CardView mascots={mascots} lang={langTab} onDelete={handleDelete} />
        )}

      </div>
    </div>
  );
}