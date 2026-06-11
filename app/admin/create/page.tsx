
// app/admin/create/page.tsx


"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import slugify from "slugify"; 
import { ChevronDown, Loader2, Image as ImageIcon, X, FileText, Eye, Type } from "lucide-react";

type Category = {
  id: string;
  translations: {
    language: "BN" | "EN";
    name: string;
  }[];
};

export default function CreatePage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState(""); 
  
  // ল্যাঙ্গুয়েজ স্টেট (ডিফল্ট 'BN')
  const [language, setLanguage] = useState<"EN" | "BN">("BN"); 
  
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");

  // কভার ফটো ও ক্যাপশন স্টেট
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverCaption, setCoverCaption] = useState(""); 

  // এডিটর এবং অবজেক্ট ফাইল ম্যাপিং রেফ
  const ejInstance = useRef<any>(null);
  const [editorData, setEditorData] = useState<any>(null);
  const fileMapRef = useRef<Map<string, File>>(new Map());

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  // ল্যাঙ্গুয়েজ সুইচ করলে ক্যাটাগরি সিলেকশন রিসেট হবে এবং স্লাগ রি-জেনারেট হবে
  useEffect(() => {
    setCategoryId("");
    if (title) {
      handleTitleChange(title, language);
    }
  }, [language]);

  // Editor.js ইনিশিয়ালাইজেশন
  useEffect(() => {
    if (typeof window !== "undefined" && !ejInstance.current) {
      initEditor();
    }
    return () => {
      if (ejInstance.current) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, []);

  const initEditor = async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Paragraph = (await import("@editorjs/paragraph")).default;
    const ImageTool = (await import("@editorjs/image")).default;
    const Embed = (await import("@editorjs/embed")).default; 

    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "মিডিয়ামের মতো খবরের বডি লিখুন, ইমেজ পেস্ট করুন কিংবা ভিডিও লিংক শেয়ার করুন...",
      tools: {
        paragraph: { class: Paragraph, inlineToolbar: true },
        header: { class: Header, inlineToolbar: true },
        image: {
          class: ImageTool,
          config: {
            captionPlaceholder: "",
            uploader: {
              uploadByFile(file: File) {
                return new Promise((resolve) => {
                  const localUrl = URL.createObjectURL(file);
                  fileMapRef.current.set(localUrl, file);
                  
                  resolve({
                    success: 1,
                    file: {
                      url: localUrl,
                    },
                  });
                });
              },
            },
          },
        },
        // 🎥 ভিডিও লিঙ্ক রেন্ডার এবং প্লাস (+) মেনু বাধ্যতামুলক করার আপডেট কনফিগারেশন
        embed: {
          class: Embed as any,
          inlineToolbar: true,
          toolbox: {
            title: 'Embed Video'
          },
          config: {
            services: {
              youtube: true,
              vimeo: true,
              facebook: true,
              instagram: true
            }
          }
        }
      },
      onChange: async () => {
        const content = await editor.save();
        setEditorData(content);
      },
    });

    ejInstance.current = editor;
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.file.url; 
  };

  const generateRandomId = (length = 10) => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // টাইটেল ও ল্যাঙ্গুয়েজ এর উপর বেস করে স্লাগ হ্যান্ডলিং
  const handleTitleChange = (value: string, currentLang = language) => {
    setTitle(value);
    if (!value.trim()) {
      setSlug("");
      return;
    }

    let baseSlug = slugify(value, {
      lower: true,
      strict: false, 
      trim: true,
      locale: currentLang === "BN" ? "bg" : "en" 
    });

    baseSlug = baseSlug
      .replace(/[\s\-_]+/g, "-")
      .replace(/[^\w\u0980-\u09FF\-]+/g, "") 
      .replace(/^-+|-+$/g, ""); 

    const currentId = slug.split("-").pop();
    const isAlreadyId = currentId && currentId.length === 10 && /^[a-z0-9]+$/.test(currentId);
    
    const uniqueId = isAlreadyId ? currentId : generateRandomId(10);
    setSlug(`${baseSlug}-${uniqueId}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return alert("Please login");
    const role = (session.user as any).role;
    const allowedRoles = ["ADMIN", "EDITOR", "WRITER"];
    if (!allowedRoles.includes(role)) return alert("You do not have permission");

    if (!title || !slug || !categoryId) {
      return alert("Please fill Title, Slug, and Category!");
    }

    if (actionType === "PUBLISHED" && (!editorData || editorData.blocks.length === 0)) {
      return alert("খবরের বডি বা কনটেন্ট ফাঁকা রাখা যাবে না।");
    }

    try {
      setLoading(true);
      let finalCoverUrl = coverPreview || "";
      if (coverFile) {
        finalCoverUrl = await handleImageUpload(coverFile);
      }

      let processedBlocks = [];
      if (editorData?.blocks) {
        processedBlocks = await Promise.all(
          editorData.blocks.map(async (block: any) => {
            if (block.type === "image") {
              const currentUrl = block.data.file.url;
              if (fileMapRef.current.has(currentUrl)) {
                const actualFile = fileMapRef.current.get(currentUrl)!;
                const remoteUrl = await handleImageUpload(actualFile);
                return {
                  ...block,
                  data: { ...block.data, file: { url: remoteUrl } },
                };
              }
            }
            return block;
          })
        );
      }

      const finalPayload = {
        title,
        slug,
        excerpt: excerpt || title.substring(0, 120) + "...", 
        coverImage: finalCoverUrl,
        coverCaption, 
        content: editorData ? JSON.stringify({ ...editorData, blocks: processedBlocks }) : JSON.stringify({ blocks: [] }), 
        language,
        categoryId,
        status: actionType,
      };

      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `${actionType} failed`);

      alert(actionType === "DRAFT" ? "Draft saved successfully!" : "Article published successfully!");
      
      if (actionType === "PUBLISHED") {
        setTitle("");
        setSlug("");
        setExcerpt("");
        setCoverFile(null);
        setCoverPreview(null);
        setCoverCaption("");
        fileMapRef.current.clear();
        if (ejInstance.current) ejInstance.current.clear();
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // সিলেক্টেড ল্যাঙ্গুয়েজ অনুযায়ী ফিল্টারিং
  const filteredCategories = categories.filter((category) =>
    category.translations.some((t) => t.language === language)
  );

  return (
    <div className="min-h-screen bg-transparent text-zinc-900 antialiased selection:bg-zinc-200">
      <div className="mx-auto max-w-5xl">
        <main className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-sm min-w-0">
          <form id="article-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* 🖼️ ১. স্লিম কভার ব্যান্তর */}
            <div className="w-full bg-gray-50/50 border-b border-gray-100 relative group">
              {coverPreview ? (
                <div className="w-full">
                  <div className="relative aspect-[32/9] w-full overflow-hidden bg-gray-900">
                    <img src={coverPreview} className="w-full h-full object-cover opacity-95" alt="Cover Preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverFile(null);
                        URL.revokeObjectURL(coverPreview);
                        setCoverPreview(null);
                        setCoverCaption("");
                      }}
                      className="absolute top-3 right-3 p-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full transition duration-200 hover:bg-black shadow-md"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 px-6 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
                    <Type size={14} className="text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={coverCaption}
                      onChange={(e) => setCoverCaption(e.target.value)}
                      placeholder="ব্যানারের জন্য একটি ছোট ক্যাপশন বা ইমেজ ক্রেডিট লিখুন..."
                      className="w-full bg-transparent border-0 outline-none placeholder:text-gray-400 font-medium italic"
                    />
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-[32/9] border-b border-dashed border-gray-200 cursor-pointer hover:bg-gray-100/30 transition duration-200 group">
                  <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600 transition">
                    <ImageIcon size={18} />
                    <span className="text-xs font-semibold">Add Slim Cover Banner</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCoverFile(file);
                        setCoverPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* কন্টেন্ট বডি এরিয়া */}
            <div className="px-6 sm:px-10 lg:px-12 pb-12 space-y-6">
              
              {/* 🛠️ ২. কন্ট্রোল বার */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  
                  {/* 🌐 EN/BN ল্যাঙ্গুয়েজ সুইচার */}
                  <div className="inline-flex rounded-lg bg-gray-100 p-1 border border-gray-200/60">
                    <button
                      type="button"
                      onClick={() => setLanguage("EN")}
                      className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                        language === "EN"
                          ? "bg-white text-zinc-900 shadow-sm"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage("BN")}
                      className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                        language === "BN"
                          ? "bg-white text-zinc-900 shadow-sm"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      BN
                    </button>
                  </div>

                  {/* ক্যাটাগরি সিলেক্টর */}
                  <div className="relative inline-flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition">
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="appearance-none bg-transparent pr-6 text-xs font-bold uppercase tracking-wider text-gray-600 outline-none cursor-pointer"
                    >
                      <option value="">
                        {language === "BN" ? "ক্যাটাগরি নির্বাচন করুন" : "Select Category"}
                      </option>
                      {filteredCategories.map((category) => {
                        const translation = category.translations.find((t) => t.language === language);
                        return (
                          <option key={category.id} value={category.id}>
                            {translation?.name}
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-gray-400" />
                  </div>

                  {/* লাইভ স্লাগ প্রিভিউ */}
                  {slug && (
                    <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100 max-w-xs truncate">
                      <Eye size={12} className="flex-shrink-0" />
                      <span className="truncate">/news/{slug}</span>
                    </div>
                  )}
                </div>

                {/* ৩. অ্যাকশন বাটনসমূহ */}
                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  <button
                    type="submit"
                    onClick={() => setActionType("DRAFT")}
                    disabled={loading}
                    className="rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:shadow-sm transition disabled:opacity-50"
                  >
                    {loading && actionType === "DRAFT" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      "Save Draft"
                    )}
                  </button>

                  <button
                    type="submit"
                    onClick={() => setActionType("PUBLISHED")}
                    disabled={loading}
                    className="rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 hover:shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {loading && actionType === "PUBLISHED" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      "Publish"
                    )}
                  </button>
                </div>
              </div>

              {/* ৪. টাইটেল টেক্সট এরিয়া */}
              <textarea
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder={language === "BN" ? "আর্টিকেলের টাইটেল..." : "Article Title..."}
                rows={1}
                className="w-full resize-none overflow-hidden border-0 bg-transparent text-3xl sm:text-4xl font-black leading-snug tracking-tight text-gray-900 outline-none placeholder:text-gray-200 font-serif"
              />

              {/* ৫. এক্সসার্প্ট / সাব-হেডিং */}
              <div className="flex gap-3 items-start bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder={language === "BN" ? "সংक्षिप्त বিবরণ বা উপ-শিরোনাম লিখুন..." : "Write a short excerpt or sub-headline..."}
                  rows={2}
                  className="w-full resize-none border-0 bg-transparent text-sm font-medium text-gray-600 outline-none placeholder:text-gray-400/80 leading-relaxed"
                />
              </div>

              <div className="border-t border-gray-100 my-4" />

              {/* ৬. Editor.js কন্টেইনার */}
              <div 
                id="editorjs" 
                className="prose prose-zinc sm:prose-lg max-w-none min-h-[500px] outline-none font-serif text-gray-800 leading-relaxed" 
              />
            </div>

          </form>
        </main>
      </div>
    </div>
  );
}
