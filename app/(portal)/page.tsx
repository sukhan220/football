

// // app/page.tsx
// import { prisma } from "@/lib/prisma";
// import Image from "next/image";
// import Link from "next/link";
// import { Calendar, ArrowUpRight, Clock, Layers } from "lucide-react";

// // ডাটাবেজ রাউন্ড টেক্সটকে প্রফেশনাল বাংলায় রূপান্তর করার হেল্পার ফাংশন
// function formatBanglaRound(roundText: string | null | undefined): string {
//   if (!roundText) return "";
  
//   const roundMap: { [key: string]: string } = {
//     "last_16": "রাউন্ড অফ সিক্সটিন",
//     "round_of_16": "রাউন্ড অফ সিক্সটিন",
//     "quarter_final": "কোয়ার্টার ফাইনাল",
//     "quarter_finals": "কোয়ার্টার ফাইনাল",
//     "semi_final": "সেমিফাইনাল",
//     "semi_finals": "সেমিফাইনাল",
//     "final": "ফাইনাল"
//   };

//   const normalized = roundText.toLowerCase().trim();
//   if (roundMap[normalized]) {
//     return roundMap[normalized];
//   }

//   const banglaDigits: { [key: string]: string } = {
//     '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
//     '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
//   };
//   let converted = roundText.replace(/Round/gi, "রাউন্ড");
//   return converted.replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
// }

// // Editor.js JSON থেকে প্রথম প্যারাগ্রাফের টেক্সট বের করার হেল্পার ফাংশন
// function getFirstParagraph(contentJson: any): string {
//   try {
//     if (!contentJson) return "";
//     const content = typeof contentJson === "string" ? JSON.parse(contentJson) : contentJson;
//     if (content && Array.isArray(content.blocks)) {
//       const firstParagraphBlock = content.blocks.find((block: any) => block.type === "paragraph");
//       if (firstParagraphBlock && firstParagraphBlock.data && firstParagraphBlock.data.text) {
//         return firstParagraphBlock.data.text.replace(/<\/?[^>]+(>|$)/g, "");
//       }
//     }
//   } catch (error) {
//     console.error("Error parsing content JSON:", error);
//   }
//   return "";
// }

// export default async function Home() {
//   // 🕒 ১. ব্যবহারকারীর লোকাল টাইম এবং গত ১ সপ্তাহের রেঞ্জ ক্যালকুলেশন (গত ৪ দিন, আজ, আগামীকাল, পরশু)
//   const now = new Date();
  
//   // গত ৪ দিন আগের শুরুর সময় (00:00:00.000)
//   const pastFourDaysStart = new Date(now);
//   pastFourDaysStart.setDate(now.getDate() - 4);
//   pastFourDaysStart.setHours(0, 0, 0, 0);

//   // পরশুর শেষ সময় (23:59:59.999)
//   const dayAfterTomorrowEnd = new Date(now);
//   dayAfterTomorrowEnd.setDate(now.getDate() + 2);
//   dayAfterTomorrowEnd.setHours(23, 59, 59, 999);

//   // ডাটাবেজ থেকে ম্যাচ ফিক্সচার ফেচ
//   const fixturesData = await prisma.match.findMany({
//     where: {
//       matchDate: {
//         gte: pastFourDaysStart,
//         lte: dayAfterTomorrowEnd,
//       },
//     },
//     orderBy: {
//       matchDate: "asc",
//     },
//     include: {
//       homeTeam: true,
//       awayTeam: true,
//     },
//   });

//   // ২. মেইন Article টেবিল থেকে ডেটা ফেচ
//   const articlesData = await prisma.article.findMany({
//     where: {
//       status: "PUBLISHED",
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//     include: {
//       translations: {
//         where: {
//           language: "BN",
//         },
//       },
//     },
//   });

//   // ৩. ডেটাকে ফ্ল্যাট স্ট্রাকচারে রূপান্তর এবং ডাইনামিক excerpt তৈরি
//   const articles = articlesData
//     .filter((art) => art.translations.length > 0)
//     .map((art) => {
//       const translation = art.translations[0];
//       const generatedExcerpt = translation.excerpt 
//         ? translation.excerpt 
//         : getFirstParagraph(translation.content);

//       return {
//         id: art.id,
//         coverImage: art.coverImage,
//         createdAt: art.createdAt,
//         title: translation.title,
//         slug: translation.slug,
//         excerpt: generatedExcerpt,
//         language: translation.language,
//       };
//     });

//   // নিউজ ডিস্ট্রিবিউশন
//   const featuredArticle = articles[0];
//   const gridArticles = articles.slice(1, 4);
//   const relatedArticles = articles.length > 4 ? articles.slice(4, 7) : articles.slice(1, 4);

//   return (
//     <div className="min-h-screen bg-[#070b08] text-gray-100 selection:bg-emerald-500 selection:text-black pt-16">
//       {/* প্রফেশনাল ফন্ট সিডিএন ইনজেকশন */}
//       <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Color+Emoji&display=swap" />
      
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all space-y-12" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
        
//         {/* ⚽ উপরে: ১ সপ্তাহের হরাইজন্টাল স্ক্রল ম্যাচ ফিক্সচার */}
//         {fixturesData.length > 0 && (
//           <div className="w-full overflow-x-auto no-scrollbar flex gap-4 pb-4 snap-x scroll-smooth">
//             {fixturesData.map((match) => {
//               // লোকাল টাইমজোন ম্যাচিং লজিক
//               const matchDate = new Date(match.matchDate);
//               const matchDateStr = matchDate.toLocaleDateString('en-US');
              
//               const today = new Date();
//               const todayStr = today.toLocaleDateString('en-US');
              
//               const yesterday = new Date();
//               yesterday.setDate(today.getDate() - 1);
//               const yesterdayStr = yesterday.toLocaleDateString('en-US');

//               const tomorrow = new Date();
//               tomorrow.setDate(today.getDate() + 1);
//               const tomorrowStr = tomorrow.toLocaleDateString('en-US');

//               const dayAfterTomorrow = new Date();
//               dayAfterTomorrow.setDate(today.getDate() + 2);
//               const dayAfterTomorrowStr = dayAfterTomorrow.toLocaleDateString('en-US');

//               // ডাইনামিক ডে লেবেল কন্ডিশন
//               let dayLabel = matchDate.toLocaleDateString('bn-BD', { weekday: 'long' });
//               if (matchDateStr === todayStr) {
//                 dayLabel = "আজ";
//               } else if (matchDateStr === tomorrowStr) {
//                 dayLabel = "আগামীকাল";
//               } else if (matchDateStr === dayAfterTomorrowStr) {
//                 dayLabel = "পরশু";
//               } else if (matchDateStr === yesterdayStr) {
//                 dayLabel = "গতকাল";
//               }

//               const currentStatus = match.status as string;
//               const isLive = currentStatus === "LIVE" || currentStatus === "RUNNING" || currentStatus === "IN_PLAY";
//               const isFinished = currentStatus === "FINISHED" || currentStatus === "FT";
//               const shouldShowScore = isLive || isFinished;

//               return (
//                 <div 
//                   key={match.id} 
//                   className="min-w-[290px] sm:min-w-[330px] snap-center shrink-0 p-4 rounded-2xl bg-[#0b130e]/80 border border-emerald-950 hover:border-emerald-900/60 transition duration-200 shadow-lg"
//                 >
//                   <div className="flex justify-between items-center gap-2 mb-3">
//                     <div className="flex items-center gap-1.5 min-w-0">
//                       {isLive ? (
//                         <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-red-600 text-white animate-pulse shrink-0">
//                           লাইভ
//                         </span>
//                       ) : (
//                         <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded shrink-0 ${
//                           dayLabel === "আজ" 
//                             ? 'bg-red-950/60 text-red-400 border border-red-900/30' 
//                             : dayLabel === "গতকাল"
//                             ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
//                             : dayLabel === "আগামীকাল" || dayLabel === "পরশু"
//                             ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/30'
//                             : 'bg-zinc-900 text-gray-400 border border-zinc-800'
//                         }`}>
//                           {dayLabel}
//                         </span>
//                       )}
                      
