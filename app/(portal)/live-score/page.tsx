"use client";

import React from "react";
import Script from "next/script";

export default function LeaguesWidget() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
      
      {/* ১. ডিসপ্লে ট্যাগ (এটি উইজেটের মূল ডিজাইন বা টেবিলটি স্ক্রিনে দেখাবে) */}
      {/* @ts-ignore */}
      <api-sports-widget data-type="leagues"></api-sports-widget>

      {/* ২. কনফিগারেশন ট্যাগ (এটি ব্যাকগ্রাউন্ডে এপিআই কি কানেক্ট করবে) */}
      {/* @ts-ignore */}
      <api-sports-widget
        data-type="config"
        data-key="3e4f9643f5bd0e25af540a3178d22a16" 
        data-sport="football"
        data-lang="en"
        data-theme="white"
        data-show-errors="true"
      >
      {/* @ts-ignore */}
      </api-sports-widget>

      {/* ৩. উইজেট স্ক্রিপ্ট (কাস্টম ট্যাগগুলোকে সচল করার মেইন ইঞ্জিন) */}
      <Script 
        src="https://widgets.api-sports.io/3.1.0/widgets.js"
        type="module"
        strategy="afterInteractive"
      />
    </div>
  );
}