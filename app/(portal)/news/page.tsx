// app/news/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Newspaper, LayoutGrid } from "lucide-react";

export default async function AllNewsPage() {
  // ১. ডাটাবেজ থেকে সমস্ত PUBLISHED নিউজ নিয়ে আসা
  const articlesData = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "desc", // একদম নতুন খবরগুলো আগে থাকবে
    },
    include: {
      translations: {
        where: {
          language: "BN", // বাংলা নিউজ ফিল্টার
        },
      },
      category: {
        include: {
          translations: {
            where: { language: "BN" }
          }
        }
      }
    },
  });

  // ২. ফ্ল্যাট স্ট্রাকচারে রূপান্তর
  const articles = articlesData
    .filter((art) => art.translations.length > 0)
    .map((art) => {
      const translation = art.translations[0];
      const categoryName = art.category?.translations[0]?.name || "খেলাধুলা";
      return {
        id: art.id,
        coverImage: art.coverImage,
        createdAt: art.createdAt,
        title: translation.title,
        slug: translation.slug,
        excerpt: translation.excerpt,
        categoryName,
      };
    });

  return (
    <div className="min-h-screen bg-[#070b08] text-gray-100 font-sans selection:bg-emerald-500 selection:text-black py-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* সেকশন হেডার */}
        <div className="flex items-center gap-4 mb-12 border-b border-emerald-950/40 pb-6">
          <div className="p-2.5 bg-emerald-950/50 border border-emerald-800/30 rounded-2xl shadow-inner">
            <LayoutGrid className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">সংবাদ আর্কাইভ</h1>
            <p className="text-xs text-emerald-500/60 font-medium uppercase tracking-widest mt-1">
              All Football Updates & Articles
            </p>
          </div>
        </div>

        {/* নিউজ লিস্ট গ্রিড */}
        {articles.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-emerald-900/30 rounded-[2rem] bg-[#0b130e]/30">
            <Newspaper className="text-gray-600 w-12 h-12 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-lg">কোনো সংবাদ পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link href={`/news/${article.slug}`} key={article.id} className="group block h-full">
                <div className="flex flex-col h-full bg-[#0b130e]/50 border border-emerald-950/60 rounded-[2rem] overflow-hidden hover:border-emerald-700/40 hover:bg-[#0c1610] shadow-xl hover:shadow-2xl transition-all duration-300">
                  
                  {/* কভার ইমেজ */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-emerald-950/50">
                    <Image
                      src={article.coverImage || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600"}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-800/40 text-emerald-400 backdrop-blur-sm">
                      {article.categoryName}
                    </span>
                  </div>

                  {/* টেক্সট কন্টেন্ট */}
                  <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                    <div className="space-y-3">
                      {/* ডেট মেটা */}
                      <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold uppercase tracking-tighter">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(article.createdAt).toLocaleDateString('bn-BD', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* টাইটেল */}
                      <h3 className="text-xl font-bold text-gray-100 group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2 leading-snug">
                        {article.title}
                      </h3>

                      {/* এক্সসার্পট */}
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 font-medium">
                        {article.excerpt || "বিস্তারিত জানতে সম্পূর্ণ খবরটি পড়ুন..."}
                      </p>
                    </div>

                    {/* রিড মোর বাটন অ্যাকশন */}
                    <div className="pt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:text-emerald-400 group-hover:gap-3 transition-all">
                      <span>বিস্তারিত পড়ুন</span>
                      <ArrowRight className="w-4 h-4 text-emerald-500" />
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
