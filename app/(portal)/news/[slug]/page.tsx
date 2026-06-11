
// app/news/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Newspaper, Flame } from "lucide-react";
import editorjsHTML from "editorjs-html";
import LikeSection from "@/components/news/LikeSection";
import CommentSection from "@/components/news/CommentSection";

const dict = {
  BN: {
    moreRead: "আরও পড়ুন",
    latestNews: "সর্বশেষ আপডেট সংবাদ",
    noRelated: "কোনো রিলেটেড সংবাদ পাওয়া যায়নি।",
    readText: "পড়ুন",
    latestBadge: "সর্বশেষ",
    reactText: "টি রিঅ্যাক্ট",
    commentText: "টি মন্তব্য",
  },
  EN: {
    moreRead: "Related News",
    latestNews: "Latest Updates",
    noRelated: "No related articles found.",
    readText: "Read",
    latestBadge: "LATEST",
    reactText: "Reacts",
    commentText: "Comments",
  }
};

const customImageRenderer = (block: any) => {
  const url = block.data.file.url;
  const caption = block.data.caption || "";
  const stretched = block.data.stretched ? "w-full" : "max-w-xl mx-auto";
  
  return `
    <figure class="my-6 flex flex-col items-center justify-center bg-[#0b130e]/20 border border-emerald-950/40 p-2 rounded-2xl ${stretched}">
      <img src="${url}" alt="${caption}" class="rounded-xl object-cover max-h-[400px] w-full shadow-lg" />
      ${caption ? `<figcaption class="text-center text-[11px] text-emerald-500/50 font-normal mt-2.5 italic px-4 tracking-wide">📸 ${caption}</figcaption>` : ""}
    </figure>
  `;
};

