// "use client";

// import React from "react";
// import Link from "next/link";
// import { ArrowUpRight } from "lucide-react";

// export default function EMagazineRootPage() {
//   return (
//     <div className="space-y-8 py-4">
//       {/* বড় ব্যানার */}
//       <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-950/50 via-emerald-900/10 to-[#070b08] border border-emerald-500/10 p-8 sm:p-12 flex flex-col justify-center min-h-[280px]">
//         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
//         <span className="text-emerald-500 text-xs font-black tracking-widest uppercase bg-emerald-950/80 border border-emerald-500/20 px-3 py-1 rounded-full w-max mb-4">
//           Official Digital Hub
//         </span>
//         <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-xl">
//           টুর্নামেন্ট ই-ম্যাগাজিন <br /><span className="text-emerald-400">এডিশন ২০২৬</span>
//         </h1>
//         <p className="text-gray-400 text-sm max-w-md mt-3 leading-relaxed">
//           ফিক্সচার, অফিসিয়াল ম্যাচ বল, মাসকট ট্র্যাকিং থেকে শুরু করে আধুনিক টেকনোলজি এবং স্টেডিয়ামের যাবতীয় খুঁটিনাটি এক্সপ্লোর করুন এক ক্লিকেই।
//         </p>
//       </div>

//       {/* কুইক নেভিগেশন সেকশন */}
//       <div>
//         <h2 className="text-lg font-bold text-gray-200 mb-4 tracking-tight">সবগুলো সেকশন এক নজরে</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {[
//             { title: "ম্যাচ ফিক্সচার", desc: "খেলার সময়সূচী ও ভেন্যু", path: "/E-Magazine/fixtures", color: "from-blue-500/10" },
//             { title: "অফিসিয়াল বল", desc: "ডিজাইন ও অ্যারোডাইনামিক্স", path: "/E-Magazine/ball", color: "from-amber-500/10" },
//             { title: "টুর্নামেন্ট মাসকট", desc: "ইতিহাস এবং থিম পরিচিতি", path: "/E-Magazine/mascot", color: "from-purple-500/10" },
//           ].map((item) => (
//             <Link 
//               key={item.title} 
//               href={item.path} 
//               className={`p-5 rounded-2xl bg-gradient-to-r ${item.color} to-transparent border border-emerald-950/60 hover:border-emerald-500/30 transition-all group flex flex-col justify-between h-32`}
//             >
//               <div className="flex justify-between items-start">
//                 <h3 className="font-bold text-gray-200 group-hover:text-emerald-400 transition-colors text-base">{item.title}</h3>
//                 <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//               </div>
//               <p className="text-xs text-gray-500 font-normal">{item.desc}</p>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }