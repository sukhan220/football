"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import slugify from "slugify";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Globe,
    Languages,
    Loader2,
    Sparkles,
    FileText,
    UploadCloud,
    X,
} from "lucide-react";

type FormData = {
    image?: string;
    bnName: string;
    bnShortName?: string;
    bnSlug: string;
    bnDescription?: string;
    enName: string;
    enShortName?: string;
    enSlug: string;
    enDescription?: string;
};

export default function EditCategoryPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // ইউআরএল স্ট্রাকচার অনুসারে ID নেওয়ার ব্যাকআপ মেকানিজম
    const categoryId = params?.id || searchParams?.get("id");

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploading, setUploading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const bnName = watch("bnName");
    const bnSlug = watch("bnSlug");
    const enName = watch("enName");
    const enSlug = watch("enSlug");
    const image = watch("image");

    // ১. এক্সিসটিং ক্যাটাগরি ডেটা লোড করা
    useEffect(() => {
        if (!categoryId) return;

        const loadCategoryData = async () => {
            try {
                setFetching(true);
                const res = await fetch("/api/categories");
                if (!res.ok) throw new Error("Failed to load categories");
                
                const categories = await res.json();
                const currentCategory = categories.find((cat: any) => cat.id === categoryId);

                if (currentCategory) {
                    setValue("image", currentCategory.image || "");
                    
                    // বাংলা ট্রান্সলেশন ডেটা ম্যাপিং
                    const bnData = currentCategory.translations.find((t: any) => t.language === "BN");
                    if (bnData) {
                        setValue("bnName", bnData.name);
                        setValue("bnShortName", bnData.shortName || "");
                        setValue("bnSlug", bnData.slug);
                        setValue("bnDescription", bnData.description || "");
                    }

                    // ইংরেজি ট্রান্সলেশন ডেটা ম্যাপিং
                    const enData = currentCategory.translations.find((t: any) => t.language === "EN");
                    if (enData) {
                        setValue("enName", enData.name);
                        setValue("enShortName", enData.shortName || "");
                        setValue("enSlug", enData.slug);
                        setValue("enDescription", enData.description || "");
                    }
                } else {
                    toast.error("Category not found!");
                }
            } catch (error) {
                console.error("Error loading category:", error);
                toast.error("Error loading category data");
            } finally {
                setFetching(false);
            }
        };

        loadCategoryData();
    }, [categoryId, setValue]);

    // ইমেজ আপলোড হ্যান্ডলার (সার্ভার/ক্লাউডিনারি)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setValue("image", data.file.url);
                toast.success("New image uploaded successfully!");
            } else {
                toast.error(data.message || "Upload failed");
            }
        } catch (error) {
            toast.error("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const handleBnNameChange = (value: string) => {
        const generatedSlug = slugify(value, { lower: true, strict: true, trim: true });
        setValue("bnSlug", generatedSlug);
    };

    const handleEnNameChange = (value: string) => {
        const generatedSlug = slugify(value, { lower: true, strict: true, trim: true });
        setValue("enSlug", generatedSlug);
    };

    // ২. ডেটা আপডেট (PUT) সাবমিশন লজিক
    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            const payload = {
                image: data.image,
                translations: [
                    {
                        language: "BN",
                        name: data.bnName,
                        shortName: data.bnShortName || null,
                        slug: data.bnSlug,
                        description: data.bnDescription || null,
                    },
                    {
                        language: "EN",
                        name: data.enName,
                        shortName: data.enShortName || null,
                        slug: data.enSlug,
                        description: data.enDescription || null,
                    },
                ],
            };

            const res = await fetch(`/api/categories?id=${categoryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Something went wrong");

            toast.success("Category updated successfully");
            router.push("/admin/categories"); // আপডেট শেষে লিস্ট পেজে রিডাইরেক্ট
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-[#f6f7fb] flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <p className="text-sm font-semibold text-gray-500">পুরনো ডেটা লোড হচ্ছে...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6f7fb] pb-20">
            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm">
                        <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">Multilingual Category Editor</span>
                    </div>
                    <h1 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-gray-900">Edit Category</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* LEFT SIDE */}
                    <div className="xl:col-span-2 space-y-8">
                        
                        {/* Bengali Section */}
                        <section className="overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-sm">
                            <div className="border-b border-gray-100 bg-gradient-to-r from-black to-gray-800 px-7 py-6 text-white flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Bengali Information</h2>
                                    <p className="text-xs text-gray-300">বাংলা ক্যাটাগরির তথ্য পরিবর্তন করুন</p>
                                </div>
                            </div>
                            <div className="p-7 space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Bengali Name</label>
                                    <input
                                        type="text"
                                        {...register("bnName", { required: "Bengali name is required", onChange: (e) => handleBnNameChange(e.target.value) })}
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none focus:border-black focus:bg-white transition-all"
                                    />
                                    {errors.bnName && <p className="mt-1 text-xs text-red-500">{errors.bnName.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">Short Name</label>
                                        <input type="text" {...register("bnShortName")} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none focus:border-black focus:bg-white transition-all" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">Slug</label>
                                        <input type="text" {...register("bnSlug", { required: true })} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none focus:border-black focus:bg-white transition-all" />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Description</label>
                                    <textarea rows={3} {...register("bnDescription")} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none focus:border-black focus:bg-white transition-all" />
                                </div>
                            </div>
                        </section>

                        {/* English Section */}
                        <section className="overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-sm">
                            <div className="border-b border-blue-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-6 text-white flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
                                    <Languages className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">English Information</h2>
                                    <p className="text-xs text-blue-100">Update English translation details</p>
                                </div>
                            </div>
                            <div className="p-7 space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">English Name</label>
                                    <input
                                        type="text"
                                        {...register("enName", { required: "English name is required", onChange: (e) => handleEnNameChange(e.target.value) })}
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all"
                                    />
                                    {errors.enName && <p className="mt-1 text-xs text-red-500">{errors.enName.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">Short Name</label>
                                        <input type="text" {...register("enShortName")} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">Slug</label>
                                        <input type="text" {...register("enSlug", { required: true })} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all" />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Description</label>
                                    <textarea rows={3} {...register("enDescription")} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all" />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT SIDE - Image & Preview */}
                    <div className="space-y-8">
                        {/* Image Upload Section */}
                        <div className="overflow-hidden rounded-[30px] border border-purple-100 bg-white shadow-sm p-6">
                            <label className="mb-4 block text-sm font-bold text-gray-800">Category Thumbnail</label>
                            
                            <div className="relative aspect-square rounded-[20px] border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-purple-400 group">
                                {image ? (
                                    <>
                                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                        <button 
                                            type="button" 
                                            onClick={() => setValue("image", "")}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        {uploading ? (
                                            <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto" />
                                        ) : (
                                            <>
                                                <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                                <p className="text-xs text-gray-500 font-medium">Click to change/upload image</p>
                                            </>
                                        )}
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageUpload} 
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            disabled={uploading}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Live Preview UI */}
                        <div className="sticky top-8 overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-lg">
                            <div className="bg-black p-5 text-white flex items-center gap-3">
                                <FileText className="w-5 h-5" />
                                <h3 className="font-bold">Live Preview</h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Bengali Version</span>
                                    <h4 className="text-xl font-black text-gray-900 mt-1">{bnName || "শিরোনাম..."}</h4>
                                    <p className="text-xs text-gray-500">slug: /{bnSlug}</p>
                                </div>
                                <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">English Version</span>
                                    <h4 className="text-xl font-black text-gray-900 mt-1">{enName || "Title..."}</h4>
                                    <p className="text-xs text-gray-500">slug: /{enSlug}</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-yellow-400" />}
                                    {loading ? "Updating..." : "Update Category"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}