// অন্যান্য সাধারণ ব্লকের জন্য পার্সার আগের মতোই থাকবে
const edjsParser = editorjsHTML({ image: customImageRenderer });

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SingleNewsPage({ params }: PageProps) {
  const { slug } = await params;

  // ১. ডাইনামিক ল্যাঙ্গুয়েজ ডিটেকশন
  const initialCheck = await prisma.articleTranslation.findFirst({
    where: { slug: slug },
    select: { language: true }
  });

  if (!initialCheck) notFound();
  
  const currentLang = initialCheck.language as "BN" | "EN";
  const t = dict[currentLang];

  // ২. মেইন আর্টিকেল ডেটা ফেচ
  const translationData = await prisma.articleTranslation.findUnique({
    where: {
      language_slug: { language: currentLang, slug: slug },
    },
    include: {
      article: {
        include: {
          comments: {
            include: { user: true },
            orderBy: { createdAt: "desc" }
          },
          _count: { select: { likes: true, comments: true } }
        }
      },
    },
  });

  if (!translationData) notFound();

  const { title, content, excerpt, articleId } = translationData; 
  const { coverImage, categoryId, createdAt, comments, _count } = translationData.article;

  // ৩. রিলেটেড নিউজ
  const relatedArticlesData = await prisma.article.findMany({
    where: { categoryId: categoryId, id: { not: articleId }, status: "PUBLISHED" },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: { translations: { where: { language: currentLang } } },
  });

  const relatedArticles = relatedArticlesData
    .filter((art) => art.translations.length > 0)
    .map((art) => ({
      id: art.id,
      coverImage: art.coverImage,
      title: art.translations[0].title,
      slug: art.translations[0].slug,
      createdAt: art.createdAt,
    }));

  // ৪. গ্লোবাল লেটেস্ট নিউজ
  const latestArticlesData = await prisma.article.findMany({
    where: { id: { not: articleId }, status: "PUBLISHED" },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { translations: { where: { language: currentLang } } },
  });

  const latestArticles = latestArticlesData
    .filter((art) => art.translations.length > 0)
    .map((art) => ({
      id: art.id,
      coverImage: art.coverImage,
      title: art.translations[0].title,
      slug: art.translations[0].slug,
      excerpt: art.translations[0].excerpt,
      createdAt: art.createdAt,
    }));

  // 🛠️ ডকুমেন্টেশন ও ডেটা স্ট্রাকচার অনুসারে সম্পূর্ণ হ্যান্ড-ক্রাফটেড পার্সিং লজিক
  const renderContent = () => {
    try {
      const rawData = typeof content === "string" ? JSON.parse(content) : content;
      const blocks = rawData.blocks || [];

      const processedHtml = blocks.map((block: any) => {
        // ফিক্স ১: যদি প্যারাগ্রাফ টাইপের ব্লকে আপনার মতো আইফ্রেম কোড টেক্সট হিসেবে থাকে
        if (block.type === "paragraph" && (block.data.text.includes("&lt;iframe") || block.data.text.includes("<iframe"))) {
          
          // HTML Entities (যেমন &lt; &gt; &quot;) পরিষ্কার করে র-আইফ্রেম ডিকোড করা হচ্ছে
          let cleanIframe = block.data.text
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&');
          
          // রেসপন্সিভ হাইট-উইডথ অ্যাসাইন করা হচ্ছে যেন ডার্ক থিমের লেআউট ভেঙে না যায়
          cleanIframe = cleanIframe
            .replace(/width="[^"]*"/, 'width="100%"')
            .replace(/height="[^"]*"/, 'height="100%"');

          return `
            <figure class="my-6 w-full max-w-3xl mx-auto">
              <div class="relative aspect-video w-full overflow-hidden rounded-2xl border border-emerald-950/80 shadow-2xl bg-[#0b130e]">
                ${cleanIframe}
              </div>
            </figure>
          `;
        }

        // ফিক্স ২: স্ট্যান্ডার্ড ও ডকুমেন্টেশন ফরম্যাট (ভবিষ্যতে লিংক পেস্ট করলে যেভাবে জেনারেট হবে)
        if (block.type === "embed") {
          const embedUrl = block.data.embed;
          const caption = block.data.caption || "";
          return `
            <figure class="my-6 w-full max-w-3xl mx-auto">
              <div class="relative aspect-video w-full overflow-hidden rounded-2xl border border-emerald-950/80 shadow-2xl bg-[#0b130e]">
                <iframe 
                  src="${embedUrl}" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                  class="absolute top-0 left-0 w-full h-full border-0"
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                  title="${caption || 'Embedded video'}">
                </iframe>
              </div>
              ${caption ? `<figcaption class="text-center text-[11px] text-emerald-500/50 font-normal mt-2 italic px-4 tracking-wide">${caption}</figcaption>` : ""}
            </figure>
          `;
        }

        // বাকি সাধারণ সব ব্লকের কাজ editorjs-html হ্যান্ডেল করবে
        const fallbackParser = edjsParser.parse({ blocks: [block] });
        return Array.isArray(fallbackParser) ? fallbackParser.join("") : fallbackParser;
      });

      return processedHtml.join("");
    } catch (error) {
      return typeof content === "string" ? content : "";
    }
  };

  const dateLocale = currentLang === "BN" ? "bn-BD" : "en-US";

  return (
    <div className="min-h-screen bg-[#070b08] text-gray-100 py-12 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* mian grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          
          {/* left grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(createdAt).toLocaleDateString(dateLocale, {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight font-serif">
              {title}
            </h1>
            
            {coverImage && (
              <div className="relative aspect-[16/9] w-full rounded-[2rem] overflow-hidden border border-emerald-950/80 shadow-2xl bg-[#0b130e]">
                <Image src={coverImage} alt={title} fill priority className="object-cover" />
              </div>
            )}

            {excerpt && (
              <p className="text-gray-400 text-base sm:text-lg font-medium leading-relaxed border-l-4 border-emerald-500 pl-4 py-1 bg-[#0b130e]/30 rounded-r-xl">
                {excerpt}
              </p>
            )}
            
            <div 
              className="prose prose-invert prose-emerald max-w-none text-gray-300 space-y-5 font-normal leading-relaxed text-[16px] sm:text-[17px]
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-gray-300 prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderContent() }}
            />

            <LikeSection 
              articleId={articleId} 
              initialLikes={_count.likes} 
              initialHasLiked={false} 
              commentCount={_count.comments}
              labels={{ reactText: t.reactText, commentText: t.commentText }}
            />

            <CommentSection 
              articleId={articleId} 
              language={currentLang}
              initialComments={comments.map(c => ({
                id: c.id,
                body: c.body,
                createdAt: c.createdAt.toISOString(),
                user: { name: c.user.name || "User", image: c.user.image || "" }
              }))} 
            />
          </div>

          {/* right grid */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="rounded-[2rem] border border-emerald-950/60 bg-[#0b130e]/40 p-5 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3 mb-6 border-b border-emerald-950/40 pb-4">
                <Newspaper className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white tracking-tight">{t.moreRead}</h2>
              </div>

              {relatedArticles.length === 0 ? (
                <p className="text-gray-500 text-xs py-2">{t.noRelated}</p>
              ) : (
                <div className="flex flex-col gap-5">
                  {relatedArticles.map((item) => (
                    <Link href={`/news/${item.slug}`} key={item.id} className="group block">
                      <div className="flex gap-3 items-center p-1.5 rounded-2xl hover:bg-emerald-950/20 transition-all duration-200">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-emerald-950 bg-emerald-950/20">
                          <Image src={item.coverImage || "/default-news.png"} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-emerald-600/70 block mb-0.5">
                            {new Date(item.createdAt).toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' })}
                          </span>
                          <h3 className="text-xs font-bold text-gray-200 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* bottom footer grid */}
        <div className="border-t border-emerald-950/40 pt-12 space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">{t.latestNews}</h2>
          </div>

          <div className="flex overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 gap-6 scrollbar-none">
            {latestArticles.map((article) => (
              <Link 
                href={`/news/${article.slug}`} 
                key={article.id} 
                className="min-w-[80%] sm:min-w-[50%] md:min-w-0 snap-start group bg-[#0b130e]/20 border border-emerald-950/40 rounded-2xl overflow-hidden hover:border-emerald-500/30 hover:bg-[#0b130e]/40 transition-all duration-300 flex flex-col h-full shadow-lg"
              >
                <div className="relative aspect-[16/10] w-full bg-emerald-950/20 overflow-hidden">
                  <Image 
                    src={article.coverImage || "/default-news.png"} 
                    alt={article.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-950/60 px-2 py-0.5 rounded-md uppercase">{t.latestBadge}</span>
                    <h3 className="text-sm font-bold text-gray-100 group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 font-normal leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}