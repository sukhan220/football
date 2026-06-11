

// // app/page.tsx
// import { prisma } from "@/lib/prisma";
// import Image from "next/image";
// import Link from "next/link";
// import { Calendar, ArrowUpRight, Newspaper, Clock } from "lucide-react";

// export default async function Home() {
//   // ১. মেইন Article টেবিল থেকে ডেটা ফেচ করছি এবং সাথে translations রিলেশন include করছি
//   const articlesData = await prisma.article.findMany({
//     where: {
//       status: "PUBLISHED", // শুধুমাত্র পাবলিশড নিউজগুলো দেখাবো
//     },
//     orderBy: {
//       createdAt: "desc", // লেটেস্ট নিউজ আগে আসবে
//     },
//     include: {
//       translations: {
//         where: {
//           language: "BN", // 👈 উদাহরণস্বরূপ: হোমপেজে শুধু বাংলা নিউজ ফিল্টার করছি (চাইলে 'EN' দিতে পারেন)
//         },
//       },
//     },
//   });

//   // ২. ডেটাকে রেন্ডার উপযোগী ফ্ল্যাট স্ট্রাকচারে রূপান্তর (সহজে ব্যবহারের জন্য)
//   // যদি কোনো আর্টিকেলের বাংলা অনুবাদ না থাকে, তবে সেটি লিস্টে আসবে না
//   const articles = articlesData
//     .filter((art) => art.translations.length > 0)
//     .map((art) => {
//       const translation = art.translations[0]; // যেহেতু unique constraint আছে, একটাই আসবে
//       return {
//         id: art.id,
//         coverImage: art.coverImage,
//         createdAt: art.createdAt,
//         title: translation.title,
//         slug: translation.slug,
//         excerpt: translation.excerpt,
//         language: translation.language,
//       };
//     });

//   // প্রথম নিউজটিকে বড় হাইলাইট বা ফিচার্ড কার্ড হিসেবে আলাদা করা
//   const featuredArticle = articles[0];
//   const gridArticles = articles.slice(1);

//   return (
//     <div className="min-h-screen bg-[#070b08] text-gray-100 font-sans selection:bg-emerald-500 selection:text-black">
      
//       {/* মেইন কন্টেইনার */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
//         {/* সেকশন হেডার */}
//         <div className="flex items-center justify-between mb-10 border-b border-emerald-950/40 pb-6">
//           <div className="flex items-center gap-4">
//             <div className="p-2.5 bg-emerald-950/50 border border-emerald-800/30 rounded-2xl shadow-inner">
//               <Newspaper className="w-6 h-6 text-emerald-400" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight text-white">সর্বশেষ সংবাদ</h1>
//               <p className="text-xs text-emerald-500/60 font-medium uppercase tracking-widest mt-1">Live Updates • Football Portal</p>
//             </div>
//           </div>
//           <div className="hidden sm:block">
//             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950/20 border border-emerald-900/20 rounded-full">
//               <span className="relative flex h-2 w-2">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
//               </span>
//               <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Live Database Sync</span>
//             </div>
//           </div>
//         </div>

//         {articles.length === 0 ? (
//           <div className="text-center py-24 border border-dashed border-emerald-900/30 rounded-[2rem] bg-[#0b130e]/30">
//             <div className="mx-auto w-16 h-16 bg-emerald-950/30 rounded-full flex items-center justify-center mb-4">
//                <Clock className="text-emerald-800 w-8 h-8" />
//             </div>
//             <p className="text-gray-500 font-medium text-lg">বর্তমানে কোনো ব্রেকিং নিউজ পাওয়া যায়নি।</p>
//             <p className="text-gray-600 text-sm mt-1">অনুগ্রহ করে পরে আবার চেষ্টা করুন।</p>
//           </div>
//         ) : (
//           <div className="space-y-12">
            
//             {/* ১. ফিচার্ড নিউজ (Featured Hero Card) */}
//             {featuredArticle && (
//               <Link href={`/news/${featuredArticle.slug}`} className="group block">
//                 <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 bg-[#0b130e] border border-emerald-950/60 rounded-[2rem] overflow-hidden hover:border-emerald-700/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500">
                  
//                   {/* ডেকোরেティブ লাইটিং */}
//                   <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-emerald-500/15 transition-all" />
                  
//                   {/* ইমেজ সেকশন */}
//                   <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto lg:h-[480px] overflow-hidden">
//                     <Image
//                       src={featuredArticle.coverImage || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200"} 
//                       alt={featuredArticle.title}
//                       fill
//                       priority
//                       className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-[#0b130e] via-transparent to-transparent lg:hidden" />
//                     <span className="absolute top-6 left-6 text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1.5 rounded-lg bg-emerald-500 text-black shadow-lg">
//                       {featuredArticle.language}
//                     </span>
//                   </div>

//                   {/* টেক্সট কন্টেন্ট */}
//                   <div className="lg:col-span-5 flex flex-col justify-center p-8 lg:pr-12">
//                     <div className="space-y-5">
//                       <div className="flex items-center gap-3 text-[11px] text-emerald-500 font-bold uppercase tracking-widest">
//                         <Calendar className="w-4 h-4" />
//                         <span>
//                           {new Date(featuredArticle.createdAt).toLocaleDateString('bn-BD', {
//                             day: 'numeric', month: 'long', year: 'numeric'
//                           })}
//                         </span>
//                       </div>

//                       <h2 className="text-3xl lg:text-4xl font-extrabold text-white group-hover:text-emerald-400 transition-colors duration-300 leading-[1.15]">
//                         {featuredArticle.title}
//                       </h2>

//                       <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-medium">
//                         {featuredArticle.excerpt || "খবরের বিস্তারিত জানতে এখানে ক্লিক করুন। ফুটবলের সর্বশেষ আপডেট এবং ইনসাইড স্টোরি নিয়ে আমাদের এই বিশেষ প্রতিবেদন।"}
//                       </p>

//                       <div className="pt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white group-hover:gap-4 transition-all">
//                         <span>Read Full Story</span>
//                         <ArrowUpRight className="w-5 h-5 text-emerald-500" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             )}

//             {/* ২. নিউজ গ্রিড (Sub Grid Layout) */}
//             {gridArticles.length > 0 && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {gridArticles.map((article) => (
//                   <Link href={`/news/${article.slug}`} key={article.id} className="group">
//                     <div className="flex flex-col h-full bg-[#0b130e]/40 border border-emerald-950/40 rounded-[1.5rem] p-4 hover:bg-[#0e1a13] hover:border-emerald-800/40 hover:shadow-2xl transition-all duration-300">
                      
//                       {/* থাম্বনেইল */}
//                       <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-emerald-950 border border-emerald-900/20 mb-5">
//                         <Image
//                           src={article.coverImage || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600"}
//                           alt={article.title}
//                           fill
//                           className="object-cover group-hover:scale-110 transition-transform duration-500"
//                         />
//                         <div className="absolute top-3 right-3">
//                            <div className="h-6 w-6 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
//                               <ArrowUpRight className="w-3 h-3 text-white" />
//                            </div>
//                         </div>
//                       </div>

//                       {/* মেটা ও টাইটেল */}
//                       <div className="px-1 flex flex-col flex-grow">
//                         <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold uppercase mb-3 tracking-tighter">
//                           <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800/30">{article.language}</span>
//                           <span>•</span>
//                           <span>
//                             {new Date(article.createdAt).toLocaleDateString('bn-BD', {
//                               day: 'numeric', month: 'short'
//                             })}
//                           </span>
//                         </div>

//                         <h3 className="text-lg font-bold text-gray-100 group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2 leading-snug mb-3">
//                           {article.title}
//                         </h3>

//                         <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4 font-medium mt-auto">
//                            {article.excerpt || "খবরের বিস্তারিত পড়তে ক্লিক করুন..."}
//                         </p>
//                       </div>

//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}

//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// app/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowUpRight, Newspaper, Clock } from "lucide-react";

