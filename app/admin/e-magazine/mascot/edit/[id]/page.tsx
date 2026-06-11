//Mascot Ball Magazine Edit Page - Admin Panel

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Trash2, CloudUpload, Calendar, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CategoryTranslation {
  language: "BN" | "EN";
  name: string;
}

interface Category {
  id: string;
  translations: CategoryTranslation[];
}

export default function EditMascotMagazineCard() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL থেকে আইডি এবং ড্যাশবোর্ডের সিলেক্ট করা ভাষা তুলে আনা হচ্ছে
  const mascotId = params.id as string;
  const initialLang = (searchParams.get("lang") as "BN" | "EN") || "BN";

  const [lang, setLang] = useState<"BN" | "EN">(initialLang);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [seasonId, setSeasonId] = useState<string>("");

  // একক মাসকটের এডিটেবল ডাটা স্টেট
  const [year, setYear] = useState<number>(2026);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [existingImageUrl, setExistingImageUrl] = useState<string>(""); // আগের ছবির ব্যাকআপ

  // ==========================================
  // ১. ডাটাবেজ থেকে ক্যাটাগরি এবং মাসকটের তথ্য লোড করা
  // ==========================================
  useEffect(() => {
    async function fetchOperationalData() {
      try {
        setLoading(true);

        // ক) ক্যাটাগরি লিস্ট ফেচিং
        const resCat = await fetch("/api/categories");
        if (resCat.ok) {
          const result = await resCat.json();
          setCategories(result.data || result);
        }

        // খ) নির্দিষ্ট মাসকটের ডিটেইলস ফেচিং (GET by ID) - এন্ডপয়েন্ট ফিক্সড
        const resMascot = await fetch(`/api/magazine/mascot?id=${mascotId}`);
        if (resMascot.ok) {
          const result = await resMascot.json();
          const mascotData = result.success ? result.data : result;

          if (mascotData) {
            setYear(mascotData.year || 2026);
            setSelectedCategoryId(mascotData.categoryId || "");
            setSeasonId(mascotData.seasonId || "");
            
            if (mascotData.image) {
              setExistingImageUrl(mascotData.image);
              setImagePreview(mascotData.image); // UI প্রিভিউতে আগের ছবি শো করবে
            }

            // সিলেক্টেড ভাষা অনুযায়ী ট্রান্সলেশন ডাটা ফর্ম ইনপুটে বসানো হচ্ছে
            const translation = mascotData.translations?.find((t: any) => t.language === lang);
            setTitle(translation?.title || "");
            setDescription(translation?.content || "");
          }
        }
      } catch (err) {
        console.error("Failed to load edit data:", err);
        alert("ডাটা লোড করতে ব্যর্থ হয়েছে ভাই!");
      } finally {
        setLoading(false);
      }
    }

    if (mascotId) fetchOperationalData();
  }, [mascotId, lang]); // ভাষা বা আইডি চেঞ্জ হলে তথ্য পুনরায় সিঙ্ক হবে

  // 📸 লোকাল ছবি পরিবর্তনের প্রিভিউ জেনারেটর
  const handleImageChange = (file: File | null) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ==========================================
  // ⚡ UPDATE HANDLER (PUT Request)
  // ==========================================
  const handleUpdate = async () => {
    if (!title.trim()) return alert("দয়া করে মাসকটের টাইটেল বা নাম লিখুন!");

    setSaveLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", mascotId);
      formData.append("seasonId", seasonId);
      formData.append("categoryId", selectedCategoryId);
      formData.append("language", lang);
      formData.append("year", year.toString());
      formData.append("title", title);
      formData.append("description", description);

      // নতুন ছবি আপলোড করলে সেটা FormData তে যাবে, না করলে ব্যাকএন্ডে আগের URL ট্র্যাকিং থাকবে
      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        formData.append("existingImageUrl", existingImageUrl);
      }

      // 🎯 এন্ডপয়েন্ট ফিক্সড: /api/magazine/mascot ব্যবহার করা হয়েছে
      const res = await fetch("/api/magazine/mascot", {
        method: "PUT", 
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        alert("🎉 মাসকটের তথ্য সফলভাবে আপডেট হয়েছে ভাই!");
        router.push("/admin/e-magazine/mascot"); // আপডেট শেষে মাসকট ড্যাশবোর্ডে রিডাইরেক্ট
      } else {
        alert(`আপডেট ব্যর্থ হয়েছে: ${result.error || "Database error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("সার্ভার কানেকশন এরর!");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F6F6] text-neutral-500 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-xs font-semibold animate-pulse">মাসকটের ডাটাবেজ রেকর্ড রিড করা হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4 sm:p-12 text-neutral-800 antialiased font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* ১. টপ কন্ট্রোল বার */}
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-neutral-200/60 mb-8 sticky top-4 z-30 backdrop-blur-md bg-white/95">
          <div className="flex items-center gap-4">
            
            {/* ব্যাক বাটন */}
            <Link href="/admin/e-magazine/mascot" className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 transition" title="ফিরে যান">
              <ArrowLeft className="w-4 h-4" />
            </Link>

            {/* EN / BN সুইচ বাটন */}
            <div className="flex bg-neutral-100 p-1 rounded-lg border border-neutral-200">
              <button
                type="button"
                onClick={() => setLang("EN")}
                className={`px-4 py-1 text-xs font-bold rounded-md transition ${
                  lang === "EN" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-400"
                }`}
              >EN</button>
              <button
                type="button"
                onClick={() => setLang("BN")}
                className={`px-4 py-1 text-xs font-bold rounded-md transition ${
                  lang === "BN" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-400"
                }`}
              >BN</button>
            </div>

            {/* ডাইনামিক ক্যাটাগরি ড্রপডাউন */}
            <div className="relative">
              <select
                className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-1.5 text-xs font-semibold focus:outline-none appearance-none pr-8 cursor-pointer text-neutral-700"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                {categories.length > 0 ? (
                  categories.map((cat) => {
                    const transName = cat.translations.find(t => t.language === lang)?.name || "ক্যাটাগরি";
                    return (
                      <option key={cat.id} value={cat.id}>
                        🎭 {transName}
                      </option>
                    );
                  })
                ) : (
                  <option value="MASCOT">🎭 টুর্নামেন্ট মাসকট (Default)</option>
                )}
              </select>
              <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-neutral-400 text-[10px]">
                ▼
              </div>
            </div>

            {/* বছর ইনপুট ফিল্ড */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 ml-2">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <input 
                type="number" 
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-16 bg-neutral-50 border border-neutral-200 rounded px-1.5 py-0.5 focus:outline-none text-center"
              />
            </div>
          </div>

          {/* সেভ বাটন */}
          <button
            onClick={handleUpdate}
            disabled={saveLoading}
            className="bg-[#A3E635] hover:bg-[#92cf2e] text-neutral-950 px-6 py-2 rounded-full font-bold text-xs shadow-sm transition active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            {saveLoading && <Loader2 className="w-3 h-3 animate-spin" />}
            {saveLoading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>

        {/* ২. এডিটর ফর্ম কার্ড এরিয়া */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-8 shadow-sm relative flex flex-col md:flex-row gap-8 items-start">
          
          {/* [বামে] ড্যাশড ইমেজ আপলোডার */}
          <div className="w-full md:w-[240px] h-[240px] flex-shrink-0">
            <label className="w-full h-full border-2 border-dashed border-purple-200 bg-purple-50/5 hover:bg-purple-50/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
              />
              {imagePreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition text-white text-xs font-semibold">
                    Change Image
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <CloudUpload className="w-10 h-10 text-neutral-300 mx-auto mb-2.5" />
                  <span className="text-xs font-bold text-neutral-400 block">Click to upload image</span>
                </div>
              )}
            </label>
          </div>

          {/* [ডানে] ইনপুট ফিল্ডস */}
          <div className="flex-1 w-full space-y-4 pt-2">
            
            {/* টাইটেল ইনপুট */}
            <input
              type="text"
              placeholder={lang === "BN" ? "মাসকটের নাম/টাইটেল..." : "Mascot Name/Title..."}
              className="w-full bg-transparent text-3xl font-bold focus:outline-none placeholder:text-neutral-200 text-neutral-800 tracking-tight"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* ডেসক্রিপশন টেক্সট এরিয়া */}
            <div className="flex items-start gap-4">
              <button 
                type="button" 
                className="w-8 h-8 border border-neutral-300 rounded-full flex items-center justify-center text-neutral-300 text-lg hover:border-neutral-500 transition-colors select-none flex-shrink-0"
              >
                +
              </button>
              <textarea
                placeholder={lang === "BN" ? "মাসকটের ইতিহাস বা বিবরণ বাংলায় লিখুন..." : "Tell the story of this mascot..."}
                rows={6}
                className="w-full bg-transparent text-base leading-relaxed focus:outline-none resize-none placeholder:text-neutral-300 text-neutral-600 pt-0.5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}