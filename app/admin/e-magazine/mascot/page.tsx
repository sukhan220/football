// "use client";




"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, CloudUpload, Calendar } from "lucide-react";

interface CategoryTranslation {
  language: "BN" | "EN";
  name: string;
}

interface Category {
  id: string;
  translations: CategoryTranslation[];
}

interface MascotCard {
  id: string;             // ক্লায়েন্ট সাইড ট্র্যাকিং আইডি
  year: number;
  imageFile: File | null;   // আসল ফাইল আপলোডের জন্য
  imagePreview: string;     // UI-তে ছবি দেখানোর জন্য
  title: string;
  description: string;
}

export default function MascotCardEditor() {
  const [lang, setLang] = useState<"BN" | "EN">("BN");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  
  // 🎯 ফিক্সড: ডাটাবেজের 'P2023' এরর এড়াতে একটি ভ্যালিড UUID ডিফল্ট ফরম্যাট দেওয়া হলো।
  const [seasonId, setSeasonId] = useState<string>("3a49425b-6a2c-4829-8d84-c71c14e6bdd7"); 

  // ড্যাশবোর্ডের স্ক্রিনশট অনুযায়ী ইনিশিয়াল কার্ড স্টেট
  const [cards, setCards] = useState<MascotCard[]>([
    {
      id: "card-1",
      year: 2026,
      imageFile: null,
      imagePreview: "",
      title: "",
      description: "",
    }
  ]);

  // ডাটাবেজ থেকে ক্যাটাগরি লিস্ট লোড করা
  useEffect(() => {
    async function fetchData() {
      try {
        // ১. ক্যাটাগরি ফেচিং
        const resCat = await fetch("/api/categories"); 
        if (resCat.ok) {
          const result = await resCat.json();
          const fetchedData = result.data || result;
          setCategories(fetchedData);
          if (fetchedData.length > 0) {
            setSelectedCategoryId(fetchedData[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch operational data:", err);
      }
    }
    fetchData();
  }, []);

  // ➕ নিচে নতুন কার্ড রো (Row) যোগ করা
  const addNewCard = () => {
    setCards([
      ...cards,
      {
        id: `card-${Date.now()}`,
        year: 2026,
        imageFile: null,
        imagePreview: "",
        title: "",
        description: "",
      }
    ]);
  };

  // 🗑️ কার্ড রিমুভ করার লজিক
  const deleteCard = (id: string) => {
    if (cards.length === 1) return alert("কমপক্ষে একটি কার্ড রাখতে হবে ভাই!");
    setCards(cards.filter(c => c.id !== id));
  };

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleInputChange = (id: string, field: keyof MascotCard, value: any) => {
    setCards(cards.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // 📸 লোকাল ড্রপ/সিলেক্ট ইমেজ প্রিভিউ জেনারেটর
  const handleImageChange = (id: string, file: File | null) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setCards(cards.map(c => 
      c.id === id ? { ...c, imageFile: file, imagePreview: previewUrl } : c
    ));
  };

  // ==========================================
  // PUBLISH HANDLER (সব ডাটা একসাথে পোস্ট করার মেথড)
  // ==========================================
  const handlePublish = async () => {
    // ভ্যালিডেশন চেক
    for (const card of cards) {
      if (!card.title.trim()) {
        return alert("দয়া করে মাসকটের টাইটেল বা নাম লিখুন!");
      }
      if (!card.imageFile) {
        return alert("দয়া করে প্রতিটি কার্ডের জন্য একটি ইমেজ আপলোড করুন!");
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("seasonId", seasonId);
      formData.append("categoryId", selectedCategoryId);
      formData.append("language", lang); 

      // ডাটাবেজের রিকোয়ারমেন্ট মেটানোর জন্য পে-লোড স্ট্রাকচারিং
      const cardsData = cards.map(c => ({
        id: c.id,
        year: c.year,
        title: c.title,
        description: c.description
      }));

      formData.append("cardsData", JSON.stringify(cardsData));

      // ইমেজ ফাইলগুলো FormData তে বাইন্ড করা
      cards.forEach((card) => {
        if (card.imageFile) {
          formData.append(`image_${card.id}`, card.imageFile);
        }
      });

      // 🎯 এন্ডপয়েন্ট ফিক্সড: বলের জায়গায় mascot এন্ডপয়েন্ট বসানো হলো
      const res = await fetch("/api/magazine/mascot", {
        method: "POST",
        body: formData, 
      });

      const result = await res.json();

      if (result.success) {
        alert("🎉 সবগুলো মাসকট কার্ডের ডাটা আলাদা আলাদা ভাবে ডাটাবেজে সেভ হয়েছে ভাই!");
        // সফল হলে ফর্ম রিসেট করা
        setCards([
          {
            id: "card-1",
            year: 2026,
            imageFile: null,
            imagePreview: "",
            title: "",
            description: "",
          }
        ]);
      } else {
        alert(`সংরক্ষণ করতে ব্যর্থ হয়েছে। এরর: ${result.error || "Database rejection"}`);
      }
    } catch (err) {
      console.error(err);
      alert("সংরক্ষণ করতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4 sm:p-12 text-neutral-800 antialiased font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* ১. টপ কন্ট্রোল বার */}
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-neutral-200/60 mb-8 sticky top-4 z-30 backdrop-blur-md bg-white/95">
          <div className="flex items-center gap-4">
            
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
                  <option value="MASCOT">🎭 টুর্নামেন্ট মাসকট ২০২৬ (Default)</option>
                )}
              </select>
              <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-neutral-400 text-[10px]">
                ▼
              </div>
            </div>

            {/* বছর বা সাল ডিসপ্লে */}
            <div className="flex items-center gap-1.5 text-sm font-bold text-neutral-700 ml-2">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span>2026</span>
            </div>
          </div>

          {/* পাবলিশ বাটন */}
          <button
            onClick={handlePublish}
            disabled={loading}
            className="bg-[#A3E635] hover:bg-[#92cf2e] text-neutral-950 px-6 py-2 rounded-full font-bold text-xs shadow-sm transition active:scale-95 disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Mascot"}
          </button>
        </div>

        {/* ২. ডাইনামিক কার্ড গ্রিড এরিয়া */}
        <div className="space-y-6">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-neutral-200/80 p-8 shadow-sm relative group flex flex-col md:flex-row gap-8 items-start"
            >
              {/* রিমুভ (ডিলিট) বাটন */}
              {cards.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteCard(card.id)}
                  className="absolute top-5 right-5 text-neutral-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-neutral-50 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="এই কার্ডটি সরান"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* [বামে] বেগুনি ড্যাশড ইমেজ আপলোডার */}
              <div className="w-full md:w-[240px] h-[240px] flex-shrink-0">
                <label className="w-full h-full border-2 border-dashed border-purple-200 bg-purple-50/5 hover:bg-purple-50/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(card.id, e.target.files?.[0] || null)}
                  />
                  {card.imagePreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={card.imagePreview} alt="Mascot Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition text-white text-xs font-semibold">
                        Change Image
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <CloudUpload className="w-10 h-10 text-neutral-300 mx-auto mb-2.5" />
                      <span className="text-xs font-bold text-neutral-400 block">Click to upload mascot image</span>
                    </div>
                  )}
                </label>
              </div>

              {/* [ডানে] ইনপুট সেকশন */}
              <div className="flex-1 w-full space-y-4 pt-2">
                
                {/* টাইটেল ইনপুট */}
                <input
                  type="text"
                  placeholder={lang === "BN" ? "মাসকটের নাম/টাইটেল..." : "Mascot Name/Title..."}
                  className="w-full bg-transparent text-3xl font-bold focus:outline-none placeholder:text-neutral-200 text-neutral-800 tracking-tight"
                  value={card.title}
                  onChange={(e) => handleInputChange(card.id, "title", e.target.value)}
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
                    placeholder={lang === "BN" ? "মাসকট নিয়ে কিছু লিখুন..." : "Tell the story of this mascot..."}
                    rows={4}
                    className="w-full bg-transparent text-base leading-relaxed focus:outline-none resize-none placeholder:text-neutral-300 text-neutral-600 pt-0.5"
                    value={card.description}
                    onChange={(e) => handleInputChange(card.id, "description", e.target.value)}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* ➕ নিচের গোল প্লাস বাটন (কার্ড বাড়াতে) */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={addNewCard}
            className="w-10 h-10 bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md text-neutral-400 hover:text-neutral-700 transition active:scale-95"
            title="নিচে আরেকটি কার্ড যোগ করুন"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}