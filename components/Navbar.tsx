

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
    { label: "FIFA World Cup", href: "/E-Magazine" },
    { label: "Score", href: "/live-score" },
  ];

  return (
    <>
      {/* FIXED MAIN NAVIGATION */}
      <div className="fixed top-0 left-0 w-full z-[999] bg-[#111c15]/95 backdrop-blur-md border-b border-emerald-950/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* DESKTOP & MOBILE WRAPPER */}
          <div className="flex items-center justify-between h-[50px] relative">

            {/* 1. MOBILE ONLY: LEFT SIDE HAMBURGER MENU BUTTON */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-400 hover:text-emerald-400 p-1"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* 2. LEFT SIDE: LOGO & NAVIGATION (DESKTOP) */}
            <div className="hidden lg:flex items-center gap-6 h-full">
              {/* DESKTOP LOGO */}
              <Link href="/" className="shrink-0 group transition duration-300">
                <div className="relative w-[120px] h-[35px]">
                  <Image
                    src="/logo.png"
                    alt="Sport88 Logo"
                    fill
                    className="object-contain object-left group-hover:scale-105 transition duration-300"
                  />
                </div>
              </Link>

              {/* DESKTOP MENU ITEMS */}
              <div className="flex items-center h-full">
                {menu.map((item) => {
                  const isLive = item.href === "/live-score";
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="relative shrink-0 px-3.5 h-full flex items-center text-[12px] font-semibold text-gray-200 hover:text-emerald-400 tracking-wide uppercase transition duration-200 group border-b-2 border-transparent hover:border-emerald-500"
                    >
                      <span className="flex items-center gap-1.5">
                        {item.label}
                        {isLive && (
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                          </span>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 3. MOBILE ONLY: ABSOLUTE CENTERED LOGO */}
            <div className="absolute inset-x-0 mx-auto w-[110px] h-[32px] flex items-center justify-center lg:hidden pointer-events-none">
              <Link href="/" className="pointer-events-auto">
                <div className="relative w-[110px] h-[32px]">
                  <Image
                    src="/logo.png"
                    alt="Sport88 Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* 4. RIGHT SIDE ACTIONS (COMMON FOR BOTH MOBILE & DESKTOP) */}
            <div className="flex items-center h-full shrink-0 relative z-10">
              
              {/* SEARCH */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="h-full px-3 text-gray-400 hover:text-emerald-400 hover:bg-emerald-950/20 transition flex items-center justify-center"
              >
                {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4 stroke-[1.8]" />}
              </button>

              {isSearchOpen && (
                <form 
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-[50px] bg-[#0e1612] border border-emerald-900/60 p-3 rounded-b-xl shadow-2xl flex items-center gap-2 z-[1010] min-w-[260px] sm:min-w-[280px] animate-in slide-in-from-top-2 duration-200"
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

              {/* LANGUAGE (Temporarily Commented Out) */}
              {/* 
              <button 
                onClick={toggleLanguage}
                className="h-full px-3 text-gray-400 hover:text-emerald-400 hover:bg-emerald-950/20 transition flex items-center gap-1.5 text-xs font-bold tracking-wider"
              >
                <Globe className="w-4 h-4 stroke-[1.8]" />
                <span className="text-emerald-500">{lang}</span>
              </button> 
              */}

              {/* 🛠️ USER PROFILE & CLICKABLE DROPDOWN */}
              <div className="h-full flex items-center pl-1.5 border-l border-emerald-950/50">
                {session?.user ? (
                  <div ref={dropdownRef} className="relative h-full flex items-center">
                    
                    {/* প্রোফাইল বাটন */}
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="h-[36px] px-1.5 sm:px-2 rounded-lg flex items-center gap-1 hover:bg-emerald-950/30 transition border border-transparent hover:border-emerald-900/50 focus:outline-none"
                    >
                      <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-emerald-500/50">
                        <Image
                          src={session.user.image || "https://i.pravatar.cc/150"}
                          alt="User"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                    </button>

                    {/* DROPDOWN MENU */}
                    <div className={`absolute right-0 top-[90%] w-48 sm:w-52 rounded-xl border border-emerald-900/60 bg-[#0e1612] shadow-2xl overflow-hidden z-[1000] transition-all duration-200 
                      ${isDropdownOpen 
                        ? 'opacity-100 visible translate-y-0' 
                        : 'opacity-0 invisible translate-y-2'
                      }`}
                    >
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
                    className="ml-1 px-2.5 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#090d0a] text-[11px] font-bold tracking-wide uppercase transition duration-200 shadow-md shadow-emerald-500/10 flex items-center gap-1"
                  >
                    <User className="w-3 h-3 stroke-[2.5]" />
                    <span className="hidden sm:inline">Login</span> {/* মোবাইলে ছোট স্ক্রিনে শুধু আইকন দেখাবে রেস্পন্সিভনেস ঠিক রাখতে */}
                  </Link>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* 5. MOBILE ONLY: SLIDEDOWN MENU DRAWER */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0f1913] border-t border-emerald-950/60 py-2 px-4 shadow-inner animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex flex-col gap-1">
              {menu.map((item) => {
                const isLive = item.href === "/live-score";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 text-[13px] font-medium text-gray-300 hover:text-emerald-400 hover:bg-emerald-950/20 rounded-lg transition"
                  >
                    <span>{item.label}</span>
                    {isLive && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </>
  );
}