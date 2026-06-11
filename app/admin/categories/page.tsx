

// "use client";

// import { useState } from "react";
// import slugify from "slugify";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";

// import {
//     Globe,
//     ImageIcon,
//     Languages,
//     Loader2,
//     Tag,
//     Sparkles,
//     FileText,
// } from "lucide-react";

// type FormData = {
//     image?: string;

//     // Bengali
//     bnName: string;
//     bnShortName?: string;
//     bnSlug: string;
//     bnDescription?: string;

//     // English
//     enName: string;
//     enShortName?: string;
//     enSlug: string;
//     enDescription?: string;
// };

// export default function CategoriesPage() {

//     const [loading, setLoading] = useState(false);

//     const {
//         register,
//         handleSubmit,
//         setValue,
//         watch,
//         reset,
//         formState: { errors },
//     } = useForm<FormData>();


//     // Live Preview
//     const bnName = watch("bnName");
//     const bnSlug = watch("bnSlug");

//     const enName = watch("enName");
//     const enSlug = watch("enSlug");

//     const bnShortName = watch("bnShortName");
//     const enShortName = watch("enShortName");

//     const image = watch("image");


//     // Bengali slug generate
//     const handleBnNameChange = (value: string) => {

//         const generatedSlug = slugify(value, {
//             lower: true,
//             strict: true,
//             trim: true,
//         });

//         setValue("bnSlug", generatedSlug);
//     };


//     // English slug generate
//     const handleEnNameChange = (value: string) => {

//         const generatedSlug = slugify(value, {
//             lower: true,
//             strict: true,
//             trim: true,
//         });

//         setValue("enSlug", generatedSlug);
//     };


//     // Submit
//     const onSubmit = async (data: FormData) => {

//         try {

//             setLoading(true);

//             const payload = {
//                 image: data.image,

//                 translations: [
//                     {
//                         language: "BN",
//                         name: data.bnName,
//                         shortName: data.bnShortName,
//                         slug: data.bnSlug,
//                         description: data.bnDescription,
//                     },

//                     {
//                         language: "EN",
//                         name: data.enName,
//                         shortName: data.enShortName,
//                         slug: data.enSlug,
//                         description: data.enDescription,
//                     },
//                 ],
//             };

//             const res = await fetch("/api/categories", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(payload),
//             });

//             const result = await res.json();

//             if (!res.ok) {
//                 throw new Error(result.message || "Something went wrong");
//             }

//             toast.success("Category created successfully");

//             reset();

//         } catch (error: any) {

//             toast.error(error.message);

//         } finally {

//             setLoading(false);

//         }
//     };


//     return (
//         <div className="min-h-screen bg-[#f6f7fb]">

//             <div className="max-w-7xl mx-auto px-4 py-10">

//                 {/* Header */}
//                 <div className="mb-10">

//                     <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm">

//                         <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
//                             <Sparkles className="w-4 h-4" />
//                         </div>

//                         <span className="text-sm font-semibold text-gray-800">
//                             Multilingual Category Manager
//                         </span>

//                     </div>

//                     <div className="mt-6">

//                         <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
//                             Create Category
//                         </h1>

//                         <p className="mt-4 max-w-3xl text-gray-500 leading-8 text-base">
//                             Create bilingual categories with Bengali and English translations,
//                             SEO-friendly slugs, descriptions, and media support for your
//                             sports news or football portal.
//                         </p>

//                     </div>

//                 </div>


//                 <form
//                     onSubmit={handleSubmit(onSubmit)}
//                     className="grid grid-cols-1 xl:grid-cols-3 gap-8"
//                 >

//                     {/* LEFT SIDE */}
//                     <div className="xl:col-span-2 space-y-8">

//                         {/* Bengali */}
//                         <div className="overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-sm">

//                             <div className="border-b border-gray-100 bg-gradient-to-r from-black to-gray-800 px-7 py-6 text-white">

//                                 <div className="flex items-center gap-4">

//                                     <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
//                                         <Globe className="w-6 h-6" />
//                                     </div>

//                                     <div>

//                                         <h2 className="text-2xl font-bold">
//                                             Bengali Information
//                                         </h2>

//                                         <p className="text-sm text-gray-300 mt-1">
//                                             বাংলা ক্যাটাগরির তথ্য যোগ করুন
//                                         </p>

//                                     </div>

//                                 </div>

//                             </div>


//                             <div className="p-7 space-y-6">

//                                 {/* Bengali Name */}
//                                 <div>

//                                     <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                         Bengali Name
//                                     </label>

//                                     <input
//                                         type="text"
//                                         placeholder="ফুটবল"
//                                         {...register("bnName", {
//                                             required: "Bengali name is required",
//                                             onChange: (e) =>
//                                                 handleBnNameChange(e.target.value),
//                                         })}
//                                         className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
//                                     />

//                                     {errors.bnName && (
//                                         <p className="mt-2 text-sm text-red-500">
//                                             {errors.bnName.message}
//                                         </p>
//                                     )}