//                       {match.round && (
//                         <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 truncate">
//                           {formatBanglaRound(match.round)}
//                         </span>
//                       )}
//                     </div>

//                     {/* ব্যবহারকারীর বর্তমান দেশের নিজস্ব লোকাল সময় প্রদর্শন করবে */}
//                     <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 shrink-0">
//                       <Clock className="w-3 h-3 text-emerald-500" />
//                       <span>
//                         {matchDate.toLocaleTimeString([], {
//                           hour: '2-digit', minute: '2-digit', hour12: true
//                         })}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between gap-2 mt-1">
//                     <div className="flex items-center gap-2 flex-1 min-w-0">
//                       {match.homeTeam.logo && (
//                         <div className="relative w-5 h-5 shrink-0">
//                           <Image src={match.homeTeam.logo} alt={match.homeTeam.name} fill className="object-contain" />
//                         </div>
//                       )}
//                       <span className="text-xs font-bold text-gray-200 truncate">{match.homeTeam.name}</span>
                      
//                       {shouldShowScore && (
//                         <span className="ml-auto text-[11px] font-black text-white bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 shrink-0">
//                           {match.homeScore ?? 0}
//                         </span>
//                       )}
//                     </div>

//                     <span className="text-[10px] font-black text-emerald-500 px-1.5 py-0.5 bg-emerald-950/30 rounded-md border border-emerald-900/20 shrink-0">VS</span>

//                     <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
//                       {shouldShowScore && (
//                         <span className="mr-auto text-[11px] font-black text-white bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 shrink-0">
//                           {match.awayScore ?? 0}
//                         </span>
//                       )}

//                       <span className="text-xs font-bold text-gray-200 truncate text-right">{match.awayTeam.name}</span>
//                       {match.awayTeam.logo && (
//                         <div className="relative w-5 h-5 shrink-0">
//                           <Image src={match.awayTeam.logo} alt={match.awayTeam.name} fill className="object-contain" />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* নিউজ পার্ট */}
//         {articles.length > 0 && (
//           <div className="space-y-12">
            
//             {/* ফিচার্ড নিউজ (Hero Card) */}
//             {featuredArticle && (
//               <Link href={`/news/${featuredArticle.slug}`} className="group block">
//                 <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 bg-[#0b130e] border border-emerald-950/60 rounded-[2rem] overflow-hidden hover:border-emerald-700/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500">
//                   <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
                  
//                   <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto lg:h-[380px] overflow-hidden">
//                     <Image
//                       src={featuredArticle.coverImage || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200"} 
//                       alt={featuredArticle.title}
//                       fill
//                       priority
//                       className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
//                     />
//                   </div>

//                   <div className="lg:col-span-5 flex flex-col justify-center p-6 lg:p-8">
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-2 text-[11px] text-emerald-500 font-bold uppercase tracking-widest">
//                         <Calendar className="w-3.5 h-3.5" />
//                         <span>
//                           {new Date(featuredArticle.createdAt).toLocaleDateString('bn-BD', {
//                             day: 'numeric', month: 'long', year: 'numeric'
//                           })}
//                         </span>
//                       </div>

//                       <h2 className="text-xl lg:text-2xl font-extrabold text-white group-hover:text-emerald-400 transition-colors duration-300 leading-snug text-left">
//                         {featuredArticle.title}
//                       </h2>

//                       <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 font-medium text-justify">
//                         {featuredArticle.excerpt || "খবরের বিস্তারিত অংশ জানতে নিচে ক্লিক করুন।"}
//                       </p>

//                       <div className="pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400 group-hover:text-white transition-all">
//                         <span>খবরের বিস্তারিত অংশ জানতে এখানে ক্লিক করুন</span>
//                         <ArrowUpRight className="w-4 h-4 text-emerald-500" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             )}

//             {/* সাব নিউজ গ্রিড */}
//             {gridArticles.length > 0 && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {gridArticles.map((article) => (
//                   <Link href={`/news/${article.slug}`} key={article.id} className="group block h-full">
//                     <div className="flex flex-col h-full bg-[#0b130e]/40 border border-emerald-950/40 rounded-[2rem] p-4 hover:bg-[#0e1a13] hover:border-emerald-800/40 hover:shadow-2xl transition-all duration-300">
//                       <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-emerald-950 border border-emerald-900/20 mb-4">
//                         <Image
//                           src={article.coverImage || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600"}
//                           alt={article.title}
//                           fill
//                           className="object-cover group-hover:scale-110 transition-transform duration-500"
//                         />
//                       </div>

