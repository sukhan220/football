

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";

import {
  Menu,
  Search,
  User,
  Globe,
  ChevronDown,
  X,
} from "lucide-react";

interface NavbarProps {
  session: any; // সার্ভার সাইড থেকে পাস করা সেশন
}

export default function Navbar({ session }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ভাষা এবং সার্চ স্টেট
  const [lang, setLang] = useState("BN");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // 👈 মোবাইল ও ক্লিকের জন্য ড্রপডাউন টগল স্টেট
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ড্রপডাউনের বাইরে ক্লিক করলে তা বন্ধ করার মেকানিজম
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ইউআরএল কুয়েরি থেকে ভাষা ডিটেক্ট করা
  useEffect(() => {
    const currentLang = searchParams.get("lang");
    if (currentLang) setLang(currentLang.toUpperCase());
  }, [searchParams]);

  const toggleLanguage = () => {
    const nextLang = lang === "BN" ? "EN" : "BN";
    setLang(nextLang);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", nextLang.toLowerCase());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const userRole = session?.user?.role || "USER";
  const isManagement = ["ADMIN", "EDITOR", "WRITER"].includes(userRole);
  const dashboardHref = isManagement ? "/admin/dashboard" : "/profile";

  const menu = [
    { label: "News", href: "/" },
    { label: "FIFA World Cup", href: "/E-Magazine/Fixtures" },
    { label: "Score", href: "/live-score" },
  ];

  const topNews = [
    {
      title: "বাংলাদেশ বনাম ভারত লাইভ: টি-২০ বিশ্বকাপে রোমাঞ্চকর লড়াই!",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRZpJtxDl9MIq4M27e6gZRYO4QuB2Yz78XAg&s",
    },
    {
      title: "চ্যাম্পিয়ন্স লিগের ফাইনালে মুখোমুখি রিয়াল মাদ্রিদ ও বায়ার্ন",
      image: "https://www.aljazeera.com/wp-content/uploads/2023/11/2023-10-03T165235Z_843684383_UP1EJA31AVKI2_RTRMADP_3_SOCCER-CHAMPIONS-UNB-SBR-REPORT-1701170248.jpg?resize=1920%2C1440",
    },
    {
      title: "ব্যালন ডি'অর ২০২৬-এর দৌড়ে কে এগিয়ে? দেখে নিন তালিকা",
      image: "https://img.olympics.com/images/image/private/t_s_pog_staticContent_hero_xl_2x/f_auto/primary/lfyjdb7ypuxthbwnwg7y",
    }
  ];

  return (
    <>
      {/* TOP HEADER SECTION */}
      <header className="w-full border-b border-gray-100 bg-[#0b130e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 py-3 overflow-hidden">
            
            <Link href="/" className="shrink-0 group transition duration-300">
              <div className="relative w-[160px] h-[50px]">
                <Image
                  src="/logo.png"
                  alt="Sport88 Logo"
                  fill
                  className="object-contain object-left group-hover:scale-105 transition duration-300"
                />
              </div>
            </Link>

            <div className="hidden lg:flex items-center flex-1 justify-end gap-2">
              {topNews.map((news, index) => (
                <Link
                  href="/"
                  key={index}
                  className="flex items-center gap-3 px-4 py-1.5 border-r border-emerald-950/40 last:border-r-0 hover:bg-emerald-950/30 rounded-lg transition duration-200 group max-w-[340px]"
                >
                  <div className="relative w-[55px] h-[38px] rounded-md overflow-hidden bg-emerald-900 shrink-0 border border-emerald-800/50">
                    <Image 
                      src={news.image} 
                      alt="" 
                      fill 
                      className="object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <h3 className="text-[13px] leading-snug font-medium text-gray-300 group-hover:text-emerald-400 transition line-clamp-2">
                    {news.title}
                  </h3>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </header>

      {/* STICKY MAIN NAVIGATION */}
      <div className="sticky top-0 z-[999] bg-[#111c15]/95 backdrop-blur-md border-b border-emerald-950/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">

            {/* LEFT SIDE NAVIGATION */}
            <div className="flex items-center overflow-x-auto scrollbar-hide h-full">
              {menu.map((item) => {
                const isLive = item.href === "/live-score";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative shrink-0 px-5 h-full flex items-center text-[14px] font-semibold text-gray-200 hover:text-emerald-400 tracking-wide uppercase transition duration-200 group border-b-2 border-transparent hover:border-emerald-500"
                  >
                    <span className="flex items-center gap-2">
                      {item.label}
                      {isLive && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div className="flex items-center h-full shrink-0 relative">
              
              {/* SEARCH */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="h-full px-4.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-950/20 transition flex items-center justify-center"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5 stroke-[1.8]" />}
              </button>

              {isSearchOpen && (
                <form 
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-[60px] bg-[#0e1612] border border-emerald-900/60 p-3 rounded-b-xl shadow-2xl flex items-center gap-2 z-[1010] min-w-[280px] animate-in slide-in-from-top-2 duration-200"
                >
                  <input 
                    type="text" 
                    placeholder={lang === "BN" ? "খবর খুঁজুন..." : "Search news..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="flex-1 bg-emerald-950/40 border border-emerald-900 text-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 transition"
                  />
                  <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-[#090d0a] p-1.5 rounded-lg text-xs font-bold transition">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* LANGUAGE */}
              <button 
                onClick={toggleLanguage}
                className="h-full px-4.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-950/20 transition flex items-center gap-1.5 text-xs font-bold tracking-wider"
              >
                <Globe className="w-4 h-4 stroke-[1.8]" />
                <span className="text-emerald-500">{lang}</span>
              </button>

              {/* 🛠️ USER PROFILE & CLICKABLE DROPDOWN */}
              <div className="h-full flex items-center pl-2 border-l border-emerald-950/50">
                {session?.user ? (
                  /* group এর পরিবর্তে স্টেট এবং রিফ ট্র্যাকিং ব্যবহার করা হয়েছে */
                  <div ref={dropdownRef} className="relative h-full flex items-center">
                    
                    {/* প্রোফাইল বাটন (ক্লিক করলে ড্রপডাউন টগল হবে) */}
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="h-[42px] px-3 rounded-xl flex items-center gap-2 hover:bg-emerald-950/30 transition border border-transparent hover:border-emerald-900/50 focus:outline-none"
                    >
                      <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-emerald-500/50">
                        <Image
                          src={session.user.image || "https://i.pravatar.cc/150"}
                          alt="User"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                    </button>

                    {/* DROPDOWN MENU (মোবাইল এবং ডেস্কটপ দুটিতেই ক্লিক করলে টগল হবে) */}
                    <div className={`absolute right-0 top-[90%] w-52 rounded-xl border border-emerald-900/60 bg-[#0e1612] shadow-2xl overflow-hidden z-[1000] transition-all duration-200 
                      ${isDropdownOpen 
                        ? 'opacity-100 visible translate-y-0' 
                        : 'opacity-0 invisible translate-y-2'
                      }`}
                    >
                      {/* ইউজার নেম ও রোল ডিসপ্লে */}
                      <div className="p-3 border-b border-emerald-950/60 bg-emerald-950/10">
                        <p className="font-semibold text-gray-200 text-xs truncate">{session.user.name}</p>
                      </div>

                      {/* ১. প্রোফাইল / ড্যাশবোর্ড অপশন */}
                      <Link
                        href={dashboardHref}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-gray-300 hover:text-emerald-400 hover:bg-emerald-950/30 text-xs font-medium transition"
                      >
                        <User className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{isManagement ? "Admin Dashboard" : "User Profile"}</span>
                      </Link>

                      {/* ২. লগআউট অপশন */}
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-red-400 hover:bg-red-950/20 text-xs font-medium transition border-t border-emerald-950/40"
                      >
                        <X className="w-3.5 h-3.5 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>

                  </div>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="mx-2 px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#090d0a] text-xs font-bold tracking-wide uppercase transition duration-200 shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Login</span>
                  </Link>
                )}
              </div>

             

            </div>
          </div>
        </div>
      </div>
    </>
  );
}