"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LayoutDashboard, FileText, FolderKanban, Tv2, Users2, Settings2, LogOut, Menu } from "lucide-react";

interface DashboardHamburgerProps {
  role: string;
  pathname: string;
  isCreateNewsPage: boolean;
}

export default function DashboardHamburger({ role, pathname, isCreateNewsPage }: DashboardHamburgerProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: "ড্যাশবোর্ড", href: "/admin/dashboard", icon: LayoutDashboard, show: true },
    { name: "নিউজ ম্যানেজমেন্ট", href: "/admin/articles", icon: FileText, show: true },
    { name: "ক্যাটাগরি কন্ট্রোল", href: "/admin/categories", icon: FolderKanban, show: role !== "WRITER" },
    { name: "লাইভ স্কোর ও ম্যাচ", href: "/admin/matches", icon: Tv2, show: role !== "WRITER" },
    { name: "ইউজার ও রোল", href: "/admin/users", icon: Users2, show: role === "ADMIN" },
    { name: "গ্লোবাল সেটিংস", href: "/admin/settings", icon: Settings2, show: role === "ADMIN" },
  ];

  return (
    <>
      {/* মোবাইল ওভারলে */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* সাইডবার */}
      <aside className={`
        fixed lg:relative z-40 h-[calc(100vh-64px)] lg:h-full w-64 flex-shrink-0 flex-col 
        border-r border-gray-200 bg-white p-4 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        ${isCreateNewsPage ? "hidden" : "flex"}
      `}>
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            if (!item.show) return null;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-zinc-900 text-white shadow-md" 
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* ফুটার লগআউট */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <button 
            onClick={() => signOut({ callbackUrl: "/" })} 
            className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} /> <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* মোবাইল ওপেন বাটন */}
      {!isCreateNewsPage && (
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="lg:hidden fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 text-white shadow-xl hover:bg-zinc-800 transition"
        >
          <Menu size={22} />
        </button>
      )}
    </>
  );
}