//                       <div className="px-1 flex flex-col flex-grow justify-between space-y-3">
//                         <div className="space-y-2">
//                           <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">
//                             {new Date(article.createdAt).toLocaleDateString('bn-BD', {
//                               day: 'numeric', month: 'short', year: 'numeric'
//                             })}
//                           </div>

//                           <h3 className="text-base font-bold text-gray-100 group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2 leading-snug text-left">
//                             {article.title}
//                           </h3>

//                           <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2 font-medium text-justify">
//                             {article.excerpt || "খবরের বিস্তারিত অংশ জানতে ক্লিক করুন..."}
//                           </p>
//                         </div>

//                         <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-500 group-hover:text-emerald-400 transition-all">
//                           <span>খবরের বিস্তারিত অংশ জানতে ক্লিক করুন</span>
//                           <ArrowUpRight className="w-3.5 h-3.5" />
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}

//             {/* সম্পর্কিত খবর সেকশন */}
//             {relatedArticles.length > 0 && (
//               <div className="pt-6 border-t border-emerald-950/40">
//                 <div className="flex items-center gap-2 mb-6 text-emerald-400">
//                   <Layers className="w-5 h-5 text-emerald-500" />
//                   <h3 className="text-lg font-black tracking-wide uppercase">সম্পর্কিত খবর (Related News)</h3>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {relatedArticles.map((article) => (
//                     <Link href={`/news/${article.slug}`} key={article.id} className="group block">
//                       <div className="flex items-center gap-4 bg-[#0b130e]/20 hover:bg-[#0b130e]/60 border border-emerald-950/30 rounded-2xl p-3 transition-all duration-300">
//                         <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-emerald-950">
//                           <Image
//                             src={article.coverImage || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=200"}
//                             alt={article.title}
//                             fill
//                             className="object-cover group-hover:scale-105 transition-transform duration-300"
//                           />
//                         </div>
//                         <div className="min-w-0 space-y-1">
//                           <h4 className="text-sm font-bold text-gray-200 group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2 leading-snug text-left">
//                             {article.title}
//                           </h4>
//                           <span className="block text-[10px] text-gray-500 text-left">
//                             {new Date(article.createdAt).toLocaleDateString('bn-BD', {
//                               day: 'numeric', month: 'short'
//                             })}
//                           </span>
//                         </div>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
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
import { Calendar, ArrowUpRight, Clock, Layers } from "lucide-react";

// ডাটাবেজ রাউন্ড টেক্সটকে প্রফেশনাল বাংলায় রূপান্তর করার হেল্পার ফাংশন
function formatBanglaRound(roundText: string | null | undefined): string {
  if (!roundText) return "";
  
  const roundMap: { [key: string]: string } = {
    "last_16": "রাউন্ড অফ সিক্সটিন",
    "round_of_16": "রাউন্ড অফ সিক্সটিন",
    "quarter_final": "কোয়ার্টার ফাইনাল",
    "quarter_finals": "কোয়ার্টার ফাইনাল",
    "semi_final": "সেমিফাইনাল",
    "semi_finals": "সেমিফাইনাল",
    "final": "ফাইনাল"
  };

  const normalized = roundText.toLowerCase().trim();
  if (roundMap[normalized]) {
    return roundMap[normalized];
  }

  const banglaDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  let converted = roundText.replace(/Round/gi, "রাউন্ড");
  return converted.replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
}

// Editor.js JSON থেকে প্রথম প্যারাগ্রাফের টেক্সট বের করার হেল্পার ফাংশন
function getFirstParagraph(contentJson: any): string {
  try {
    if (!contentJson) return "";
    const content = typeof contentJson === "string" ? JSON.parse(contentJson) : contentJson;
    if (content && Array.isArray(content.blocks)) {
      const firstParagraphBlock = content.blocks.find((block: any) => block.type === "paragraph");
      if (firstParagraphBlock && firstParagraphBlock.data && firstParagraphBlock.data.text) {
        return firstParagraphBlock.data.text.replace(/<\/?[^>]+(>|$)/g, "");
      }
    }
  } catch (error) {
    console.error("Error parsing content JSON:", error);
  }
  return "";
}