export default async function Home() {
  // ১. মেইন Article টেবিল থেকে ডেটা ফেচ করছি এবং সাথে translations রিলেশন include করছি
  const articlesData = await prisma.article.findMany({
    where: {
      status: "PUBLISHED", // শুধুমাত্র পাবলিশড নিউজগুলো দেখাবো
    },
    orderBy: {
      createdAt: "desc", // লেটেস্ট নিউজ আগে আসবে
    },
    include: {
      translations: {
        where: {
          language: "BN", // হোমপেজে শুধু বাংলা নিউজ ফিল্টার করছি
        },
      },
    },
  });

  // ২. ডেটাকে রেন্ডার উপযোগী ফ্ল্যাট স্ট্রাকচারে রূপান্তর
  const articles = articlesData
    .filter((art) => art.translations.length > 0)
    .map((art) => {
      const translation = art.translations[0];
      return {
        id: art.id,
        coverImage: art.coverImage,
        createdAt: art.createdAt,
        title: translation.title,
        slug: translation.slug,
        excerpt: translation.excerpt,
        language: translation.language,
      };
    });

  // প্রথম নিউজটিকে বড় হাইলাইট বা ফিচার্ড কার্ড হিসেবে আলাদা করা
  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    /* 📌 মেইন কন্টেইনার: ন্যাভবার fixed হওয়ায় pt-16 এবং সাইডবার ফিক্সড থাকায় lg:pl-64 গ্রিড সেটআপ করা হয়েছে */
    <div className="min-h-screen bg-[#070b08] text-gray-100 font-sans selection:bg-emerald-500 selection:text-black pt-16">
      
      {/* 🖥️ স্বাধীন কন্টেন্ট এরিয়া যা ড্যাশবোর্ড সাইডবারের ডানপাশ থেকে নিখুঁতভাবে শুরু হবে */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-72 py-12 transition-all">
        
        {/* সেকশন হেডার */}
        <div className="flex items-center justify-between mb-10 border-b border-emerald-950/40 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-emerald-950/50 border border-emerald-800/30 rounded-2xl shadow-inner">
              <Newspaper className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">সর্বশেষ সংবাদ</h1>
              <p className="text-xs text-emerald-500/60 font-medium uppercase tracking-widest mt-1">Live Updates • Football Portal</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950/20 border border-emerald-900/20 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Live Database Sync</span>
            </div>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-emerald-900/30 rounded-[2rem] bg-[#0b130e]/30">
            <div className="mx-auto w-16 h-16 bg-emerald-950/30 rounded-full flex items-center justify-center mb-4">
               <Clock className="text-emerald-800 w-8 h-8" />
            </div>
            <p className="text-gray-500 font-medium text-lg">বর্তমানে কোনো ব্রেকিং নিউজ পাওয়া যায়নি।</p>
            <p className="text-gray-600 text-sm mt-1">অনুগ্রহ করে পরে আবার চেষ্টা করুন।</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* ১. ফিচার্ড নিউজ (Featured Hero Card) */}
            {featuredArticle && (
              <Link href={`/news/${featuredArticle.slug}`} className="group block">
                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 bg-[#0b130e] border border-emerald-950/60 rounded-[2rem] overflow-hidden hover:border-emerald-700/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500">
                  
                  {/* ডেকোরেティブ লাইটিং */}
                  <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-emerald-500/15 transition-all" />
                  
                  {/* ইমেজ সেকশন */}
                  <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto lg:h-[420px] overflow-hidden">
                    <Image
                      src={featuredArticle.coverImage || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200"} 
                      alt={featuredArticle.title}
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b130e] via-transparent to-transparent lg:hidden" />
                    <span className="absolute top-6 left-6 text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1.5 rounded-lg bg-emerald-500 text-black shadow-lg">
                      {featuredArticle.language}
                    </span>
                  </div>

                  {/* টেক্সট কন্টেন্ট */}
                  <div className="lg:col-span-5 flex flex-col justify-center p-6 lg:p-8 lg:pr-12">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[11px] text-emerald-500 font-bold uppercase tracking-widest">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(featuredArticle.createdAt).toLocaleDateString('bn-BD', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </span>
                      </div>

                      <h2 className="text-2xl lg:text-3xl font-extrabold text-white group-hover:text-emerald-400 transition-colors duration-300 leading-[1.2]">
                        {featuredArticle.title}
                      </h2>

                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 font-medium">
                        {featuredArticle.excerpt || "খবরের বিস্তারিত জানতে এখানে ক্লিক করুন। ফুটবলের সর্বশেষ আপডেট এবং ইনসাইড স্টোরি নিয়ে আমাদের এই বিশেষ প্রতিবেদন।"}
                      </p>

                      <div className="pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white group-hover:gap-4 transition-all">
                        <span>Read Full Story</span>
                        <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* ২. নিউজ গ্রিড (Sub Grid Layout) */}
            {gridArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {gridArticles.map((article) => (
                  <Link href={`/news/${article.slug}`} key={article.id} className="group">
                    <div className="flex flex-col h-full bg-[#0b130e]/40 border border-emerald-950/40 rounded-[1.5rem] p-4 hover:bg-[#0e1a13] hover:border-emerald-800/40 hover:shadow-2xl transition-all duration-300">
                      
                      {/* থাম্বনেইল */}
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-emerald-950 border border-emerald-900/20 mb-4">
                        <Image
                          src={article.coverImage || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600"}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                           <div className="h-6 w-6 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                              <ArrowUpRight className="w-3 h-3 text-white" />
                           </div>
                        </div>
                      </div>

                      {/* মেটা ও টাইটেল */}
                      <div className="px-1 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold uppercase mb-2 tracking-tighter">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800/30">{article.language}</span>
                          <span>•</span>
                          <span>
                            {new Date(article.createdAt).toLocaleDateString('bn-BD', {
                              day: 'numeric', month: 'short'
                            })}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-gray-100 group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2 leading-snug mb-2">
                          {article.title}
                        </h3>

                        <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2 mb-2 font-medium mt-auto">
                           {article.excerpt || "খবরের বিস্তারিত পড়তে ক্লিক করুন..."}
                        </p>
                      </div>

                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}