//                                 </div>

//                                 {/* Bengali Short Name */}

//                                 <div>

//                                     <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                         Bengali Short Name
//                                     </label>

//                                     <input
//                                         type="text"
//                                         placeholder="ইউসিএল"
//                                         {...register("bnShortName")}
//                                         className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
//                                     />

//                                 </div>


//                                 {/* Bengali Slug */}
//                                 <div>

//                                     <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                         Bengali Slug
//                                     </label>

//                                     <div className="relative">

//                                         <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

//                                         <input
//                                             type="text"
//                                             placeholder="football-bn"
//                                             {...register("bnSlug", {
//                                                 required: "Bengali slug is required",
//                                             })}
//                                             className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-5 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
//                                         />

//                                     </div>

//                                     {errors.bnSlug && (
//                                         <p className="mt-2 text-sm text-red-500">
//                                             {errors.bnSlug.message}
//                                         </p>
//                                     )}

//                                 </div>


//                                 {/* Bengali Description */}
//                                 <div>

//                                     <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                         Bengali Description
//                                     </label>

//                                     <textarea
//                                         rows={5}
//                                         placeholder="বাংলা ক্যাটাগরির বিস্তারিত লিখুন..."
//                                         {...register("bnDescription")}
//                                         className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
//                                     />

//                                 </div>

//                             </div>

//                         </div>


//                         {/* English */}
//                         <div className="overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-sm">

//                             <div className="border-b border-blue-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-6 text-white">

//                                 <div className="flex items-center gap-4">

//                                     <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
//                                         <Languages className="w-6 h-6" />
//                                     </div>

//                                     <div>

//                                         <h2 className="text-2xl font-bold">
//                                             English Information
//                                         </h2>

//                                         <p className="text-sm text-blue-100 mt-1">
//                                             Add English translation details
//                                         </p>

//                                     </div>

//                                 </div>

//                             </div>


//                             <div className="p-7 space-y-6">

//                                 {/* English Name */}
//                                 <div>

//                                     <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                         English Name
//                                     </label>

//                                     <input
//                                         type="text"
//                                         placeholder="Football"
//                                         {...register("enName", {
//                                             required: "English name is required",
//                                             onChange: (e) =>
//                                                 handleEnNameChange(e.target.value),
//                                         })}
//                                         className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5"
//                                     />

//                                     {errors.enName && (
//                                         <p className="mt-2 text-sm text-red-500">
//                                             {errors.enName.message}
//                                         </p>
//                                     )}

//                                 </div>


//                                 {/* English Short Name */}
//                                 <div>

//                                     <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                         English Short Name
//                                     </label>

//                                     <input
//                                         type="text"
//                                         placeholder="UCL"
//                                         {...register("enShortName")}
//                                         className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5"
//                                     />

//                                 </div>


//                                 {/* English Slug */}
//                                 <div>

//                                     <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                         English Slug
//                                     </label>

//                                     <div className="relative">

//                                         <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

//                                         <input
//                                             type="text"
//                                             placeholder="football"
//                                             {...register("enSlug", {
//                                                 required: "English slug is required",
//                                             })}
//                                             className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-5 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5"
//                                         />

//                                     </div>

//                                     {errors.enSlug && (
//                                         <p className="mt-2 text-sm text-red-500">
//                                             {errors.enSlug.message}
//                                         </p>
//                                     )}

//                                 </div>


//                                 {/* English Description */}
//                                 <div>

//                                     <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                         English Description
//                                     </label>

//                                     <textarea
//                                         rows={5}
//                                         placeholder="Write category description..."
//                                         {...register("enDescription")}
//                                         className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5"
//                                     />

//                                 </div>

//                             </div>

//                         </div>


//                         {/* Media */}
//                         <div className="overflow-hidden rounded-[30px] border border-purple-100 bg-white shadow-sm">

//                             <div className="border-b border-purple-100 bg-gradient-to-r from-purple-600 to-fuchsia-600 px-7 py-6 text-white">

//                                 <div className="flex items-center gap-4">

//                                     <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
//                                         <ImageIcon className="w-6 h-6" />
//                                     </div>

//                                     <div>

//                                         <h2 className="text-2xl font-bold">
//                                             Media & Thumbnail
//                                         </h2>

//                                         <p className="text-sm text-purple-100 mt-1">
//                                             Add category thumbnail image
//                                         </p>

//                                     </div>

//                                 </div>

//                             </div>


//                             <div className="p-7">

//                                 <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                     Image URL
//                                 </label>

//                                 <input
//                                     type="text"
//                                     placeholder="https://example.com/image.jpg"
//                                     {...register("image")}
//                                     className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-600/5"
//                                 />

//                             </div>

//                         </div>

//                     </div>


//                     {/* RIGHT SIDE */}
//                     <div className="space-y-8">

//                         {/* Preview Card */}
//                         <div className="sticky top-8 overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-sm">

//                             <div className="border-b border-gray-100 px-6 py-5 flex items-center gap-3">

