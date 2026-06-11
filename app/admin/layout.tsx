

// "use client";

// import { useSidebar } from "@/context/SidebarContext";
// import AppHeader from "@/layout/AppHeader";
// import AppSidebar from "@/layout/AppSidebar";
// import Backdrop from "@/layout/Backdrop";
// import React from "react";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { isExpanded, isHovered, isMobileOpen } = useSidebar();

//   // Dynamic class for main content margin based on sidebar state
//   const mainContentMargin = isMobileOpen
//     ? "ml-0"
//     : isExpanded || isHovered
//     ? "lg:ml-[290px]"
//     : "lg:ml-[90px]";

//   return (
//     <div className="min-h-screen xl:flex">
//       {/* Sidebar and Backdrop */}
//       <AppSidebar />
//       <Backdrop />
//       {/* Main Content Area */}
//       <div
//         className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
//       >
//         {/* Header */}
//         <AppHeader />
//         {/* Page Content */}
//         <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { data: session, status } = useSession();
  const router = useRouter();

  // অনুমোদিত রোলগুলোর লিস্ট
  const allowedRoles = ["ADMIN", "EDITOR", "WRITER"];

  // চেক করা হচ্ছে ইউজারের রোল পারমিটেড কি না
  const hasAccess = session?.user && allowedRoles.includes((session.user as any).role);

  // যদি ইউজার লগইন করা না থাকে বা অথরাইজড রোল না থাকে, তবে হোম পেজে রিডাইরেক্ট করতে পারেন (অপশনাল)
  useEffect(() => {
    if (status !== "loading" && !hasAccess) {
      // আপনি চাইলে রিডাইরেক্ট না করে নিচের মতো করে ব্লকিং স্ক্রিনও দেখাতে পারেন
      // router.push("/"); 
    }
  }, [status, hasAccess, router]);

  // ১. সেশন লোড হওয়ার সময় একটি সুন্দর প্রি-লোডার স্ক্রিন
  if (status === "loading") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0B0F19]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-[#D4AF37]"></div>
      </div>
    );
  }

  // ২. ইউজার যদি অনুমোদিত রোলের না হয়, তবে তাকে অ্যাক্সেস ব্লক স্ক্রিন দেখানো হবে
  if (!hasAccess) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#0B0F19] p-4 text-center">
        <h1 className="text-6xl font-bold text-[#D4AF37] mb-2">403</h1>
        <h2 className="text-xl font-semibold text-white mb-4">অ্যাক্সেস অনুমোদিত নয়!</h2>
        <p className="text-gray-400 max-w-md mb-6">
          এই অ্যাডমিন প্যানেলে প্রবেশ করার অনুমতি আপনার অ্যাকাউন্টের নেই। দয়া করে সঠিক অ্যাকাউন্ট দিয়ে লগইন করুন।
        </p>
        <button 
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
        >
          হোম পেজে ফিরে যান
        </button>
      </div>
    );
  }

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  // ৩. ইউজার অথরাইজড হলে মূল লেআউট রেন্ডার হবে
  return (
    <div className="min-h-screen xl:flex bg-[#0B0F19]">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}