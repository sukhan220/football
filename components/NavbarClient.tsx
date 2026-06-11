"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { logout } from "@/lib/auth";

import {
  Menu,
  Search,
  User,
  Globe,
  ChevronDown,
  X,
} from "lucide-react";

export default function NavbarClient({ session }: any) {
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [lang, setLang] = useState<"BN" | "EN">("BN");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");

    if (savedLang === "BN" || savedLang === "EN") {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "BN" ? "EN" : "BN"));
  };

  const menu = [
    { label: "খবর (News)", href: "/" },
    { label: "ম্যাচ সূচি (Fixture)", href: "/fixtures" },
    { label: "লাইভ স্কোর (Live)", href: "/live-score" },
  ];

  const topNews = [
    {
      title: "বাংলাদেশ বনাম ভারত লাইভ: টি-২০ বিশ্বকাপে রোমাঞ্চকর লড়াই!",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRZpJtxDl9MIq4M27e6gZRYO4QuB2Yz78XAg&s",
    },
    {
      title:
        "চ্যাম্পিয়ন্স লিগের ফাইনালে মুখোমুখি রিয়াল মাদ্রিদ ও বায়ার্ন",
      image:
        "https://www.aljazeera.com/wp-content/uploads/2023/11/2023-10-03T165235Z_843684383_UP1EJA31AVKI2_RTRMADP_3_SOCCER-CHAMPIONS-UNB-SBR-REPORT-1701170248.jpg?resize=1920%2C1440",
    },
    {
      title:
        "ব্যালন ডি'অর ২০২৬-এর দৌড়ে কে এগিয়ে? দেখে নিন তালিকা",
      image:
        "https://img.olympics.com/images/image/private/t_s_pog_staticContent_hero_xl_2x/f_auto/primary/lfyjdb7ypuxthbwnwg7y",
    },
  ];

  return (
    <>
      {/* TOP HEADER */}
      <header className="w-full border-b border-gray-100 bg-[#0b130e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 py-3 overflow-hidden">
            <Link
              href="/"
              className="shrink-0 group transition duration-300"
            >
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

      {/* MAIN NAVBAR */}
      <div className="sticky top-0 z-[999] bg-[#111c15]/95 backdrop-blur-md border-b border-emerald-950/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center overflow-x-auto scrollbar-hide h-full">
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

            {/* RIGHT */}
            <div className="flex items-center h-full shrink-0 ml-auto">
              {/* Search */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="h-full px-4 text-gray-400 hover:text-emerald-400 hover:bg-emerald-950/20 transition flex items-center justify-center"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Language */}
              <button
                onClick={toggleLanguage}
                className="h-full px-4 text-gray-400 hover:text-emerald-400 hover:bg-emerald-950/20 transition flex items-center gap-1.5 text-xs font-semibold"
              >
                <Globe className="w-4 h-4" />
                <span>{lang}</span>
              </button>

              {/* USER */}
              <div className="h-full flex items-center pl-2 border-l border-emerald-950/50">
                {session?.user ? (
                  <div className="relative group h-full flex items-center">
                    <button className="h-[42px] px-3 rounded-xl flex items-center gap-2 hover:bg-emerald-950/30 transition">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-emerald-500/50">
                        <Image
                          src={
                            session.user.image ||
                            "https://i.pravatar.cc/150"
                          }
                          alt="User"
                          fill
                          className="object-cover"
                        />
                      </div>

                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>

                    <div className="absolute right-0 top-[90%] w-60 rounded-xl border border-emerald-900/60 bg-[#0e1612] shadow-2xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 overflow-hidden z-[1000]">
                      <div className="p-4 border-b border-emerald-950/60">
                        <p className="font-semibold text-gray-200 text-sm truncate">
                          {session.user.name}
                        </p>

                        <p className="text-xs text-gray-500 truncate">
                          {session.user.email}
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-emerald-400 hover:bg-emerald-950/30 text-sm"
                      >
                        <User className="w-4 h-4" />
                        Profile Dashboard
                      </Link>

                      <form action={logout}>
                        <button
                          type="submit"
                          className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-950/20"
                        >
                          Sign Out
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="mx-2 px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#090d0a] text-xs font-bold uppercase transition flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    Login
                  </Link>
                )}
              </div>

              {/* MOBILE MENU */}
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="lg:hidden h-full px-4 text-gray-400 hover:text-emerald-400 hover:bg-emerald-950/20 transition"
              >
                {mobileMenu ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        {showSearch && (
          <div className="border-t border-emerald-950/50 bg-[#0d1511]">
            <div className="max-w-7xl mx-auto p-4">
              <input
                type="text"
                placeholder="Search football news..."
                className="w-full bg-[#111c15] border border-emerald-900/40 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* MOBILE DRAWER */}
        {mobileMenu && (
          <div className="lg:hidden bg-[#0d1511] border-t border-emerald-950/50">
            <div className="flex flex-col">
              {menu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenu(false)}
                  className="px-5 py-4 text-gray-300 border-b border-emerald-950/40 hover:bg-emerald-950/20"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}