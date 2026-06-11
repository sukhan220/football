


"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react"; // সেশন এবং সাইনআউটের জন্য
import { Dropdown } from "../ui/dropdown/Dropdown";


export default function UserDropdown() {
  const { data: session } = useSession(); // সেশন থেকে ডাটা নিচ্ছি
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // যদি সেশন না থাকে তবে কিছুই রিটার্ন করবে না অথবা লগইন বাটন দেখাতে পারেন
  if (!session) return null;

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image
            width={44}
            height={44}
            src={session.user?.image || "/images/user/owner.jpg"}
            alt="User"
            className="h-full w-full object-cover"
          />
        </span>

        {/* এখানে নাম দেখাচ্ছে */}
        <span className="hidden mr-1 font-medium text-theme-sm md:block">
          {session.user?.name}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path d="M4.3125 8.65625L9 13.3437L13.6875 8.65625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div className="px-3 pb-3 border-b border-gray-200 dark:border-gray-800">
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-white">
            {session.user?.name}
          </span>
          <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
            {session.user?.email}
          </span>
          {/* এখানে রোল দেখাচ্ছে */}
          <span className="mt-1 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase">
             {session.user?.role || "USER"}
          </span>
        </div>

        {/* মেনু আইটেমগুলো... */}
        <ul className="flex flex-col gap-1 pt-3">
           {/* আপনার আগের ড্রপডাউন আইটেমগুলো এখানে থাকবে */}
           
           <li className="mt-2">
             <button
               onClick={() => signOut({ callbackUrl: "/" })}
               className="flex w-full items-center gap-3 px-3 py-2 font-medium text-red-600 rounded-lg hover:bg-red-50 text-theme-sm"
             >
               Sign out
             </button>
           </li>
        </ul>
      </Dropdown>
    </div>
  );
}