export default async function Home() {
  // 🕒 ১. ব্যবহারকারীর লোকাল টাইম এবং গত ১ সপ্তাহের রেঞ্জ ক্যালকুলেশন (গত ৪ দিন, আজ, আগামীকাল, পরশু)
  const now = new Date();
  
  // গত ৪ দিন আগের শুরুর সময় (00:00:00.000)
  const pastFourDaysStart = new Date(now);
  pastFourDaysStart.setDate(now.getDate() - 4);
  pastFourDaysStart.setHours(0, 0, 0, 0);

  // পরশুর শেষ সময় (23:59:59.999)
  const dayAfterTomorrowEnd = new Date(now);
  dayAfterTomorrowEnd.setDate(now.getDate() + 2);
  dayAfterTomorrowEnd.setHours(23, 59, 59, 999);

  // ডাটাবেজ থেকে ম্যাচ ফিক্সচার ফেচ
  const rawFixturesData = await prisma.match.findMany({
    where: {
      matchDate: {
        gte: pastFourDaysStart,
        lte: dayAfterTomorrowEnd,
      },
    },
    orderBy: {
      matchDate: "asc",
    },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });

  // 🎯 ম্যাচগুলোকে রানিং/আজকের ভিত্তিতে সাজানোর লজিক (যাতে স্ক্রল ছাড়াই এটি প্রথমে দেখায়)
  const sortedFixtures: typeof rawFixturesData = [];
  const pastFixtures: typeof rawFixturesData = [];

  rawFixturesData.forEach((match) => {
    const currentStatus = match.status as string;
    const isLive = currentStatus === "LIVE" || currentStatus === "RUNNING" || currentStatus === "IN_PLAY";
    
    const matchDateStr = new Date(match.matchDate).toLocaleDateString('en-US');
    const todayStr = now.toLocaleDateString('en-US');
    const isToday = matchDateStr === todayStr;

    // লাইভ বা আজকের ম্যাচ হলে অ্যারের শুরুতে যাবে, আগের ম্যাচ হলে শেষে যাবে
    if (isLive || isToday) {
      sortedFixtures.unshift(match); // সবার আগে পুশ হবে
    } else if (new Date(match.matchDate) < now) {
      pastFixtures.push(match); // পুরনো ম্যাচগুলো আলাদা জমা হচ্ছে
    } else {
      sortedFixtures.push(match); // ভবিষ্যতের ম্যাচগুলো ক্রমানুসারে বসবে
    }
  });

  // পুরনো ম্যাচগুলোকে একদম বামে পাঠিয়ে নতুন সাজানো অ্যারে তৈরি
  const fixturesData = [...pastFixtures, ...sortedFixtures];


  // ২. মেইন Article টেবিল থেকে ডেটা ফেচ
  const articlesData = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      translations: {
        where: {
          language: "BN",
        },
      },
    },
  });

  // ৩. ডোকে ফ্ল্যাট স্ট্রাকচারে রূপান্তর এবং ডাইনামিক excerpt তৈরি
  const articles = articlesData
    .filter((art) => art.translations.length > 0)
    .map((art) => {
      const translation = art.translations[0];
      const generatedExcerpt = translation.excerpt 
        ? translation.excerpt 
        : getFirstParagraph(translation.content);

      return {
        id: art.id,
        coverImage: art.coverImage,
        createdAt: art.createdAt,
        title: translation.title,
        slug: translation.slug,
        excerpt: generatedExcerpt,
        language: translation.language,
      };
    });

  // নিউজ ডিস্ট্রিবিউশন
  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1, 4);
  const relatedArticles = articles.length > 4 ? articles.slice(4, 7) : articles.slice(1, 4);

  return (
    <div className="min-h-screen bg-[#070b08] text-gray-100 selection:bg-emerald-500 selection:text-black pt-16">
      {/* প্রফেশনাল ফন্ট সিডিএন ইনজেকশন */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Color+Emoji&display=swap" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all space-y-12" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
        
        {/* ⚽ উপরে: ১ সপ্তাহের হরাইজন্টাল স্ক্রল ম্যাচ ফিক্সচার */}
        {fixturesData.length > 0 && (
          <div className="w-full overflow-x-auto no-scrollbar flex gap-4 pb-4 snap-x scroll-smooth">
            {fixturesData.map((match) => {
              const matchDate = new Date(match.matchDate);
              const matchDateStr = matchDate.toLocaleDateString('en-US');
              
              const today = new Date();
              const todayStr = today.toLocaleDateString('en-US');
              
              const yesterday = new Date();
              yesterday.setDate(today.getDate() - 1);
              const yesterdayStr = yesterday.toLocaleDateString('en-US');

              const tomorrow = new Date();
              tomorrow.setDate(today.getDate() + 1);
              const tomorrowStr = tomorrow.toLocaleDateString('en-US');

              const dayAfterTomorrow = new Date();
              dayAfterTomorrow.setDate(today.getDate() + 2);
              const dayAfterTomorrowStr = dayAfterTomorrow.toLocaleDateString('en-US');

              // ডাইনামিক ডে লেবেল কন্ডিশন
              let dayLabel = matchDate.toLocaleDateString('bn-BD', { weekday: 'long' });
              if (matchDateStr === todayStr) {
                dayLabel = "আজ";
              } else if (matchDateStr === tomorrowStr) {
                dayLabel = "আগামীকাল";
              } else if (matchDateStr === dayAfterTomorrowStr) {
                dayLabel = "পরশু";
              } else if (matchDateStr === yesterdayStr) {
                dayLabel = "গতকাল";
              }

              const currentStatus = match.status as string;
              const isLive = currentStatus === "LIVE" || currentStatus === "RUNNING" || currentStatus === "IN_PLAY";
              const isFinished = currentStatus === "FINISHED" || currentStatus === "FT";
              const shouldShowScore = isLive || isFinished;

              return (
                <div 
                  key={match.id} 
                  className="min-w-[290px] sm:min-w-[330px] snap-center shrink-0 p-4 rounded-2xl bg-[#0b130e]/80 border border-emerald-950 hover:border-emerald-900/60 transition duration-200 shadow-lg"
                >
                  <div className="flex justify-between items-center gap-2 mb-3">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {isLive ? (
                        <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-red-600 text-white animate-pulse shrink-0">
                          লাইভ
                        </span>
                      ) : (
                        <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded shrink-0 ${
                          dayLabel === "আজ" 
                            ? 'bg-red-950/60 text-red-400 border border-red-900/30' 
                            : dayLabel === "গতকাল"
                            ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                            : dayLabel === "আগামীকাল" || dayLabel === "পরশু"
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/30'
                            : 'bg-zinc-900 text-gray-400 border border-zinc-800'
                        }`}>
                          {dayLabel}
                        </span>
                      )}
                      
                      {match.round && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 truncate">
                          {formatBanglaRound(match.round)}
                        </span>
                      )}
                    </div>

                    {/* 🇧🇩 এশিয়া/ঢাকা (বাংলাদেশি সময়) অনুযায়ী ফরম্যাট করা */}
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 shrink-0">
                      <Clock className="w-3 h-3 text-emerald-500" />
                      <span>
                        {matchDate.toLocaleTimeString('bn-BD', {
                          timeZone: "Asia/Dhaka",
                          hour: '2-digit', minute: '2-digit', hour12: true
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {match.homeTeam.logo && (
                        <div className="relative w-5 h-5 shrink-0">
                          <Image src={match.homeTeam.logo} alt={match.homeTeam.name} fill className="object-contain" />
                        </div>
                      )}
                      <span className="text-xs font-bold text-gray-200 truncate">{match.homeTeam.name}</span>
                      
                      {shouldShowScore && (
                        <span className="ml-auto text-[11px] font-black text-white bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 shrink-0">
                          {match.homeScore ?? 0}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-black text-emerald-500 px-1.5 py-0.5 bg-emerald-950/30 rounded-md border border-emerald-900/20 shrink-0">VS</span>

                    <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                      {shouldShowScore && (
                        <span className="mr-auto text-[11px] font-black text-white bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 shrink-0">
                          {match.awayScore ?? 0}
                        </span>
                      )}

                      <span className="text-xs font-bold text-gray-200 truncate text-right">{match.awayTeam.name}</span>
                      {match.awayTeam.logo && (
                        <div className="relative w-5 h-5 shrink-0">
                          <Image src={match.awayTeam.logo} alt={match.awayTeam.name} fill className="object-contain" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* নিউজ পার্ট */}
        {articles.length > 0 && (
          <div className="space-y-12">
            
            {/* ফিচার্ড নিউজ (Hero Card) */}
            {featuredArticle && (
              <Link href={`/news/${featuredArticle.slug}`} className="group block">
                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 bg-[#0b130e] border border-emerald-950/60 rounded-[2rem] overflow-hidden hover:border-emerald-700/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500">
                  <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
                  
                  <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto lg:h-[380px] overflow-hidden">
                    <Image
                      src={featuredArticle.coverImage || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200"} 
                      alt={featuredArticle.title}
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>

                  <div className="lg:col-span-5 flex flex-col justify-center p-6 lg:p-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[11px] text-emerald-500 font-bold uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(featuredArticle.createdAt).toLocaleDateString('bn-BD', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </span>
                      </div>

                      <h2 className="text-xl lg:text-2xl font-extrabold text-white group-hover:text-emerald-400 transition-colors duration-300 leading-snug text-left">
                        {featuredArticle.title}
                      </h2>

                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 font-medium text-justify">
                        {featuredArticle.excerpt || "খবরের বিস্তারিত অংশ জানতে নিচে ক্লিক করুন।"}
                      </p>

                      <div className="pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400 group-hover:text-white transition-all">
                        <span>খবরের বিস্তারিত অংশ জানতে এখানে ক্লিক করুন</span>
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* সাব নিউজ গ্রিড */}
            {gridArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridArticles.map((article) => (
                  <Link href={`/news/${article.slug}`} key={article.id} className="group block h-full">
                    <div className="flex flex-col h-full bg-[#0b130e]/40 border border-emerald-950/40 rounded-[2rem] p-4 hover:bg-[#0e1a13] hover:border-emerald-800/40 hover:shadow-2xl transition-all duration-300">
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-emerald-950 border border-emerald-900/20 mb-4">
                        <Image
                          src={article.coverImage || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600"}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="px-1 flex flex-col flex-grow justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">
                            {new Date(article.createdAt).toLocaleDateString('bn-BD', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </div>

                          <h3 className="text-base font-bold text-gray-100 group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2 leading-snug text-left">
                            {article.title}
                          </h3>

                          <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2 font-medium text-justify">
                            {article.excerpt || "খবরের বিস্তারিত অংশ জানতে ক্লিক করুন..."}
                          </p>
                        </div>

                        <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-500 group-hover:text-emerald-400 transition-all">
                          <span>খবরের বিস্তারিত অংশ জানতে ক্লিক করুন</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* সম্পর্কিত খবর সেকশন */}
            {relatedArticles.length > 0 && (
              <div className="pt-6 border-t border-emerald-950/40">
                <div className="flex items-center gap-2 mb-6 text-emerald-400">
                  <Layers className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg font-black tracking-wide uppercase">সম্পর্কিত খবর (Related News)</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedArticles.map((article) => (
                    <Link href={`/news/${article.slug}`} key={article.id} className="group block">
                      <div className="flex items-center gap-4 bg-[#0b130e]/20 hover:bg-[#0b130e]/60 border border-emerald-950/30 rounded-2xl p-3 transition-all duration-300">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-emerald-950">
                          <Image
                            src={article.coverImage || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=200"}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <h4 className="text-sm font-bold text-gray-200 group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2 leading-snug text-left">
                            {article.title}
                          </h4>
                          <span className="block text-[10px] text-gray-500 text-left">
                            {new Date(article.createdAt).toLocaleDateString('bn-BD', {
                              day: 'numeric', month: 'short'
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}