// app/admin/categories/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Loader2, 
  Globe, 
  Layers, 
  Star 
} from "lucide-react";

export default function CategoryListPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ১. ক্যাটাগরি ডেটা ফেচ করা
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ২. ক্যাটাগরি ডিলিট হ্যান্ডলার (ক্লাউডিনারি ইমেজ সহ ডিলিট হবে ব্যাকএন্ড লজিক অনুযায়ী)
  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত? এই ক্যাটাগরি এবং এর লোগো স্থায়ীভাবে মুছে যাবে!")) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        alert("ক্যাটাগরি সফলভাবে ডিলিট হয়েছে।");
      } else {
        const err = await res.json();
        alert(err.message || "ডিলিট করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b08] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-emerald-500/70 font-medium animate-pulse">ক্যাটাগরি লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b08] text-gray-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* হেডার সেকশন */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0b130e]/40 border border-emerald-950/60 p-6 rounded-3xl backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-950/50 rounded-2xl border border-emerald-800/30">
              <Layers className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">ক্যাটাগরি ম্যানেজমেন্ট</h1>
              <p className="text-xs text-emerald-500/60 mt-1">সবগুলো ক্যাটাগরি এখান থেকে নিয়ন্ত্রণ করুন</p>
            </div>
          </div>
          <Link href="/admin/categories" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-950/50">
            <Plus className="w-4 h-4" /> নতুন ক্যাটাগরি
          </Link>
        </div>

        {/* ক্যাটাগরি গ্রিড */}
        {categories.length === 0 ? (
          <div className="text-center py-20 bg-[#0b130e]/20 border border-dashed border-emerald-950/60 rounded-3xl">
            <ImageIcon className="w-12 h-12 text-emerald-900 mx-auto mb-4" />
            <p className="text-gray-500">এখনো কোনো ক্যাটাগরি তৈরি করা হয়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const bn = cat.translations.find((t: any) => t.language === "BN");
              const en = cat.translations.find((t: any) => t.language === "EN");

              return (
                <div key={cat.id} className="group bg-[#0b130e]/30 border border-emerald-950/60 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/30 transition-all duration-300 flex flex-col shadow-xl">
                  
                  {/* লোগো প্রিভিউ এরিয়া */}
                  <div className="relative aspect-square w-full bg-emerald-950/10 p-8 flex items-center justify-center overflow-hidden border-b border-emerald-950/40">
                    {cat.image ? (
                      <img 
                        src={cat.image} 
                        alt="Category Logo" 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <ImageIcon className="w-16 h-16 text-emerald-900/50" />
                    )}
                    
                    {/* Featured Badge */}
                    {cat.featured && (
                      <div className="absolute top-5 right-5 bg-emerald-500 text-black p-1.5 rounded-full shadow-lg">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* টেক্সট কন্টেন্ট */}
                  <div className="p-6 flex flex-col flex-1 gap-4">
                    <div className="space-y-3">
                      {/* বাংলা নাম */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-emerald-950 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-900/30">BN</span>
                        <h3 className="font-bold text-gray-100 text-lg leading-tight line-clamp-1">{bn?.name || "নাম নেই"}</h3>
                      </div>
                      
                      {/* ইংরেজি নাম */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-gray-900 text-gray-500 px-1.5 py-0.5 rounded border border-gray-800">EN</span>
                        <p className="text-sm font-medium text-gray-400 line-clamp-1">{en?.name || "No English Name"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-emerald-950/50 mt-auto">
                      <Link 
                        href={`/admin/categories/edit/${cat.id}`} 
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 rounded-2xl border border-emerald-800/20 transition-all text-xs font-bold"
                      >
                        <Edit className="w-3.5 h-3.5" /> ইডিট
                      </Link>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="p-2.5 bg-red-950/30 hover:bg-red-900/40 text-red-500 rounded-2xl border border-red-900/20 transition-all"
                        title="ডিলিট করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}