//                                 <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center">
//                                     <FileText className="w-5 h-5" />
//                                 </div>

//                                 <div>

//                                     <h3 className="font-bold text-lg text-gray-900">
//                                         Live Preview
//                                     </h3>

//                                     <p className="text-sm text-gray-500">
//                                         Category preview while typing
//                                     </p>

//                                 </div>

//                             </div>


//                             <div className="p-6">

//                                 {/* Image Preview */}
//                                 <div className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 aspect-[16/10] mb-6">

//                                     {image ? (
//                                         <img
//                                             src={image}
//                                             alt="Preview"
//                                             className="w-full h-full object-cover"
//                                         />
//                                     ) : (
//                                         <div className="w-full h-full flex items-center justify-center text-gray-400">

//                                             <div className="text-center">

//                                                 <ImageIcon className="w-10 h-10 mx-auto mb-3" />

//                                                 <p className="text-sm">
//                                                     Image preview
//                                                 </p>

//                                             </div>

//                                         </div>
//                                     )}

//                                 </div>


//                                 {/* Bengali Preview */}
//                                 <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">

//                                     <div className="flex items-center justify-between mb-4">

//                                         <h4 className="font-bold text-gray-900">
//                                             Bengali
//                                         </h4>

//                                         <span className="rounded-full bg-black text-white px-3 py-1 text-xs font-semibold">
//                                             BN
//                                         </span>

//                                     </div>

//                                     <h3 className="text-2xl font-black text-gray-900">
//                                         {bnName || "ফুটবল"}
//                                     </h3>

//                                     <p className="mt-2 text-sm font-semibold text-gray-700">
//                                         {bnShortName || "ইউসিএল"}
//                                     </p>

//                                     <p className="mt-2 text-sm text-gray-500">
//                                         /{bnSlug || "football-bn"}
//                                     </p>

//                                 </div>


//                                 {/* English Preview */}
//                                 <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

//                                     <div className="flex items-center justify-between mb-4">

//                                         <h4 className="font-bold text-gray-900">
//                                             English
//                                         </h4>

//                                         <span className="rounded-full bg-blue-600 text-white px-3 py-1 text-xs font-semibold">
//                                             EN
//                                         </span>

//                                     </div>

//                                     <h3 className="text-2xl font-black text-gray-900">
//                                         {enName || "Football"}
//                                     </h3>

//                                     <p className="mt-2 text-sm font-semibold text-gray-700">
//                                         {enShortName || "UCL"}
//                                     </p>

//                                     <p className="mt-2 text-sm text-gray-500">
//                                         /{enSlug || "football"}
//                                     </p>

//                                 </div>


//                                 {/* Submit */}
//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
//                                 >

//                                     {loading ? (
//                                         <>
//                                             <Loader2 className="w-4 h-4 animate-spin" />
//                                             Creating Category...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Sparkles className="w-4 h-4" />
//                                             Create Category
//                                         </>
//                                     )}

//                                 </button>

//                             </div>

//                         </div>

//                     </div>

//                 </form>

//             </div>

//         </div>
//     );
// }

"use client";

import { useState, useCallback } from "react";
import slugify from "slugify";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Globe,
    ImageIcon,
    Languages,
    Loader2,
    Tag,
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

export default function CategoriesPage() {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData>();

    const bnName = watch("bnName");
    const bnSlug = watch("bnSlug");
    const enName = watch("enName");
    const enSlug = watch("enSlug");
    const bnShortName = watch("bnShortName");
    const enShortName = watch("enShortName");
    const image = watch("image");

    // Image Upload Handler
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
                toast.success("Image uploaded successfully!");
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

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            const payload = {
                image: data.image,
                translations: [
                    {
                        language: "BN",
                        name: data.bnName,
                        shortName: data.bnShortName,
                        slug: data.bnSlug,
                        description: data.bnDescription,
                    },
                    {
                        language: "EN",
                        name: data.enName,
                        shortName: data.enShortName,
                        slug: data.enSlug,
                        description: data.enDescription,
                    },
                ],
            };

            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Something went wrong");

            toast.success("Category created successfully");
            reset();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f6f7fb] pb-20">
            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm">
                        <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">Multilingual Category Manager</span>
                    </div>
                    <h1 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-gray-900">Create Category</h1>
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
                                    <p className="text-xs text-gray-300">বাংলা ক্যাটাগরির তথ্য যোগ করুন</p>
                                </div>
                            </div>
                            <div className="p-7 space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Bengali Name</label>
                                    <input
                                        type="text"
                                        placeholder="ফুটবল"
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
                                    <p className="text-xs text-blue-100">Add English translation details</p>
                                </div>
                            </div>
                            <div className="p-7 space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">English Name</label>
                                    <input
                                        type="text"
                                        placeholder="Football"
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
                                                <p className="text-xs text-gray-500 font-medium">Click to upload image</p>
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
                                    {loading ? "Saving..." : "Create Category"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}