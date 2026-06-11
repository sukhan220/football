// // app/layout.tsx
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import SessionProvider from "@/components/SessionProvider";
// import { auth } from "@/auth";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Football News",
//   description: "Latest football news and updates",
// };

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   // সার্ভার সাইড থেকে সেশন ফেচ করা হচ্ছে
//   const session = await auth();

//   return (
//     <html lang="en">
//       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
//         {/* গ্লোবাল সেশন প্রোভাইডার যা পোর্টাল এবং অ্যাডমিন দুই জায়গাতেই এভেইলেবল থাকবে */}
//         <SessionProvider session={session}>
//           {children}
//         </SessionProvider>
//       </body>
//     </html>
//   );
// }

// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { ThemeProvider } from "@/context/ThemeContext"; // আপনার প্রজেক্টের থিম প্রোভাইডার পাথ অনুসারে চেক করে নিবেন
import { SidebarProvider } from "@/context/SidebarContext"; // সাইডবার স্টেট প্রোভাইডার
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Football News",
  description: "Latest football news and updates",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // সার্ভার সাইড থেকে সেশন ফেচ করা হচ্ছে
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200`}>
        
        {/* ১. গ্লোবাল সেশন প্রোভাইডার */}
        <SessionProvider session={session}>
          
          {/* ২. থিম প্রোভাইডার (যাতে ThemeToggleButton লাইট/ডার্ক মোড টগল করতে পারে) */}
          <ThemeProvider>
            
            {/* ৩. সাইডবার প্রোভাইডার (যাতে ড্যাশবোর্ডের হ্যামবার্গার ও সাইডবার কোলাপ্স স্টেট সিঙ্ক থাকে) */}
            <SidebarProvider>
              
              {children}
              
            </SidebarProvider>
          </ThemeProvider>
          
        </SessionProvider>
        
      </body>
    </html>
  );
}