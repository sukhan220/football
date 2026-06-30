
"use client";

import React, { useState } from "react";

type Language = "en" | "bn";

type Scenario = {
  id: string;
  type: "offside" | "ONSIDE";
  category: { en: string; bn: string };
  title: { en: string; bn: string };
  desc: { en: string; bn: string };
  svg: React.ReactNode;
};

export default function Ultimate18OffsidePlaybook() {
  const [language, setLanguage] = useState<Language>("bn");

  // প্রতিটি এনিমেশনের জন্য কমন ফুল-ফিল্ড গ্রাউন্ড ব্যাকগ্রাউন্ড
  const renderFullPitchBackground = () => (
    <>
      {/* আউটার বাউন্ডারি ও সবুজ মাঠের আবহ */}
      <rect width="400" height="240" fill="#14100d" rx="8" />
      {/* মেইন টাচলাইন ও গোললাইন */}
      <rect x="20" y="20" width="360" height="200" fill="none" stroke="#ebdccb" strokeWidth="1.5" strokeOpacity="0.15" />
      {/* হাফওয়ে লাইন */}
      <line x1="200" y1="20" x2="200" y2="220" stroke="#ebdccb" strokeWidth="1.5" strokeOpacity="0.15" />
      {/* সেন্টার সার্কেল */}
      <circle cx="200" cy="120" r="30" fill="none" stroke="#ebdccb" strokeWidth="1.5" strokeOpacity="0.15" />
      {/* বাম পাশের ডি-বক্স ও গোলপোস্ট */}
      <rect x="20" y="70" width="45" height="100" fill="none" stroke="#ebdccb" strokeWidth="1.5" strokeOpacity="0.15" />
      <rect x="10" y="95" width="10" height="50" fill="none" stroke="#ebdccb" strokeWidth="1.5" strokeOpacity="0.25" />
      {/* ডান পাশের ডি-বক্স ও গোলপোস্ট */}
      <rect x="335" y="70" width="45" height="100" fill="none" stroke="#ebdccb" strokeWidth="1.5" strokeOpacity="0.15" />
      <rect x="380" y="95" width="10" height="50" fill="none" stroke="#ebdccb" strokeWidth="1.5" strokeOpacity="0.25" />
    </>
  );

  const scenarios: Scenario[] = [
    // ========================================================
    // ক্যাটাগরি ১: অবস্থানগত নিয়ম ও বেসিকস (০১ - ০৩)
    // ========================================================
    {
      id: "01",
      type: "offside",
      category: { en: "The Position", bn: "অবস্থানগত নিয়ম" },
      title: { en: "01. Clear Offside Position", bn: "০১. স্পষ্ট অফসাইড পজিশন" },
      desc: {
        en: "The attacker is closer to the opponent's goal line than the second-last defender at the exact millisecond the ball is kicked.",
        bn: "সতীর্থ বল পাস দেওয়ার মুহূর্তে আক্রমণভাগের খেলোয়াড় প্রতিপক্ষের শেষ ডিফেন্ডারের চেয়ে গোললাইনের বেশি কাছে (সামনে) অবস্থান করছেন।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৫ সেকেন্ডের সমন্বিত ডাইনামিক লুপ */
            
            /* পাসিং সতীর্থ: ০-৪০% পর্যন্ত বল নিয়ে ড্রিবল করে সামনে যাবে, ৪০-৭০% কিক করার পর স্থির, ৭০-১০০% এ থেমে থাকবে */
            @keyframes passerRun01 {
              0% { cx: 50px; cy: 180px; }
              40%, 70% { cx: 105px; cy: 165px; } /* এই পয়েন্টে এসে বল রিলিজ করবে */
              100% { cx: 115px; cy: 160px; }
            }

            /* ফুটবল: ০-৪০% পর্যন্ত পাসারের পায়ের সাথে ড্রিবল হবে। ৪০% এ কিক করার পর বলটা জাস্ট সামান্য একটু আলাদা হবে (cx: 115px), এবং ৪০-৭০% এই পাস মোমেন্টে ফ্রিজ হয়ে লাইন দেখাবে। ৭০-১০০% এ রিসিভারের কাছে যাবে */
            @keyframes ballPass01 {
              0% { cx: 58px; cy: 174px; }
              39% { cx: 113px; cy: 159px; }
              40%, 70% { cx: 125px; cy: 155px; } /* বলটা পা থেকে হালকা ছাড়ার পর এই পজিশনে পস হবে */
              100% { cx: 330px; cy: 110px; }       /* শেষ রিসিভ পয়েন্ট */
            }

            /* ডিফেন্ডার: ০-৪০% পর্যন্ত ট্র্যাক করবে, ৪০-৭০% পস মোমেন্টে স্থির, ৭০-১০০% এ আবার সামনে যাবে */
            @keyframes defRun01 {
              0% { cx: 170px; }
              40%, 70% { cx: 235px; } /* বল ছাড়ার মুহূর্তের ডিফেন্স লাইনের পজিশন */
              100% { cx: 290px; }
            }
            
            /* আক্রমণকারী: ০-৪০% স্প্রিন্ট করে লাইন ব্রেক করবে, ৪০-৭০% অফসাইড জোনে লকড থাকবে */
            @keyframes attRun01 {
              0% { cx: 170px; }
              40%, 70% { cx: 270px; } /* পাসের মুহূর্তে স্পষ্ট অফসাইড */
              100% { cx: 330px; }
            }
            
            /* পস লেয়ার টাইমিং: বল পা থেকে ছাড়ার পর (৪০% থেকে ৭০% এর মধ্যে) লাইন ও টেক্সট ভেসে উঠবে */
            @keyframes uiFade01 {
              0%, 39% { opacity: 0; }
              40%, 69% { opacity: 1; }
              70%, 100% { opacity: 0; }
            }
            
            .player-01-passer { animation: passerRun01 5s infinite linear; }
            .player-01-def { animation: defRun01 5s infinite linear; }
            .player-01-att { animation: attRun01 5s infinite linear; }
            .ball-01 { animation: ballPass01 5s infinite linear; }
            .pause-overlay-01 { animation: uiFade01 5s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* গোলকিপার */}
          <circle cx="370" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" />
          
          {/* মুভিং পাসিং সতীর্থ */}
          <circle cx="50" cy="180" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" className="player-01-passer" />
          
          {/* মুভিং ডিফেন্ডার */}
          <circle cx="170" cy="65" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-01-def" />
          
          {/* আক্রমণকারী খেলোয়াড় */}
          <circle cx="170" cy="110" r="10" fill="#ebdccb" stroke="#ff4a4a" strokeWidth="2" className="player-01-att" />
          
          {/* ফুটবল */}
          <circle cx="58" cy="174" r="4" fill="#ff4a4a" className="ball-01" />
          
          {/* ৪০% থেকে ৭০% টাইমিংয়ের পস ইন্টারফেস (বল ছাড়ার ঠিক পরের মোমেন্ট) */}
          <g className="pause-overlay-01">
            {/* বল ছাড়ার মুহূর্তের ডিফেন্ডার পজিশন (235px) অনুযায়ী লাল অফসাইড ডেডলাইন */}
            <line x1="235" y1="20" x2="235" y2="220" stroke="#ff4a4a" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* স্ক্রিন নোটিফিকেশন বক্স */}
            <rect x="90" y="25" width="220" height="22" fill="#ff4a4a" rx="4" />
            <text x="200" y="40" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ PAUSED: OFFSIDE LINE ACTIVE" : "‖ পস: অফসাইড লাইন সক্রিয়"}
            </text>

            {/* ডিফেন্ডারের মাথার উপরে টেক্সট (235px এ এলাইন্ড) */}
            <text x="235" y="65" fill="#ebdccb" fontSize="7" fontWeight="bold" textAnchor="middle">DEFENSE LINE</text>
            
            {/* আক্রমণকারীর মাথার উপরে টেক্সট (270px এ এলাইন্ড) */}
            <text x="270" y="90" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="middle">OFFSIDE</text>
            
            {/* কিকের অরিজিনাল স্পট রিং (১০৫px ও ১৬৫px পজিশনে পাসারের পায়ের কাছে লকড) */}
            <circle cx="105" cy="165" r="14" fill="none" stroke="#ff4a4a" strokeWidth="1.5" strokeDasharray="3 2" />
          </g>
        </svg>
      )
    },
    {
      id: "02",
      type: "ONSIDE",
      category: { en: "The Position", bn: "অবস্থানগত নিয়ম" },
      title: { en: "02. Level with Last Defender", bn: "০২. ডিফেন্ডারের সাথে সমান্তরাল" },
      desc: {
        en: "The ball is held until the attacker is perfectly level with the defender. At that exact moment, the pass is released and the screen pauses to show ONSIDEity, then continues.",
        bn: "প্লেয়ার যতক্ষণ ডিফেন্ডারের সমান্তরালে না পৌঁছাচ্ছে ততক্ষণ বল ছাড়া হবে না। ঠিক সমান্তরাল হওয়ার মুহূর্তে বল রিলিজ হবে এবং দৃশ্যটি পস (Pause) হয়ে বৈধতা দেখাবে।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৫ সেকেন্ডের একটি সমন্বিত প্রো-লেভেল লুপ */
            
            /* পাসিং সতীর্থ: ০-৪০% পর্যন্ত বল নিয়ে ড্রিবল করে সামনে যাবে, ৪০-৭০% কিক করার পর স্থির, ৭০-১০০% এ থেমে থাকবে */
            @keyframes passerRun02 {
              0% { cx: 50px; cy: 180px; }
              40%, 70% { cx: 105px; cy: 165px; } /* এই পয়েন্টে এসে বল রিলিজ করবে */
              100% { cx: 115px; cy: 160px; }
            }

            /* ফুটবল: ০-৪০% পাসারের পায়ের সাথে (৫৮px থেকে ১১৩px) ড্রিবল হবে। ৪০% এ আলগা হওয়ার পর পস হবে, ৭০-১০০% এ রিসিভারের কাছে যাবে */
            @keyframes ballPass02 {
              0% { cx: 58px; cy: 174px; }
              39% { cx: 113px; cy: 159px; }
              40%, 70% { cx: 125px; cy: 155px; } /* বল পা থেকে হালকা ছাড়ার পর এই পজিশনে পস */
              100% { cx: 330px; cy: 140px; }       /* শেষ রিসিভ পয়েন্ট */
            }

            /* ডিফেন্ডার: ০-৪০% পর্যন্ত দৌড়াবে, ৪০-৭০% পস মোমেন্টে স্থির (২৩৫px), ৭০-১০০% এ আবার সামনে যাবে */
            @keyframes defRun02 {
              0% { cx: 170px; }
              40%, 70% { cx: 235px; } /* বল ছাড়ার মুহূর্তের ডিফেন্স লাইনের পজিশন */
              100% { cx: 290px; }
            }
            
            /* আক্রমণকারী (অনসাইড রান): ০-৪০% স্প্রিন্ট করে ঠিক ডিফেন্ডারের লাইনে (২৩৫px) পৌঁছাবে, ৪০-৭০% পস থাকবে */
            @keyframes attRun02 {
              0% { cx: 140px; }
              40%, 70% { cx: 235px; } /* ঠিক ডিফেন্ডারের সাথে সমান্তরাল (Level) */
              100% { cx: 330px; }
            }
            
            /* UI ইন্ডিকেটর এবং গ্রিন লাইন: ৪০% থেকে ৭০% এর মধ্যে জ্বলবে */
            @keyframes uiFade02 {
              0%, 39% { opacity: 0; }
              40%, 69% { opacity: 1; }
              70%, 100% { opacity: 0; }
            }
            
            .player-02-passer { animation: passerRun02 5s infinite linear; }
            .player-02-def { animation: defRun02 5s infinite linear; }
            .player-02-att { animation: attRun02 5s infinite linear; }
            .ball-02-obj { animation: ballPass02 5s infinite linear; }
            .pause-overlay-02 { animation: uiFade02 5s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* গোলকিপার */}
          <circle cx="370" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" />
          
          {/* মুভিং পাসিং সতীর্থ */}
          <circle cx="50" cy="180" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" className="player-02-passer" />
          
          {/* মুভিং ডিফেন্ডার (যিনি অফসাইড লাইন তৈরি করছেন) */}
          <circle cx="170" cy="65" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-02-def" />
          
          {/* আক্রমণকারী (যে সমান্তরাল হয়ে দৌড়াচ্ছে) */}
          <circle cx="140" cy="140" r="10" fill="#ebdccb" stroke="#10b981" strokeWidth="2.5" className="player-02-att" />
          
          {/* ফুটবল */}
          <circle cx="58" cy="174" r="4" fill="#10b981" className="ball-02-obj" />
          
          {/* ৪০% থেকে ৭০% টাইমিংয়ের পস মোমেন্ট ভিজ্যুয়াল লেয়ার */}
          <g className="pause-overlay-02">
            {/* প্লেয়ার ও ডিফেন্ডার যে একদম একই লাইনে (235px) আছে তা প্রমাণের সবুজ ডেডলাইন */}
            <line x1="235" y1="20" x2="235" y2="220" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* প্লেয়ার ও ডিফেন্ডারকে কানেক্ট করার বোল্ড সবুজ ইন্ডিকেটর */}
            <line x1="235" y1="65" x2="235" y2="140" stroke="#10b981" strokeWidth="3" />
            
            {/* স্ক্রিন নোটিফিকেশন বক্স */}
            <rect x="90" y="25" width="220" height="22" fill="#10b981" rx="4" />
            <text x="200" y="40" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ PAUSED: LEVEL AT RELEASE" : "‖ পস: বল রিলিজের সময় সমান্তরাল"}
            </text>

            {/* ডিফেন্ডারের মাথার উপরে টেক্সট */}
            <text x="235" y="65" fill="#ebdccb" fontSize="7" fontWeight="bold" textAnchor="middle">DEFENSE LINE</text>
            
            {/* আক্রমণকারীর মাথার উপরে টেক্সট */}
            <text x="235" y="115" fill="#10b981" fontSize="7" fontWeight="black" textAnchor="middle">LEVEL (ONSIDE)</text>
            
            {/* কিকের অরিজিনাল স্পট রিং */}
            <circle cx="105" cy="165" r="14" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
          </g>
        </svg>
      )
    },
    {
      id: "03",
      type: "ONSIDE",
      category: { en: "The Position", bn: "অবস্থানগত নিয়ম" },
      title: { en: "03. Safe Inside Own Half", bn: "০৩. নিজের অর্ধেক মাঠে অবস্থান" },
      desc: {
        en: "An attacker cannot be offside if they are still on their side of the halfway line when the ball is kicked, regardless of where the defenders are standing.",
        bn: "বল পাস করার মুহূর্তে আক্রমণকারী যদি নিজের মাঠের সীমানার ভেতরে (হাফলাইনের পেছনে) থাকেন, তবে ডিফেন্ডাররা যেখানেই থাকুক না কেন তিনি অনসাইড বলে গণ্য হবেন।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৫ সেকেন্ডের একটি সমন্বিত প্রো-লেভেল লুপ */
            
            /* পাসিং সতীর্থ */
            @keyframes passerRun03 {
              0% { cx: 40px; cy: 180px; }
              40%, 70% { cx: 85px; cy: 170px; }
              100% { cx: 100px; cy: 165px; }
            }

            /* ফুটবল */
            @keyframes ballPass03 {
              0% { cx: 48px; cy: 174px; }
              39% { cx: 93px; cy: 164px; }
              40%, 70% { cx: 105px; cy: 160px; }
              100% { cx: 260px; cy: 120px; }
            }

            /* ডিফেন্ডার */
            @keyframes defRun03 {
              0% { cx: 120px; }
              40%, 70% { cx: 160px; }
              100% { cx: 220px; }
            }
            
            /* আক্রমণকারী */
            @keyframes attRun03 {
              0% { cx: 110px; }
              40%, 70% { cx: 170px; }
              100% { cx: 260px; }
            }
            
            /* UI ইন্ডিকেটর লেয়ার */
            @keyframes uiFade03 {
              0%, 39% { opacity: 0; }
              40%, 69% { opacity: 1; }
              70%, 100% { opacity: 0; }
            }
            
            .player-03-passer { animation: passerRun03 5s infinite linear; }
            .player-03-def { animation: defRun03 5s infinite linear; }
            .player-03-att { animation: attRun03 5s infinite linear; }
            .ball-03 { animation: ballPass03 5s infinite linear; }
            .pause-overlay-03 { animation: uiFade03 5s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* গোলকিপার */}
          <circle cx="370" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" />
          
          {/* মুভিং পাসিং সতীর্থ */}
          <circle cx="40" cy="180" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" className="player-03-passer" />
          
          {/* মুভিং ডিফেন্ডার */}
          <circle cx="120" cy="65" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-03-def" />
          
          {/* আক্রমণকারী খেলোয়াড় */}
          <circle cx="110" cy="120" r="10" fill="#ebdccb" stroke="#10b981" strokeWidth="2.5" className="player-03-att" />
          
          {/* ফুটবল */}
          <circle cx="48" cy="174" r="4" fill="#10b981" className="ball-03" />
          
          {/* ৪০% থেকে ৭০% টাইমিংয়ের পস মোমেন্ট ভিজ্যুয়াল লেয়ার */}
          <g className="pause-overlay-03">
            {/* মাঝমাঠের মূল হাফলাইন লাইন (২০০px) */}
            <line x1="200" y1="20" x2="200" y2="220" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* স্ক্রিন নোটিফিকেশন বক্স */}
            <rect x="90" y="25" width="220" height="22" fill="#10b981" rx="4" />
            <text x="200" y="40" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ PAUSED: INSIDE OWN HALF" : "‖ পস: নিজের অর্ধে থাকায় অনসাইড"}
            </text>

            {/* হাফলাইন টেক্সট মার্কার: ওভারল্যাপ এড়াতে এটিকে একদম নিচে (y="215") নামিয়ে দেওয়া হলো */}
            <text x="200" y="215" fill="#ebdccb" fontSize="7" fontWeight="bold" textAnchor="middle">HALFWAY LINE</text>
            
            {/* আক্রমণকারীর মাথার উপরে টেক্সট */}
            <text x="170" y="102" fill="#10b981" fontSize="7" fontWeight="black" textAnchor="middle">SAFE (OWN HALF)</text>
            
            {/* ডিফেন্ডার মার্কার টেক্সট: ওপরের জ্যাম কাটাতে এটিকে ডিফেন্ডারের নিচে (y="86") সেট করা হলো */}
            <text x="160" y="86" fill="#ff4a4a" fontSize="6" fontWeight="bold" textAnchor="middle">DEFENDER ADVANCED</text>
            
            {/* কিকের অরিজিনাল স্পট রিং */}
            <circle cx="85" cy="170" r="14" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
          </g>
        </svg>
      )
    },

    // ========================================================
    // ক্যাটাগরি ২: সক্রিয় অংশগ্রহণ ও প্রভাব (০৪ - ০৮) - [০৫, ০৬, ০৭ ফিক্সড]
    // ========================================================
   {
      id: "04",
      type: "offside",
      category: { en: "Active Play", bn: "সক্রিয় অংশগ্রহণ" },
      title: { en: "04. Interfering: Direct Touch", bn: "০৪. সরাসরি বল স্পর্শ করা" },
      desc: {
        en: "At the moment of the pass, the attacker is just slightly ahead of the second-last opponent. With only the goalkeeper left ahead, touching the ball completes the offside offence.",
        bn: "বল পাস দেওয়ার মুহূর্তে আক্রমণকারী খেলোয়াড় সেকেন্ড ম্যান (শেষ ডিফেন্ডার) থেকে হালকা একটু সামনে আছেন। সামনে আর পর্যাপ্ত ২ জন খেলোয়াড় না থাকায় সরাসরি বল স্পর্শ করলেই অফসাইড।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৫ সেকেন্ডের কো-অর্ডিনেটেড ইউনিফর্ম লুপ */
            
            /* পাসিং সতীর্থ: ০-৪০% ড্রিবল রান, ৪০-৭০% পস কিক, ৭০-১০০% ফলোথ্রু */
            @keyframes passerRun04 {
              0% { cx: 50px; cy: 180px; }
              40%, 70% { cx: 105px; cy: 165px; } 
              100% { cx: 115px; cy: 160px; }
            }

            /* ফুটবল: ০-৪০% ড্রিবল, ৪০-৭০% কিক রিলিজের পর পস, ৭০-১০০% রিসিভ জোনে ট্রাভেল */
            @keyframes ballPass04 {
              0% { cx: 58px; cy: 174px; }
              39% { cx: 113px; cy: 159px; }
              40%, 70% { cx: 125px; cy: 155px; } 
              100% { cx: 320px; cy: 110px; }
            }

            /* ২য় বিপক্ষ (ডিফেন্ডার): ০-৪০% ট্র্যাকিং রান, ৪০-৭০% পস (২৪০px), ৭০-১০০% রিকভারি রান */
            @keyframes defRun04 {
              0% { cx: 180px; }
              40%, 70% { cx: 240px; } 
              100% { cx: 290px; }
            }
            
            /* আক্রমণকারী: ০-৪০% স্প্রিন্ট করে ডিফেন্ডার থেকে সামান্য সামনে (২৫৫px) যাবে, ৪০-৭০% পস */
            @keyframes attRun04 {
              0% { cx: 165px; }
              40%, 70% { cx: 255px; } 
              100% { cx: 320px; }
            }
            
            /* UI এবং অফসাইড লাইন ট্র্যাকিং: ৪০% থেকে ৭০% এর মধ্যে ভিজিবল */
            @keyframes uiFade04 {
              0%, 39% { opacity: 0; }
              40%, 69% { opacity: 1; }
              70%, 100% { opacity: 0; }
            }
            
            .player-04-passer { animation: passerRun04 5s infinite linear; }
            .player-04-def { animation: defRun04 5s infinite linear; }
            .player-04-att { animation: attRun04 5s infinite linear; }
            .ball-04-obj { animation: ballPass04 5s infinite linear; }
            .pause-overlay-04 { animation: uiFade04 5s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* ১ম বিপক্ষ খেলোয়াড়: গোলকিপার (গোললাইনের কাছে স্থির) */}
          <circle cx="375" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" />
          
          {/* মুভিং পাসিং সতীর্থ খেলোয়াড় */}
          <circle cx="50" cy="180" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" className="player-04-passer" />
          
          {/* মুভিং ২য় বিপক্ষ খেলোয়াড় (সেকেন্ড ম্যান ডিফেন্ডার) */}
          <circle cx="180" cy="70" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-04-def" />
          
          {/* অফসাইড পজিশনে থাকা আক্রমণকারী খেলোয়াড় */}
          <circle cx="165" cy="110" r="10" fill="#ebdccb" stroke="#ff4a4a" strokeWidth="2.5" className="player-04-att" />
          
          {/* ফুটবল */}
          <circle cx="58" cy="174" r="4" fill="#ff4a4a" className="ball-04-obj" />
          
          {/* ৪০% থেকে ৭০% টাইমিংয়ের পস মোমেন্ট ভিজ্যুয়াল লেয়ার */}
          <g className="pause-overlay-04">
            {/* সেকেন্ড ম্যানকে বেস করে টানা লাল অফসাইড ডেডলাইন (২৪০px) */}
            <line x1="240" y1="20" x2="240" y2="220" stroke="#ff4a4a" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* স্ক্রিন নোটিফিকেশন বক্স */}
            <rect x="90" y="25" width="220" height="22" fill="#ff4a4a" rx="4" />
            <text x="200" y="40" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ PAUSED: OFFSIDE POSITION" : "‖ পস: অফসাইড পজিশন"}
            </text>

            {/* গোলকিপার হাইলাইট ও টেক্সট */}
            <circle cx="375" cy="120" r="14" fill="none" stroke="#ff4a4a" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x="375" y="144" fill="#ff4a4a" fontSize="7" fontWeight="bold" textAnchor="middle">1st MAN </text>
            
            {/* সেকেন্ড... ম্যান মার্কার (ওভারল্যাপ এড়াতে ডিফেন্ডারের নিচে নিখুঁত গ্যাপে সেট করা) */}
            <text x="240" y="94" fill="#ebdccb" fontSize="7" fontWeight="black" textAnchor="middle">2nd MAN DEFENDER</text>
            
            {/* আক্রমণকারীর মাথার ওপর অফসাইড নোটিশ */}
            <text x="255" y="132" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="middle">OFFSIDE</text>

            {/* কিকের অরিজিনাল স্পট রিং */}
            <circle cx="105" cy="165" r="14" fill="none" stroke="#ff4a4a" strokeWidth="1.5" strokeDasharray="3 2" />
          </g>
        </svg>
      )
    },
   {
      id: "05",
      type: "offside",
      category: { en: "Active Play", bn: "সক্রিয় অংশগ্রহণ" },
      title: { en: "05. Blocking Keeper's Vision", bn: "০৫. গোলকিপারের দৃষ্টি কমানো" },
      desc: {
        en: "At the exact moment the teammate takes a shot, the attacker is already in an offside position, standing directly on the keeper's line of sight to block their vision.",
        bn: "সতীর্থ খেলোয়াড় দূর থেকে শট নেওয়ার (বল ছাড়ার) মুহূর্তে আক্রমণকারী অলরেডি অফসাইড পজিশনে সরাসরি গোলকিপারের দৃষ্টিরেখার ওপর দাঁড়িয়ে আছেন, যা শট দেখার মূল পথটি ব্লক করে দেয়।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৫ সেকেন্ডের কো-অর্ডিনেটেড নিখুঁত ইউনিফর্ম লুপ */
            
            /* শট নেওয়া সতীর্থ: ০-৪০% ড্রিবল রান, ৪০-৭০% পস কিক, ৭০-১০০% ফলোথ্রু */
            @keyframes shooterRun05 {
              0% { cx: 50px; cy: 180px; }
              40%, 70% { cx: 105px; cy: 165px; } 
              100% { cx: 115px; cy: 160px; }
            }

            /* ফুটবল: ০-৪০% ড্রিবল, ৪০-৭০% কিক রিলিজের পর পস, ৭০-১০০% জোরালো শটে গোলের দিকে ধাবমান */
            @keyframes shotAndPause05 {
              0% { cx: 58px; cy: 174px; }
              39% { cx: 113px; cy: 159px; }
              40%, 70% { cx: 125px; cy: 155px; } 
              100% { cx: 385px; cy: 120px; }
            }
            
            /* ২য় বিপক্ষ (ডিফেন্ডার): ০-৪০% ট্র্যাকিং রান, ৪০-৭০% পস (২৭০px), ৭০-১০০% রিকভারি */
            @keyframes defRun05 {
              0% { cx: 210px; }
              40%, 70% { cx: 270px; }
              100% { cx: 310px; }
            }

            /* অফসাইড প্লেয়ার: ০-৪০% কিপারের সামনে পজিশন নেওয়ার জন্য মুভ করবে, ৪০-৭০% দৃষ্টিরেখায় লক থাকবে, ৭০-১০০% ডিস্টার্ব করবে */
            @keyframes keeperVision05 {
              0% { cx: 325px; cy: 150px; }
              40%, 70% { cx: 340px; cy: 138px; } /* পস মোমেন্টে কিপারের দৃষ্টিরেখার ওপর নিখুঁত লক */
              85% { cx: 338px; cy: 155px; }      
              100% { cx: 342px; cy: 120px; }
            }
            
            /* UI, টেক্সট এবং ভিশন কোন ট্র্যাকিং: ঠিক ৪০% থেকে ৬৯% এর মধ্যে দৃশ্যমান হবে */
            @keyframes uiFade05 {
              0%, 39% { opacity: 0; pointer-events: none; }
              40%, 69% { opacity: 1; }
              70%, 100% { opacity: 0; pointer-events: none; }
            }
            
            .player-05-shooter { animation: shooterRun05 5s infinite linear; }
            .player-05-def { animation: defRun05 5s infinite linear; }
            .player-05-off { animation: keeperVision05 5s infinite ease-in-out; }
            .ball-05-obj { animation: shotAndPause05 5s infinite linear; }
            .pause-overlay-05 { animation: uiFade05 5s infinite linear; }
            .offside-line-05 { animation: uiFade05 5s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* ১ম বিপক্ষ খেলোয়াড়: গোলকিপার (গোললাইনের কাছে স্থির) */}
          <circle cx="375" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" />
          
          {/* মুভিং শট করা খেলোয়াড় */}
          <circle cx="50" cy="180" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" className="player-05-shooter" />
          
          {/* মুভিং ২য় বিপক্ষ খেলোয়াড় (শেষ ডিফেন্ডার) */}
          <circle cx="210" cy="60" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-05-def" />
          
          {/* অফসাইড পজিশনে মুভ করা আক্রমণকারী খেলোয়াড় */}
          <circle cx="325" cy="150" r="10" fill="#ebdccb" stroke="#ff4a4a" strokeWidth="2.5" className="player-05-off" />
          
          {/* ফুটবল */}
          <circle cx="58" cy="174" r="4" fill="#ff4a4a" className="ball-05-obj" />
          
          {/* অফসাইড ডিফেন্স ডেডলাইন লাইন (২৭০px): আর্লি রেন্ডারিং ফিক্সড */}
          <line x1="270" y1="20" x2="270" y2="220" stroke="#ff4a4a" strokeWidth="2" strokeDasharray="4 4" className="offside-line-05" />
          
          {/* ৪০% থেকে ৭০% টাইমিংয়ের পস মোメント ভিজ্যুয়াল লেয়ার */}
          <g className="pause-overlay-05">
            {/* গোলকিপারের দৃষ্টির সীমানা (Vision Cone) - পস মোমেন্টেই শুধু অন হবে */}
            <polygon points="375,120 285,105 295,165" fill="#ff4a4a" opacity="0.15" />
            {/* সেন্ট্রাল ভিশন ফোকাস লাইন */}
            <line x1="375" y1="120" x2="290" y2="138" stroke="#ff4a4a" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* স্ক্রিন নোটিফিকেশন বক্স */}
            <rect x="90" y="25" width="220" height="22" fill="#ff4a4a" rx="4" />
            <text x="200" y="40" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ PAUSED: VISION BLOCKED ON SHOT" : "‖ পস: বল ছাড়ার সময় দৃষ্টি ব্লক"}
            </text>

            {/* টেক্সট ইন্ডিকেটরসমূহ নিখুঁত এলাইনমেন্টে */}
            <text x="340" y="95" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="middle">OFFSIDE PLAYER</text>
            <text x="270" y="95" fill="#ebdccb" fontSize="7" fontWeight="bold" textAnchor="middle">2nd MAN (DEF)</text>
            <text x="375" y="145" fill="#4a5568" fontSize="7" fontWeight="bold" textAnchor="middle">1st MAN (GK)</text>

            {/* দৃষ্টির অ্যালার্ট টেক্সট */}
            <text x="365" y="80" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="end" letterSpacing="0.5">VISION BLOCKED</text>

            {/* শট নেওয়ার স্পট রিং */}
            <circle cx="105" cy="165" r="14" fill="none" stroke="#ff4a4a" strokeWidth="1.5" strokeDasharray="3 2" />
          </g>
        </svg>
      )
    },
   {
      id: "06",
      type: "offside",
      category: { en: "Active Play", bn: "সক্রিয় অংশগ্রহণ" },
      title: { en: "06. Physical Challenge for Ball", bn: "০৬. বল কেড়ে নেওয়ার চ্যালেঞ্জ" },
      desc: {
        en: "At the moment of the pass, the attacker is in an offside position. After the ball is released, they run back and physically challenge the defender to win the ball, which is a clear offence.",
        bn: "সতীর্থ বল ছাড়ার সময় আক্রমণকারী স্পষ্ট অফসাইড পজিশনে থাকেন। পাসটি দেওয়ার পর সে ডিফেন্ডারের দিকে ধেয়ে যায় এবং ফিজিক্যাল চ্যালেঞ্জ বা ধাক্কা দিয়ে বলটি কেড়ে নেওয়ার চেষ্টা করে।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৫ সেকেন্ডের কো-অর্ডিনেটেড নিখুঁত ইউনিফর্ম লুপ */
            
            /* পাসিং সতীর্থ: ০-৪০% ড্রিবল রান, ৪০-৭০% পস কিক, ৭০-১০০% ফলোথ্রু */
            @keyframes passerRun06 {
              0% { cx: 40px; cy: 185px; }
              40%, 70% { cx: 95px; cy: 165px; } 
              100% { cx: 105px; cy: 160px; }
            }

            /* ফুটবল: ০-৪০% সতীর্থের পায়ে, ৪০-৭০% পস, ৭০-৮০% ডিফেন্ডারের দিকে ট্রাভেল, ৮০-৯০% চ্যালেঞ্জের পর ছিটকে যাওয়া */
            @keyframes passAndTackleBall06 {
              0% { cx: 48px; cy: 179px; }
              39% { cx: 103px; cy: 159px; }
              40%, 70% { cx: 115px; cy: 155px; } 
              80% { cx: 215px; cy: 130px; } /* ডিফেন্ডার সামনে এসে যেখানে বল রিসিভ করবে */     
              90% { cx: 180px; cy: 145px; } /* ট্যাকলের পর বল ছিটকে যাওয়ার পজিশন */     
              100% { cx: 150px; cy: 155px; }
            }
            
            /* বিপক্ষ ডিফেন্ডার: ০-৪০% পজিশন হোল্ড, ৪০-৭০% পস (২৭০px), ৭০-৮০% বল রিসিভ করতে সামনে এগিয়ে আসবে (২১৫px এ) */
            @keyframes defForwardRun06 {
              0%, 39% { cx: 270px; cy: 120px; }
              40%, 70% { cx: 270px; cy: 120px; } /* পস মোমেন্টে অফসাইড লাইন তৈরি করছে */
              80% { cx: 215px; cy: 130px; }       /* বল রিসিভ করতে সামনে এগিয়ে আসা */
              85% { cx: 218px; cy: 132px; }       /* ধাক্কা খাওয়ার রিয়্যাকশন */
              100% { cx: 240px; cy: 125px; }
            }

            /* আমাদের অফসাইড আক্রমণকারী: ০-৪০% রান করে ডিফেন্স লাইনের গভীরে (৩০০px), ৪০-৭০% পস, ৭০-৮০% তেড়ে এসে সামনে এগিয়ে আসা ডিফেন্ডারকে চার্জ করবে */
            @keyframes runAndTackle06 {
              0% { cx: 220px; cy: 100px; }
              40%, 70% { cx: 300px; cy: 115px; } /* পসের মুহূর্তে স্পষ্ট অফসাইড পজিশন */
              80% { cx: 222px; cy: 128px; }       /* এগিয়ে আসা ডিফেন্ডারকে বল কেড়ে নিতে ফিজিক্যাল চ্যালেঞ্জ */
              100% { cx: 190px; cy: 140px; }
            }

            /* ফিজিক্যাল ক্ল্যাশের স্পার্ক ইফেক্ট (ঠিক ৮০% থেকে ৮৯% ফ্রেমের মধ্যে অন হবে) */
            @keyframes clashSpark06 {
              0%, 79% { opacity: 0; transform: scale(0.5); }
              80%, 88% { opacity: 1; transform: scale(1); }
              89%, 100% { opacity: 0; transform: scale(0.5); }
            }
            
            /* UI এবং টেক্সট ট্র্যাকিং: ঠিক ৪০% থেকে ৬৯% এর মধ্যে দৃশ্যমান */
            @keyframes uiFade06 {
              0%, 39% { opacity: 0; pointer-events: none; }
              40%, 69% { opacity: 1; }
              70%, 100% { opacity: 0; pointer-events: none; }
            }
            
            .player-06-passer { animation: passerRun06 5s infinite linear; }
            .player-06-def { animation: defForwardRun06 5s infinite linear; }
            .player-06-att { animation: runAndTackle06 5s infinite linear; }
            .ball-06 { animation: passAndTackleBall06 5s infinite linear; }
            .spark-06 { animation: clashSpark06 5s infinite ease-out; transform-origin: 218px 130px; }
            .pause-overlay-06 { animation: uiFade06 5s infinite linear; }
            .offside-line-06 { animation: uiFade06 5s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* ১ম বিপক্ষ খেলোয়াড়: গোলকিপার (স্থির) */}
          <circle cx="375" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" />

          {/* বিপক্ষ ডিফেন্ডার (বল রিসিভ করতে সামনে আসবে) */}
          <circle cx="270" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-06-def" />
          
          {/* বল পাস করা সতীর্থ খেলোয়াড় */}
          <circle cx="40" cy="185" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" className="player-06-passer" />
          
          {/* অফসাইড পজিশন থেকে এসে ধাক্কা দিয়ে বল কেড়ে নেওয়া আক্রমণকারী খেলোয়াড় */}
          <circle cx="220" cy="100" r="10" fill="#ebdccb" stroke="#ff4a4a" strokeWidth="2.5" className="player-06-att" />
          
          {/* ফুটবল */}
          <circle cx="48" cy="179" r="4" fill="#ff4a4a" className="ball-06" />
          
          {/* ট্যাকল বা ফিজিক্যাল কলিশন (সংঘর্ষ) ইফেক্ট - রান টাইমে ঠিক ২১৮,১৩০ কো-অর্ডিনেটে হিট করবে */}
          <g className="spark-06">
            <path d="M 218,120 L 218,140 M 208,130 L 228,130 M 211,123 L 225,137 M 211,137 L 225,123" stroke="#ff4a4a" strokeWidth="2.5" />
            <circle cx="218" cy="130" r="6" fill="#ff4a4a" opacity="0.4" />
            <text x="218" y="156" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="middle">ILONSIDE CHALLENGE</text>
          </g>

          {/* অফসাইড ডিফেন্স ডেডলাইন লাইন (২৭০px): পস মোমেন্টের ডিফেন্ডার পজিশন অনুযায়ী লকিং */}
          <line x1="270" y1="20" x2="270" y2="220" stroke="#ff4a4a" strokeWidth="2" strokeDasharray="4 4" className="offside-line-06" />

          {/* ৪০% থেকে ৭০% টাইমিংয়ের পস মোমেন্ট ভিজ্যুয়াল লেয়ার */}
          <g className="pause-overlay-06">
            {/* স্ক্রিন নোটিফিকেশন বক্স */}
            <rect x="90" y="25" width="220" height="22" fill="#ff4a4a" rx="4" />
            <text x="200" y="40" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ PAUSED: OFFSIDE POSITION ON PASS" : "‖ পস: বল ছাড়ার সময় অফসাইড"}
            </text>

            {/* টেক্সট ইন্ডিকেটরসমূহ ওভারল্যাপ ছাড়া সুন্দর এলাইনমেন্টে */}
            <text x="270" y="95" fill="#ebdccb" fontSize="7" fontWeight="bold" textAnchor="middle">2nd MAN (DEF)</text>
            <text x="315" y="95" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="middle">OFFSIDE AT PASS</text>
            <text x="375" y="145" fill="#4a5568" fontSize="7" fontWeight="bold" textAnchor="middle">1st MAN (GK)</text>

            {/* কিকের এনার্জি রিং */}
            <circle cx="95" cy="165" r="14" fill="none" stroke="#ff4a4a" strokeWidth="1.5" strokeDasharray="3 2" />
          </g>
        </svg>
      )
    },
    {
      id: "07",
      type: "offside",
      category: { en: "Active Play", bn: "সক্রিয় অংশগ্রহণ" },
      title: { en: " WOODWORK AND REBOUND", bn: "০৭. গোলপোস্টে লেগে ফেরত আসা" },
      desc: {
        en: "Woodwork (Rebound of any goalpost): a player in an offside position at the moment the ball is played or touched by a team-mate touches the ball which rebounds or is deflected off the woodwork (goalpost).",
        bn: "গোলপোস্টে লেগে ফেরত আসা: সতীর্থের পাস দেওয়ার মুহূর্তে কোনো খেলোয়াড় অফসাইড পজিশনে থাকলে, গোলপোস্টে লেগে ফেরত আসা বলটি ওই খেলোয়াড় স্পর্শ করলে অফসাইড বলে গণ্য হবে।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৫ সেকেন্ডের কো-অর্ডিনেটেড ইউনিফর্ম লুপ */
            
            /* শট নেওয়া সতীর্থ: ০-৪০% ড্রিবল ও রান, ৪০-৭০% পস কিক, ৭০-১০০% ফলোথ্রু */
            @keyframes shooterRun07 {
              0% { cx: 50px; cy: 175px; }
              40%, 70% { cx: 110px; cy: 160px; } 
              100% { cx: 125px; cy: 155px; }
            }

            /* ফুটবল: ০-৪০% ড্রিবল, ৪০-৭০% পস, ৭০-৮০% শটে পোস্টে আঘাত (৩৮০, ৯৫), ৮০-৯০% রিবাউন্ড হয়ে অফসাইড প্লেয়ারের কাছে (২৯৫, ১৪০) */
            @keyframes ballRebound07 {
              0% { cx: 58px; cy: 169px; }
              39% { cx: 118px; cy: 154px; }
              40%, 70% { cx: 125px; cy: 150px; } 
              80% { cx: 380px; cy: 95px; }  /* গোলপোস্টে হিট করার মোমেন্ট */
              90% { cx: 295px; cy: 140px; }  /* অফসাইড প্লেয়ারের পায়ে রিবাউন্ড বল */
              90%, 100% { cx: 295px; cy: 140px; }  /* বল প্লেয়ারের পায়ে থাকবে */
            }
            
            /* বিপক্ষ ডিফেন্ডার: ০-৪০% ট্র্যাকিং ব্যাক রান, ৪০-৭০% পস (২৫০px এ অফসাইড লাইন লক), ৭০-১০০% বলের দিকে ঘোরার চেষ্টা */
            @keyframes defRun07 {
              0% { cx: 200px; cy: 80px; }
              40%, 70% { cx: 250px; cy: 75px; }
              100% { cx: 275px; cy: 85px; }
            }

            /* গোলকিপার: ০-৪০% পজিশনিং, ৪০-৭০% পস, ৭০-৮০% শটের দিকে হালকা মুভ, ৮০-১০০% পরাস্ত হওয়া */
            @keyframes keeperDive07 {
              0% { cx: 375px; cy: 120px; }
              40%, 70% { cx: 375px; cy: 120px; }
              80% { cx: 380px; cy: 100px; } /* পোস্টের শটের দিকে হালকা মুভ */
              100% { cx: 370px; cy: 115px; }
            }

            /* অফসাইড আক্রমণকারী: ০-৪০% রান করে ডিফেন্স লাইনের ওপারে, ৪০-৭০% পস, ৭০-৯০% রিবাউন্ড বল রিসিভ করতে মুভ করা */
            @keyframes attackerShoot07 {
              0% { cx: 210px; cy: 130px; }
              40%, 70% { cx: 290px; cy: 145px; } /* পসের মুহূর্তে স্পষ্ট অফসাইড */
              90% { cx: 295px; cy: 140px; }       /* রিবাউন্ড বল স্পর্শ করার মুহূর্ত */
              100% { cx: 295px; cy: 140px; }       /* বল প্লেয়ারের পায়ে থাকবে */
            }
            
            /* রিবাউন্ড বা বারে লাগার স্পার্ক ইফেক্ট (ঠিক ৮০% থেকে ৮৮% এর মধ্যে জ্বলবে) */
            @keyframes postSpark07 {
              0%, 79% { opacity: 0; transform: scale(0.5); }
              80%, 87% { opacity: 1; transform: scale(1); }
              88%, 100% { opacity: 0; }
            }
            
            /* UI এবং টেক্সট ট্র্যাকিং: ঠিক ৪০% থেকে ৬৯% এর মধ্যে দৃশ্যমান */
            @keyframes uiFade07 {
              0%, 39% { opacity: 0; pointer-events: none; }
              40%, 69% { opacity: 1; }
              70%, 100% { opacity: 0; pointer-events: none; }
            }
            
            .player-07-shooter { animation: shooterRun07 5s infinite linear; }
            .player-07-def { animation: defRun07 5s infinite linear; }
            .player-07-gk { animation: keeperDive07 5s infinite ease-in-out; }
            .player-07-att { animation: attackerShoot07 5s infinite linear; }
            .ball-07 { animation: ballRebound07 5s infinite linear; }
            .spark-07 { animation: postSpark07 5s infinite ease-out; transform-origin: 380px 95px; }
            .pause-overlay-07 { animation: uiFade07 5s infinite linear; }
            .offside-line-07 { animation: uiFade07 5s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* ১ম বিপক্ষ খেলোয়াড়: গোলকিপার */}
          <circle cx="375" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-07-gk" />

          {/* ২য় বিপক্ষ খেলোয়াড়: শেষ ডিফেন্ডার */}
          <circle cx="200" cy="80" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-07-def" />
          
          {/* শট নেওয়ার জন্য আমাদের সতীর্থ প্লেয়ার */}
          <circle cx="50" cy="175" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" className="player-07-shooter" />
          
          {/* অফসাইড পজিশনে অলরেডি দাঁড়িয়ে থাকা প্লেয়ার যে রিবাউন্ড বলের দিকে যাবে */}
          <circle cx="210" cy="130" r="10" fill="#ebdccb" stroke="#ff4a4a" strokeWidth="2.5" className="player-07-att" />
          
          {/* ফুটবল */}
          <circle cx="58" cy="169" r="4" fill="#ff4a4a" className="ball-07" />
          
          {/* গোলপোস্টে বা বারে হিট করার সংঘর্ষ (স্পার্ক) ইফেক্ট */}
          <g className="spark-07">
            <circle cx="380" cy="95" r="8" fill="none" stroke="#ff4a4a" strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M 375,90 L 385,100 M 385,90 L 375,100" stroke="#ff4a4a" strokeWidth="2" />
            <text x="345" y="100" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="end">WOODWORK HITS!</text>
          </g>

          {/* শট নেওয়ার মুহূর্তের অফসাইড লাইন (২৫০px) */}
          <line x1="250" y1="20" x2="250" y2="220" stroke="#ff4a4a" strokeWidth="2" strokeDasharray="4 4" className="offside-line-07" />
          
          {/* ৪০% থেকে ৭০% টাইমিংয়ের পস মোমেন্ট ভিজ্যুয়াল লেয়ার */}
          <g className="pause-overlay-07">
            {/* স্ক্রিন নোটিফিকেশন বক্স */}
            <rect x="90" y="25" width="220" height="22" fill="#ff4a4a" rx="4" />
            <text x="200" y="40" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ PAUSED: OFFSIDE POSITION ON SHOT" : "‖ পস: শট নেওয়ার মুহূর্তে অফসাইড"}
            </text>

            {/* টেক্সট ইন্ডিকেটরসমূহ */}
            <text x="250" y="60" fill="#ebdccb" fontSize="7" fontWeight="bold" textAnchor="middle">2nd MAN (DEF)</text>
            <text x="295" y="170" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="middle">OFFSIDE PLAYER</text>
            <text x="375" y="140" fill="#4a5568" fontSize="7" fontWeight="bold" textAnchor="middle">1st MAN (GK)</text>

            {/* শট নেওয়ার স্পট রিং */}
            <circle cx="110" cy="160" r="14" fill="none" stroke="#ff4a4a" strokeWidth="1.5" strokeDasharray="3 2" />
          </g>
        </svg>
      )
    },
    {
      id: "08",
      type: "offside",
      category: { en: "Active Play", bn: "সক্রিয় অংশগ্রহণ" },
      title: { en: "08. Intercepting a GK Save", bn: "০৮. গোলকিপারের সেভ থেকে আসা" },
      desc: {
        en: "An attacker gathers the ball after the goalkeeper makes a deliberate reflex save from an initial shot.",
        bn: "গোলকিপার কোনো শট হাত দিয়ে ঠেকিয়ে দেওয়ার পর (Save) সেই রিবাউন্ড বল অফসাইড প্লেয়ার লুফে নিলে অফসাইড হবে।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৫ সেকেন্ডের কো-অর্ডিনেটেড ইউনিফর্ম লুপ */
            
            /* শট নেওয়া সতীর্থ: ০-৪০% রান, ৪০-৭০% পস কিক */
            @keyframes shooterRun08 {
              0% { cx: 40px; cy: 180px; }
              40%, 70% { cx: 100px; cy: 165px; } 
              100% { cx: 110px; cy: 160px; }
            }

            /* ফুটবল: ০-৪০% ড্রিবল, ৪০-৭০% পস, ৭০-৮০% কিপারের হাতে হিট, ৮০-৯০% কিপার থেকে রিবাউন্ড হয়ে অফসাইড প্লেয়ারের কাছে */
            @keyframes ballSave08 {
              0% { cx: 48px; cy: 174px; }
              39% { cx: 108px; cy: 159px; }
              40%, 70% { cx: 115px; cy: 155px; } 
              80% { cx: 360px; cy: 120px; }  /* কিপারের সেভ মোমেন্ট */
              90% { cx: 290px; cy: 145px; }  /* অফসাইড প্লেয়ারের পায়ে রিবাউন্ড বল */
              100% { cx: 290px; cy: 145px; }
            }
            
            /* গোলকিপার: ৮০% মোমেন্টে হাত বাড়িয়ে সেভ করবে */
            @keyframes keeperReflex08 {
              0%, 75% { transform: scale(1); }
              80%, 85% { transform: scale(1.2); }
              90%, 100% { transform: scale(1); }
            }

            /* ডিফেন্স: ০-৪০% পজিশন, ৪০-৭০% পস (অফসাইড লাইন লক), ৭০-৯০% রিবাউন্ড বলের দিকে মুভ করা */
            @keyframes defMove08 {
              0% { cx: 240px; cy: 130px; }
              40%, 70% { cx: 240px; cy: 130px; }
              90% { cx: 270px; cy: 140px; }
              100% { cx: 270px; cy: 140px; }
            }

            /* অফসাইড আক্রমণকারী: ০-৪০% রান করে পজিশন নেওয়া, ৪০-৭০% পস, ৮০-৯০% রিবাউন্ড বল রিসিভ করা */
            @keyframes attackerGather08 {
              0% { cx: 220px; cy: 130px; }
              40%, 70% { cx: 290px; cy: 145px; } /* পসের মুহূর্তে অফসাইড পজিশন */
              100% { cx: 290px; cy: 145px; }      /* বল রিসিভ করে পায়ের কাছে */
            }
            
            /* UI এবং টেক্সট ট্র্যাকিং: ঠিক ৪০% থেকে ৬৯% এর মধ্যে দৃশ্যমান */
            @keyframes uiFade08 {
              0%, 39% { opacity: 0; pointer-events: none; }
              40%, 69% { opacity: 1; }
              70%, 100% { opacity: 0; pointer-events: none; }
            }
            
            .player-08-shooter { animation: shooterRun08 5s infinite linear; }
            .player-08-gk { animation: keeperReflex08 5s infinite; transform-origin: 360px 120px; }
            .player-08-def { animation: defMove08 5s infinite linear; }
            .player-08-att { animation: attackerGather08 5s infinite linear; }
            .ball-08 { animation: ballSave08 5s infinite linear; }
            .pause-overlay-08 { animation: uiFade08 5s infinite linear; }
            .offside-line-08 { animation: uiFade08 5s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* গোলকিপার */}
          <circle cx="360" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-08-gk" />
          
          {/* ডিফেন্স */}
          <circle cx="240" cy="130" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-08-def" />

          {/* শট নেওয়া সতীর্থ */}
          <circle cx="40" cy="180" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" className="player-08-shooter" />
          
          {/* অফসাইড প্লেয়ার */}
          <circle cx="220" cy="130" r="10" fill="#ebdccb" stroke="#ff4a4a" strokeWidth="2.5" className="player-08-att" />
          
          {/* ফুটবল */}
          <circle cx="48" cy="174" r="4" fill="#ff4a4a" className="ball-08" />

          {/* অফসাইড লাইন */}
          <line x1="240" y1="20" x2="240" y2="220" stroke="#ff4a4a" strokeWidth="2" strokeDasharray="4 4" className="offside-line-08" />
          
          {/* পস মোমেন্ট ভিজ্যুয়াল */}
          <g className="pause-overlay-08">
            <rect x="90" y="25" width="220" height="22" fill="#ff4a4a" rx="4" />
            <text x="200" y="40" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle">
              {language === "en" ? "‖ PAUSED: OFFSIDE POSITION ON SHOT" : "‖ পস: শট নেওয়ার মুহূর্তে অফসাইড"}
            </text>
            <text x="240" y="115" fill="#4a5568" fontSize="7" fontWeight="bold" textAnchor="middle">DEF</text>
          </g>
        </svg>
      )
    },

    // ========================================================
    // ক্যাটাগরি ৩: ডিফেন্স ও ট্যাকটিকাল অ্যাকশন (০৯ - ১১)
    // ========================================================
   {
      id: "09",
      type: "ONSIDE",
      category: { en: "Defense Action", bn: "ডিফেন্ডার অ্যাকশন" },
      title: { en: "09. Deliberate Play by Defender", bn: "০৯. ডিফেন্ডারের স্বেচ্ছাকৃত ব্যাকপাস" },
      desc: {
        en: "If a defender purposefully controls and passes the ball but misplaces it, the offside phase is totally reset.",
        bn: "কোনো ডিফেন্ডার যদি বল ক্লিয়ার করতে গিয়ে সম্পূর্ণ নিজের ইচ্ছায় ব্যাকপাস বা মিস-কিক করেন, তবে অফসাইড প্লেয়ার সেই বল ধরলে তা বৈধ (NOT OFFSIDE)।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৫ সেকেন্ডের কো-অর্ডিনেটেড ইউনিফর্ম লুপ */
            
            /* পাস ভুল করা ডিফেন্ডার-১: ০-৪০% বলের দিকে এগিয়ে আসা, ৪০-৭০% পস ও ভুল ব্যাকপাস কিক */
            @keyframes defOnePass09 {
              0% { cx: 170px; cy: 75px; }
              40%, 70% { cx: 210px; cy: 90px; } 
              100% { cx: 220px; cy: 100px; }
            }

            /* অফসাইড লাইন ধরে রাখা ডিফেন্ডার-২ */
            @keyframes defTwoLine09 {
              0% { cx: 240px; cy: 40px; }
              40%, 70% { cx: 240px; cy: 40px; } 
              100% { cx: 250px; cy: 45px; }
            }

            /* গোলকিপার */
            @keyframes keeperWatch09 {
              0%, 70% { cx: 370px; cy: 120px; }
              85%, 100% { cx: 360px; cy: 125px; }
            }

            /* ফুটবল: ০-৪০% ডিফেন্ডারের কাছে আসা, ৪০-৭০% পস, ৭০-৯০% ভুল ব্যাকপাস হয়ে প্লেয়ারের পায়ে */
            @keyframes ballMisplaced09 {
              0% { cx: 150px; cy: 65px; }
              39% { cx: 202px; cy: 86px; }
              40%, 70% { cx: 215px; cy: 95px; } 
              90%, 100% { cx: 300px; cy: 140px; } 
            }

            /* আমাদের আক্রমণকারী */
            @keyframes attackerRun09 {
              0% { cx: 220px; cy: 150px; }
              40%, 70% { cx: 280px; cy: 145px; } 
              90%, 100% { cx: 300px; cy: 140px; } 
            }

            /* আক্রমণকারীর বর্ডার কালার চেঞ্জ: ৯০% এ বল পাওয়ার সাথে সাথে সবুজ (ONSIDE) হবে */
            @keyframes attackerColor09 {
              0%, 89% { stroke: #ff4a4a; fill: #ebdccb; }
              90%, 100% { stroke: #10b981; fill: #ebdccb; }
            }

            /* ফুটবল কালার চেঞ্জ: ৯০% এ প্লেয়ারের পায়ে পৌঁছানোর পর সবুজ হবে */
            @keyframes ballColor09 {
              0%, 89% { fill: #ff4a4a; }
              90%, 100% { fill: #10b981; }
            }
            
            /* শুরুতে অফসাইড পজিশনের পস অ্যালার্ট (৪০% থেকে ৭০%) */
            @keyframes uiFade09 {
              0%, 39% { opacity: 0; pointer-events: none; }
              40%, 69% { opacity: 1; }
              70%, 100% { opacity: 0; pointer-events: none; }
            }

            /* বল পাওয়ার পর লিগ্যাল প্লে-এর সবুজ সাকসেস মেসেজ (৯০% থেকে ১০০%) */
            @keyframes ONSIDEFade09 {
              0%, 89% { opacity: 0; pointer-events: none; }
              90%, 100% { opacity: 1; }
            }
            
            .player-09-def1 { animation: defOnePass09 5s infinite linear; }
            .player-09-def2 { animation: defTwoLine09 5s infinite linear; }
            .player-09-gk { animation: keeperWatch09 5s infinite ease-in-out; }
            .player-09-att { animation: attackerRun09 5s infinite linear, attackerColor09 5s infinite linear; }
            .ball-09 { animation: ballMisplaced09 5s infinite linear, ballColor09 5s infinite linear; }
            .pause-overlay-09 { animation: uiFade09 5s infinite linear; }
            .offside-line-09 { animation: uiFade09 5s infinite linear; }
            .ONSIDE-overlay-09 { animation: ONSIDEFade09 5s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* গোলকিপার (বিপক্ষ) */}
          <circle cx="370" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-09-gk" />

          {/* ডিফেন্ডার-২ (অফসাইড লাইন মার্কার) */}
          <circle cx="240" cy="40" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-09-def2" />

          {/* ডিফেন্ডার-১ (যে ভুল ব্যাকপাস দেবে) */}
          <circle cx="210" cy="90" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-09-def1" />
          
          {/* আমাদের আক্রমণকারী (ডাইনামিক কালার) */}
          <circle cx="220" cy="150" r="10" className="player-09-att" strokeWidth="2.5" />
          
          {/* ফুটবল (ডাইনামিক কালার) */}
          <circle cx="150" cy="65" r="4" className="ball-09" />

          {/* শুরুতে অফসাইড পজিশন দেখানোর জন্য লাল ড্যাশড লাইন */}
          <line x1="240" y1="20" x2="240" y2="220" stroke="#ff4a4a" strokeWidth="2" strokeDasharray="4 4" className="offside-line-09" />
          
          {/* পস মোমেন্ট লেয়ার (শুরুতে অফসাইড এলার্ট) */}
          <g className="pause-overlay-09">
            <rect x="90" y="25" width="220" height="22" fill="#ff4a4a" rx="4" />
            <text x="200" y="40" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ PAUSED: PLAYER IN OFFSIDE POSITION" : "‖ পস: খেলোয়াড় অফসাইড পজিশনে"}
            </text>
            <text x="240" y="15" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="middle">OFFSIDE LINE</text>
            <text x="175" y="110" fill="#4a5568" fontSize="7" fontWeight="bold" textAnchor="middle">DEF 1 (DELIBERATE PLAY)</text>
          </g>

          {/* বল পাওয়ার পর সবুজ লেয়ার (প্লে বৈধ মেসেজ) */}
          <g className="ONSIDE-overlay-09">
            <rect x="90" y="25" width="270" height="22" fill="#10b981" rx="4" />
            <text x="220" y="40" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "ONSIDE: DEFENDER BACKPASS RESETS OFFSIDE" : "বৈধ: ডিফেন্ডারের ব্যাকপাসে অফসাইড বাতিল"}
            </text>
            <text x="300" y="123" fill="#10b981" fontSize="8" fontWeight="black" textAnchor="middle">ON SIDE</text>
          </g>
        </svg>
      )
    },
    {
      id: "10",
      type: "offside",
      category: { en: "Defense Action", bn: "ডিফেন্ডার অ্যাকশন" },
      title: { en: "10. Deflection or Defective Block", bn: "১০. অনিচ্ছাকৃত রিফ്ലেক্স ডিফ্লেকশন" },
      desc: {
        en: "An un-deliberate deflection or quick block by a defender does not reset offside. If it reaches the attacker, it's a whistle.",
        bn: "ডিফেন্ডার অনিচ্ছাকৃতভাবে বল শুধু block করতে গিয়ে যদি বলের দিক পরিবর্তন হয়ে অফসাইড প্লেয়ারের কাছে যায়, তবে সেটি অফসাইডই থাকবে (OFFSIDE MAINTAINED)।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৫ সেকেন্ডের কো-অর্ডিনেটেড নিখুঁত রানিং লুপ */
            
            /* পাসিং সতীর্থ: ড্রিবল করে কিক নেওয়ার জন্য এগিয়ে যাওয়া */
            @keyframes shooterRun10 {
              0% { cx: 45px; cy: 190px; }
              40%, 70% { cx: 100px; cy: 175px; } 
              100% { cx: 120px; cy: 170px; }
            }

            /* ফুটবল: ০-৪০% ড্রিবল, ৪০-৭০% পস, ৮০% এ ডিফেন্ডারের গায়ে লেগে ডিফ্লেক্ট, ৮০-১০০% অফসাইড প্লেয়ারের রানিং পজিশনে পৌঁছানো */
            @keyframes ballDeflect10 {
              0% { cx: 53px; cy: 184px; }
              39% { cx: 108px; cy: 169px; }
              40%, 70% { cx: 115px; cy: 165px; } 
              80% { cx: 215px; cy: 125px; }  /* ডিফেন্ডার ব্লক মোমেন্ট */
              100% { cx: 245px; cy: 165px; } /* রানিং আক্রমণকারীর পায়ে বল মিট করা */
            }
            
            /* মাঝের ডিফেন্ডার (DEF 1): ব্লক করার জন্য পজিশন নেওয়া ও সামান্য রি-অ্যাকশন */
            @keyframes defOneBlock10 {
              0% { cx: 195px; cy: 115px; }
              40%, 70% { cx: 215px; cy: 125px; } 
              80% { cx: 217px; cy: 127px; }       
              100% { cx: 222px; cy: 130px; }
            }

            /* উপরের ডিফেন্ডার (DEF 2): অফসাইড ট্র্যাপ লাইন হোল্ড করবে */
            @keyframes defTwoLine10 {
              0% { cx: 190px; cy: 60px; }
              40%, 70% { cx: 215px; cy: 65px; }  
              100% { cx: 250px; cy: 68px; }
            }

            /* গোলকিপার: পজিশন ট্র্যাকিং */
            @keyframes keeperWatch10 {
              0%, 70% { cx: 370px; cy: 120px; }
              100% { cx: 360px; cy: 128px; }
            }

            /* আমাদের আক্রমণকারী (অফসাইড প্লেয়ার): থেমে না থেকে অনবরত রানিং মোশনে থাকবে */
            @keyframes attackerRun10 {
              0% { cx: 185px; cy: 175px; }
              40%, 70% { cx: 226px; cy: 170px; } /* পসের মুহূর্তে জাস্ট লাইন পার হয়ে রানিং (২২৬px > ২১৫px) */
              80% { cx: 235px; cy: 168px; }       /* ডিফ্লেকশনের সময়ও সে রানিং অবস্থায় বলের দিকে এগোচ্ছে */
              100% { cx: 245px; cy: 165px; }      /* শেষ মুহূর্ত পর্যন্ত বলসহ রানিং এগিয়ে যাওয়া */
            }
            
            /* ডিফ্লেকশন স্পার্ক ইফেক্ট */
            @keyframes deflectSpark10 {
              0%, 79% { opacity: 0; transform: scale(0.5); }
              80%, 87% { opacity: 1; transform: scale(1); }
              88%, 100% { opacity: 0; }
            }

            /* UI পস মোমেন্ট লেয়ার */
            @keyframes uiFade10 {
              0%, 39% { opacity: 0; pointer-events: none; }
              40%, 69% { opacity: 1; }
              70%, 100% { opacity: 0; pointer-events: none; }
            }
            
            .player-10-shooter { animation: shooterRun10 5s infinite linear; }
            .player-10-def1 { animation: defOneBlock10 5s infinite linear; }
            .player-10-def2 { animation: defTwoLine10 5s infinite linear; }
            .player-10-gk { animation: keeperWatch10 5s infinite ease-in-out; }
            .player-10-att { animation: attackerRun10 5s infinite linear; }
            .ball-10 { animation: ballDeflect10 5s infinite linear; }
            .spark-10 { animation: deflectSpark10 5s infinite ease-out; transform-origin: 215px 125px; }
            .pause-overlay-10 { animation: uiFade10 5s infinite linear; }
            .offside-line-10 { animation: uiFade10 5s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* গোলকিপার */}
          <circle cx="370" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-10-gk" />

         
          <circle cx="190" cy="60" r="10" fill="#ebdccb" stroke="lightgreen" strokeWidth="2.5" className="player-10-def2" />

          {/* ডিফেন্ডার ১ (মাঝখানের ডিফেন্ডার - রিফ্লেক্স ব্লক) */}
          <circle cx="195" cy="115" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-10-def1" />
          
          {/* পাসিং সতীর্থ */}
          <circle cx="45" cy="190" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" className="player-10-shooter" />
          
          {/* আক্রমণকারী খেলোয়াড় (অনবরত রানিং মোশনে অ্যানিমেটেড) */}
          <circle cx="185" cy="175" r="10" fill="#ebdccb" stroke="#ff4a4a" strokeWidth="2.5" className="player-10-att" />
          
          {/* ফুটবল */}
          <circle cx="53" cy="184" r="4" fill="#ff4a4a" className="ball-10" />

          {/* অফসাইড লাইন (২১৫px) */}
          <line x1="215" y1="20" x2="215" y2="220" stroke="#ff4a4a" strokeWidth="2" strokeDasharray="4 4" className="offside-line-10" />
          
          {/* ডিফ্লেকশন স্পার্ক */}
          <g className="spark-10">
            <circle cx="215" cy="125" r="8" fill="none" stroke="#ff4a4a" strokeWidth="1.5" strokeDasharray="2 2" />
            <path d="M 210,120 L 220,130 M 220,120 L 210,130" stroke="#ff4a4a" strokeWidth="2" />
            <text x="215" y="108" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="middle">DEFLECTION</text>
          </g>

          {/* পস মোমেন্ট লেয়ার */ }
          <g className="pause-overlay-10">
            <rect x="90" y="25" width="220" height="22" fill="#ff4a4a" rx="4" />
            <text x="200" y="40" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ PAUSED: OFFSIDE ON UN-DELIBERATE BLOCK" : "‖ পস: অনিচ্ছাকৃত ব্লকেও অফসাইড বহাল"}
            </text>

            <text x="215" y="15" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="middle">OFFSIDE LINE</text>
            <text x="215" y="148" fill="#4a5568" fontSize="7" fontWeight="bold" textAnchor="middle">DEF (NO DELIBERATE PLAY)</text>
            <text x="240" y="195" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="middle">OFFSIDE PLAYER</text>

            <circle cx="100" cy="175" r="14" fill="none" stroke="#ff4a4a" strokeWidth="1.5" strokeDasharray="3 2" />
          </g>
        </svg>
      )
    },
    {
      id: "11",
      type: "ONSIDE",
      category: { en: "Tactical Setup", bn: "ট্যাকটিকাল পজিশন" },
      title: { en: "11. Behind the Ball Line", bn: "১১. বলের লাইনের পেছনে থাকা" },
      desc: {
        en: "Even if there are no defenders, if the receiver is behind the ball at the exact time of the pass, they are onside.",
        bn: "সামনে কোনো ডিফেন্ডার না থাকলেও, পাস দেওয়ার মুহূর্তে রিসিভার প্লেয়ার যদি বলের পজিশন থেকে পেছনে (Behind the Ball) থাকেন, তবে তা সম্পূর্ণ বৈধ (ONSIDE)।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৫ সেকেন্ডের কো-অর্ডিনেটেড নিখুঁত রানিং ও স্মুথ পাসিং লুপ */
            
            /* বল হোল্ডার সতীর্থ: ডি-বক্সের গভীরে (৩৬০px) গিয়ে স্কোয়ার পাস দিবে এবং রান সচল রাখবে */
            @keyframes ballHolderRun11 {
              0% { cx: 250px; cy: 155px; }
              40%, 70% { cx: 360px; cy: 150px; } /* পস মোমেন্ট */
              100% { cx: 380px; cy: 145px; }     /* পসের পর সামনে রান */
            }

            /* ফুটবল: ০-৪০% পর্যন্ত হোল্ডারের পায়ে লেগে স্মুথলি ট্রাভেল করবে, হুট করে পজিশন জাম্প করবে না */
            @keyframes ballPath11 {
              0% { cx: 258px; cy: 150px; }
              30% { cx: 335px; cy: 146px; }       /* ড্রিবল ট্র্যাকিং স্মুথ করার জন্য */
              40%, 70% { cx: 355px; cy: 142px; }  /* পস মোমেন্ট: সরাসরি রিসিভার প্লেয়ার বরাবর নিখুঁতভাবে ল্যান্ডেড */
              85% { cx: 360px; cy: 80px; }       /* প্লেয়ারের পায়ে বল কন্ট্রোল */
              100% { cx: 365px; cy: 75px; }      /* বল সহ প্লেয়ার গোলপোস্টের দিকে রান করছে */
            }

            /* রিসিভার সতীর্থ: অনবরত রানিং, পস মোমেন্টে সে বলের লাইনের (৩৬০px) পেছনে (৩৫০px) থাকবে এবং বলটি সরাসরি নিজের কাছে রিসিভ করবে */
            @keyframes receiverRun11 {
              0% { cx: 230px; cy: 85px; }
              40%, 70% { cx: 350px; cy: 80px; }  /* বল সরাসরি এই পজিশনে প্লেয়ার বরাবর আসবে */
              100% { cx: 365px; cy: 75px; }      /* পাস নেওয়ার পর বল সহ গোলের দিকে স্প্রিন্ট রান */
            }
            
            /* বিপক্ষ গোলকিপার: সামনে চার্জ করতে গিয়ে ব্যর্থ হয়ে মাটিতে পড়ে যাবে */
            @keyframes keeperCharge11 {
              0% { cx: 375px; cy: 120px; rx: 10; ry: 10; }
              35% { cx: 355px; cy: 135px; rx: 10; ry: 10; } 
              40%, 70% { cx: 352px; cy: 155px; rx: 14; ry: 5; } /* মাটিতে ফ্ল্যাট হয়ে পড়ে আছে */
              100% { cx: 360px; cy: 155px; rx: 14; ry: 5; }
            }

            /* তাড়া করা বিপক্ষ ডিফেন্ডার ১ */
            @keyframes defOneRun11 {
              0% { cx: 195px; cy: 70px; }
              40%, 70% { cx: 300px; cy: 72px; }
              100% { cx: 340px; cy: 70px; }
            }

            /* তাড়া করা বিপক্ষ ডিফেন্ডার ২ */
            @keyframes defTwoRun11 {
              0% { cx: 215px; cy: 115px; }
              40%, 70% { cx: 315px; cy: 118px; }
              100% { cx: 350px; cy: 115px; }
            }

            /* তাড়া করা বিপক্ষ ডিফেন্ডার ৩ */
            @keyframes defThreeRun11 {
              0% { cx: 205px; cy: 175px; }
              40%, 70% { cx: 310px; cy: 170px; }
              100% { cx: 345px; cy: 165px; }
            }

            /* বলের পজিশন ট্র্যাকিং লাইন ভিজ্যুয়াল */
            @keyframes lineFade11 {
              0%, 39% { opacity: 0; pointer-events: none; }
              40%, 69% { opacity: 1; }
              70%, 100% { opacity: 0; pointer-events: none; }
            }
            
            .player-11-holder { animation: ballHolderRun11 5s infinite linear; }
            .player-11-receiver { animation: receiverRun11 5s infinite linear; }
            .player-11-gk { animation: keeperCharge11 5s infinite linear; }
            .player-11-def1 { animation: defOneRun11 5s infinite linear; }
            .player-11-def2 { animation: defTwoRun11 5s infinite linear; }
            .player-11-def3 { animation: defThreeRun11 5s infinite linear; }
            .ball-11 { animation: ballPath11 5s infinite linear; }
            .ball-line-11 { animation: lineFade11 5s infinite linear; }
            .pause-overlay-11 { animation: lineFade11 5s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* তাড়া করা বিপক্ষ ডিফেন্ডার দল */}
          <circle cx="195" cy="70" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-11-def1" />
          <circle cx="215" cy="115" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-11-def2" />
          <circle cx="205" cy="175" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-11-def3" />

          {/* বিপক্ষ গোলকিপার */}
          <ellipse cx="375" cy="120" rx="10" ry="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-11-gk" />
          
          {/* আমাদের ১মা আক্রমণকারী (বল হোল্ডার) */}
          <circle cx="250" cy="155" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" className="player-11-holder" />
          
          {/* আমাদের ২য় আক্রমণকারী (রিসিভার সতীর্থ) */}
          <circle cx="230" cy="85" r="10" fill="#ebdccb" stroke="#10b981" strokeWidth="2.5" className="player-11-receiver" />
          
          {/* ফুটবল */}
          <circle cx="258" cy="150" r="4" fill="#10b981" className="ball-11" />

          {/* বলের অবস্থান অনুযায়ী লকিং বল লাইন (৩৬০px - পাস দেওয়ার মুহূর্তে বলের ফ্রন্টলাইন) */}
          <line x1="360" y1="20" x2="360" y2="220" stroke="#10b981" strokeWidth="2" strokeDasharray="5 4" className="ball-line-11" />
          
          {/* পস মোমেন্ট লেয়ার */}
          <g className="pause-overlay-11">
            {/* স্ক্রিন নোটিফিকেশন বক্স */}
            <rect x="90" y="25" width="220" height="22" fill="#10b981" rx="4" />
            <text x="200" y="40" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ PAUSED: ONSIDE (DIRECT PASS TO PLAYER)" : "‖ পস: অনসাইড (সরাসরি প্লেয়ার বরাবর পাস)"}
            </text>

            {/* গাইডিং টেক্সট */}
            <text x="360" y="15" fill="#10b981" fontSize="7" fontWeight="black" textAnchor="middle">BALL LINE</text>
            <text x="315" y="70" fill="#10b981" fontSize="7" fontWeight="black" textAnchor="middle">ONSIDE RECEIVER</text>
            <text x="345" y="173" fill="#ff4a4a" fontSize="6.5" fontWeight="bold" textAnchor="middle">GK BEATEN & FELL</text>

            {/* পাসিং ডিরেকশন এরো */}
            <path d="M 358,140 L 350,92" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrow)" />
          </g>
        </svg>
      )
    },

    // ========================================================
    // ক্যাটাগরি ৪: ৭টি সুনির্দিষ্ট ডাইরেক্ট ব্যতিক্রম (১২ - ১৮)
    // ========================================================
    {
      id: "12",
      type: "ONSIDE",
      category: { en: "Exception", bn: "ব্যতিক্রমী নিয়ম" },
      title: { en: "12. Exception 1: Direct Throw-In", bn: "১২. ব্যতিক্রম ১: সরাসরি থ্রো-ইন" },
      desc: {
        en: "Law 11 explicitly states there is no offside offence if a player receives the ball directly from a throw-in, even if they run into an offside position before the throw.",
        bn: "থ্রো-ইন নেওয়ার আগে বা নেওয়ার মুহূর্তে সতীর্থ প্লেয়ার রান করে অফসাইড পজিশনে ঢুকে বল রিসিভ করলেও থ্রো-ইনের ব্যতিক্রমী নিয়মের কারণে তা সম্পূর্ণ বৈধ (ONSIDE)।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৬ সেকেন্ডের নিখুঁত চেইন-অ্যাকশন ও ফুল বডি মুভমেন্ট লুপ */

            /* ১. থ্রো-ইন দাতা: পুরো লুপ জুড়েই সে হালকা পজিশনাল মুভমেন্ট করবে (দাঁড়িয়ে থাকবে না) */
            @keyframes throwerAction12 {
              0% { cx: 245px; cy: 20px; }
              25% { cx: 252px; cy: 21px; }
              45% { cx: 250px; cy: 20px; } /* এই মুহূর্তে থ্রো রিলিজ */
              70% { cx: 248px; cy: 19px; } /* পস মোমেন্টেও হালকা মুভমেন্ট */
              100% { cx: 245px; cy: 20px; }
            }

            /* ২. ফুটবল: ৪৫% পর্যন্ত থ্রোয়ারের হাতে ট্র্যাক করবে, তারপর বাতাসে ভাসবে */
            @keyframes ballFlight12 {
              0% { cx: 245px; cy: 24px; r: 4px; }
              25% { cx: 252px; cy: 25px; r: 4px; }
              45% { cx: 240px; cy: 18px; r: 7.5px; }         /* থ্রো এর মুহূর্ত */
              70% { cx: 240px; cy: 18px; r: 7.5px; }       /* বাতাসে ভাসমান (প্যারাবোলিক আর্ক) */
              85%, 100% { cx: 350px; cy: 110px; r: 4px; }   /* প্লেয়ারের পায়ে ল্যান্ডেড */
            }

            /* ৩. সতীর্থ প্লেয়ার (রিসিভার): অনসাইড থেকে অফসাইড জোনে ডাইনামিক স্প্রিন্ট রান */
            @keyframes receiverSprint12 {
              0% { cx: 230px; cy: 115px; }                 /* শুরুতে অনসাইডে (Safe Zone) */
              25% { cx: 270px; cy: 115px; }                /* ডিফেন্স লাইনের দিকে এগোচ্ছে */
              45% { cx: 310px; cy: 115px; }                /* থ্রো করার মুহূর্তে সে অফসাইড লাইনের ওপাশে */
              70% { cx: 310px; cy: 115px; }                /* অফসাইড জোনের ভেতরে রান সচল */
              85%, 100% { cx: 350px; cy: 110px; }           /* বল রিসিভ করে কন্ট্রোল */
            }

            /* ৪. ডিফেন্ডার ও কিপারের রিয়ালিস্টিক অনবরত জকিং (ফ্রিজ হবে না কখনোই) */
            @keyframes defOneMove12 {
              0%, 100% { cx: 283px; cy: 67px; }
              30% { cx: 288px; cy: 71px; }
              60% { cx: 285px; cy: 69px; }
              85% { cx: 289px; cy: 68px; }
            }
            @keyframes defTwoMove12 {
              0%, 100% { cx: 295px; cy: 122px; }
              30% { cx: 292px; cy: 119px; }
              60% { cx: 297px; cy: 121px; }
              85% { cx: 294px; cy: 123px; }
            }
            @keyframes defThreeMove12 {
              0%, 100% { cx: 288px; cy: 170px; }
              30% { cx: 293px; cy: 173px; }
              60% { cx: 290px; cy: 171px; }
              85% { cx: 294px; cy: 169px; }
            }
            @keyframes gkWatch12 {
              0%, 100% { cx: 380px; cy: 114px; }
              30% { cx: 378px; cy: 118px; }
              60% { cx: 381px; cy: 116px; }
              85% { cx: 379px; cy: 120px; }
            }

            /* অফসাইড চেকিং পস ফেইজ (৪৫% থেকে ৭০% পর্যন্ত স্ক্রিনে রেড অ্যালার্ট ও লাইন দেখাবে) */
            @keyframes offsideCheck12 {
              0%, 44% { opacity: 0; pointer-events: none; }
              45%, 70% { opacity: 1; }
              71%, 100% { opacity: 0; pointer-events: none; }
            }

            /* অনসাইড এক্সেপশন সাকসেস ফেইজ (৭১% থেকে ১০০% পর্যন্ত সবুজ থিম দেখাবে) */
            @keyframes throwSuccess12 {
              0%, 70% { opacity: 0; pointer-events: none; }
              71%, 95% { opacity: 1; }
              96%, 100% { opacity: 0; pointer-events: none; }
            }

            .player-12-thrower { animation: throwerAction12 6s infinite linear; }
            .player-12-receiver { animation: receiverSprint12 6s infinite linear; }
            .player-12-def1 { animation: defOneMove12 6s infinite linear; }
            .player-12-def2 { animation: defTwoMove12 6s infinite linear; }
            .player-12-def3 { animation: defThreeMove12 6s infinite linear; }
            .player-12-gk { animation: gkWatch12 6s infinite linear; }
            .ball-12 { animation: ballFlight12 6s infinite linear; }
            
            .layer-offside-12 { animation: offsideCheck12 6s infinite linear; }
            .layer-throw-12 { animation: throwSuccess12 6s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* বিপক্ষ ডিফেন্স লাইন (ক্রমাগত হালকা জকিং মুভমেন্টে সচল) */}
          <circle cx="285" cy="68" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-12-def1" />
          <circle cx="295" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-12-def2" />
          <circle cx="290" cy="172" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-12-def3" />
          
          {/* বিপক্ষ গোলকিপার (অনবরত অ্যালার্ট পজিশন শিফট) */}
          <circle cx="380" cy="115" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-12-gk" />

          {/* আমাদের থ্রো-ইন দাতা প্লেয়ার (টাচলাইনে হালকা ডাইনামিক বডি মুভমেন্টে) */}
          <circle cx="245" cy="20" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" className="player-12-thrower" />
          
          {/* আমাদের আক্রমণকারী প্লেয়ার (অনসাইড থেকে অফসাইডে স্প্রিন্ট রান) */}
          <circle cx="230" cy="115" r="10" fill="#ebdccb" stroke="#10b981" strokeWidth="2.5" className="player-12-receiver" />
          
          {/* ফুটবল */}
          <circle cx="245" cy="24" r="4" fill="#10b981" className="ball-12" />

          {/* === লেয়ার ১: অফসাইড চেক ও পস মোমেন্ট === */}
          <g className="layer-offside-12">
            {/* ডাইনামিক ট্র্যাকিং অফসাইড লাইন */}
            <line x1="295" y1="20" x2="295" y2="220" stroke="#ff4a4a" strokeWidth="2" strokeDasharray="5 4" />
            
            {/* পস ইন্ডিকেটর প্যানেল */}
            <rect x="30" y="30" width="220" height="22" fill="#ff4a4a" rx="4" />
            <text x="140" y="44" fill="#ffffff" fontSize="8.5" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ THROW MOMENT: PLAYER IN OFFSIDE ZONE" : "‖ থ্রো এর মুহূর্ত: সতীর্থ অফসাইড জোনে ঢুকে গেছে"}
            </text>
            
            <text x="295" y="15" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="middle">DEFENSE LINE</text>
            <text x="340" y="137" fill="#ff4a4a" fontSize="6.5" fontWeight="bold" textAnchor="middle">RUN AWAY</text>
          </g>

          {/* === লেয়ার ২: থ্রো সাকসেস ও অনসাইড নোটিফিকেশন === */}
          <g className="layer-throw-12">
            {/* অনসাইড এক্সেপশন সাকসেস প্যানেল */}
            <rect x="30" y="30" width="220" height="22" fill="#10b981" rx="4" />
            <text x="140" y="44" fill="#ffffff" fontSize="8.5" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "✔ ONSIDE: VALID DIRECT THROW-IN" : "✔ অনসাইড: সরাসরি থ্রো-ইন (বৈধ)"}
            </text>
            
            {/* থ্রো ট্র্যাকিং এরো পাথ */}
            <path d="M 255,32 Q 295,55 345,102" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrow)" />
            <text x="350" y="132" fill="#10b981" fontSize="7" fontWeight="black" textAnchor="middle">BALL CONTROLLED</text>
          </g>
        </svg>
      )
    },
{
      id: "13",
      type: "ONSIDE",
      category: { en: "Exception", bn: "ব্যতিক্রমী নিয়ম" },
      title: { en: "13. Exception 2: Direct Corner Kick", bn: "১৩. ব্যতিক্রম ২: সরাসরি কর্নার কিক" },
      desc: {
        en: "No offside can occur directly from a corner kick because the ball is kicked from the baseline. A player can safely receive it deep inside the penalty box even if ahead of all defenders.",
        bn: "কর্নার কিক নেওয়ার সময় বল যেহেতু মাঠের শেষ সীমানায় থাকে, তাই সরাসরি উড়ে আসা বলে ডি-বক্সের গভীরেও কোনো অফসাইড হয় না—প্লেয়ার ডিফেন্সের সামনে থাকলেও তা সম্পূর্ণ বৈধ।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৬ সেকেন্ডের রিয়ালিস্টিক ইন-সুইং কর্নার কিক অ্যাকশন */

            /* ১. কর্নার কিকার: নিচের ডানদিকের ফ্ল্যাগ থেকে কিক করার অ্যাকশন */
            @keyframes kickerAction13 {
              0%, 100% { cx: 390px; cy: 230px; }
              35% { cx: 387px; cy: 227px; } 
              40% { cx: 389px; cy: 229px; }
            }

            /* ২. ইন-সুইং ফুটবল ট্র্যাকিং: কর্নার থেকে প্রথমে বামে পিচের ভেতর (cx: 320px) সুইং করে ঘুরে সতীর্থের কাছে (৩৭৫px) যাবে */
            @keyframes cornerArc13 {
              0%{cx: 392px; cy: 232px; r: 4px;}
              40% { cx: 392px; cy: 232px; r: 4px; }       
              60% { cx: 392px; cy: 232px; r: 8.5px; }       /* বাম দিকে মাঠের ভেতর সুইং ও বাতাসে হাই কার্ভ */
              85% { cx: 370px; cy: 140px; r: 4px; }   /* ঘুরে এসে অফসাইড জোনে সতীর্থের কাছে ল্যান্ডেড */
              100% { cx: 375px; cy: 110px; r: 4px; }
            }

            /* ৩. মূল রিসিভার: শুরু থেকে ডি-বক্সের ভেতরেই (৩৪০px) থাকবে, কিকের সাথে সাথে আরো গভীরে (৩৭৫px) অফসাইড জোনে দৌড়ে যাবে */
            @keyframes mainReceiver13 {
              0%{ cx: 340px; cy: 115px;  }
               30% { cx: 350px; cy: 115px; }            /* শুরুতে ডি-বক্সের ভেতরেই অনসাইড পজিশনে */
              40% { cx: 365px; cy: 112px; }                /* কিকের মুহূর্তে রান শুরু করেছে */
              60% { cx: 365px; cy: 112px; }                /* ডিফেন্স লাইন চূর্ণ করে অফসাইড জোনে স্প্রিন্ট */
              100%, 100% { cx: 375px; cy: 110px; }   
            }

            /* ৪. অন্য সতীর্থ: ডি-বক্সের ভেতর ডিফেন্ডারদের স্ক্রিন/ব্লক করছে */
            @keyframes teammateMove13 {
              0%, 100% { cx: 345px; cy: 160px; }
              45% { cx: 342px; cy: 163px; }
              75% { cx: 348px; cy: 157px; }
            }

            /* ৫. বিপক্ষ ডিফেন্ডারদের ক্রমাগত পজিশনাল মুভমেন্ট (ডি-বক্সের ভেতর) */
            @keyframes defOneMove13 { 0%, 100% { cx: 350px; cy: 75px; } 50% { cx: 353px; cy: 78px; } }
            @keyframes defTwoMove13 { 0%, 100% { cx: 355px; cy: 120px; } 50% { cx: 352px; cy: 117px; } }
            @keyframes defThreeMove13 { 0%, 100% { cx: 348px; cy: 170px; } 50% { cx: 351px; cy: 167px; } }
            
            /* বিপক্ষ গোলকিপার: শট দেখে লাইনে পজিশন ঠিক করছে */
            @keyframes gkWatch13 {
              0%, 100% { cx: 390px; cy: 120px; }
              40% { cx: 387px; cy: 115px; }
              75% { cx: 389px; cy: 122px; }
            }

            /* অফসাইড পস ফেইজ (৪০% থেকে ৬৫% পর্যন্ত স্ক্রিনে ভিজ্যুয়াল এলার্ট) */
            @keyframes offsideCheck13 {
              0%, 39% { opacity: 0; pointer-events: none; }
              40%, 65% { opacity: 1; }
              66%, 100% { opacity: 0; pointer-events: none; }
            }

            /* অনসাইড এক্সেপশন সাকসেস ফেইজ (৬৬% থেকে ১০০%) */
            @keyframes cornerSuccess13 {
              0%, 65% { opacity: 0; pointer-events: none; }
              66%, 95% { opacity: 1; }
              96%, 100% { opacity: 0; pointer-events: none; }
            }

            .player-13-kicker { animation: kickerAction13 6s infinite linear; }
            .player-13-receiver { animation: mainReceiver13 6s infinite linear; }
            .player-13-mate { animation: teammateMove13 6s infinite linear; }
            .player-13-def1 { animation: defOneMove13 6s infinite linear; }
            .player-13-def2 { animation: defTwoMove13 6s infinite linear; }
            .player-13-def3 { animation: defThreeMove13 6s infinite linear; }
            .player-13-gk { animation: gkWatch13 6s infinite linear; }
            .ball-13 { animation: cornerArc13 6s infinite linear; }
            
            .layer-offside-13 { animation: offsideCheck13 6s infinite linear; }
            .layer-throw-13 { animation: cornerSuccess13 6s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* ডানদিকের কর্নার ফ্ল্যাগ এরিয়া আর্ক */}
          <path d="M 385,240 A 15,15 0 0,0 400,225" fill="none" stroke="#ebdccb" strokeWidth="1.5" strokeOpacity="0.6" />
          
          {/* বিপক্ষ ডিফেন্স লাইন (১০০% ডি-বক্সের ভেতরেই মার্কিং পজিশনে) */}
          <circle cx="350" cy="75" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-13-def1" />
          <circle cx="355" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-13-def2" />
          <circle cx="348" cy="170" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-13-def3" />
          
          {/* বিপক্ষ গোলকিপার (গোলপোস্টের একদম লাইনে) */}
          <circle cx="390" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-13-gk" />

          {/* আমাদের অন্য সতীর্থ প্লেয়ার (ডি-বক্সের ভেতরে স্পেস হোল্ড করছে) */}
          <circle cx="345" cy="160" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" className="player-13-mate" />

          {/* আমাদের কর্নার কিকার প্লেয়ার */}
          <circle cx="390" cy="230" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" className="player-13-kicker" />
          
          {/* আমাদের মূল রিসিভার প্লেয়ার (ডি-বক্সের ভেতর থেকেই দৌড়ে একদম সামনে অফসাইডে যাবে) */}
          <circle cx="340" cy="115" r="10" fill="#ebdccb" stroke="#10b981" strokeWidth="2.5" className="player-13-receiver" />
          
          {/* ফুটবল */}
          <circle cx="392" cy="232" r="4" fill="#10b981" className="ball-13" />

          {/* === লেয়ার ১: অফসাইড চেক ও কিক মোমেন্ট === */}
          <g className="layer-offside-13">
            {/* শেষ ডিফেন্ডারের পজিশন অনুযায়ী অফসাইড লাইন (৩৫৫px) */}
            <line x1="355" y1="20" x2="355" y2="220" stroke="#ff4a4a" strokeWidth="2" strokeDasharray="5 4" />
            
            {/* পস ইন্ডিকেটর প্যানেল */}
            <rect x="90" y="30" width="220" height="22" fill="#ff4a4a" rx="4" />
            <text x="200" y="44" fill="#ffffff" fontSize="8.5" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ KICK MOMENT: RUNNING INTO OFFSIDE ZONE" : "‖ কিকের মুহূর্ত: রিসিভার দৌড়ে অফসাইড জোনে যাচ্ছে"}
            </text>
            
            <text x="355" y="15" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="middle">LAST DEFENDER LINE</text>
            <text x="375" y="142" fill="#ff4a4a" fontSize="6.5" fontWeight="bold" textAnchor="middle">OFFSIDE ZONE</text>
          </g>

          {/* === লেয়ার ২: কর্নার এক্সেপশন সাকসেস ও অনসাইড নোটিফিকেশন === */}
          <g className="layer-throw-13">
            {/* অনসাইড সাকসেস প্যানেল */}
            <rect x="90" y="30" width="220" height="22" fill="#10b981" rx="4" />
            <text x="200" y="44" fill="#ffffff" fontSize="8.5" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "✔ ONSIDE: EXCEPTION (DIRECT CORNER)" : "✔ অনসাইড: ব্যতিক্রম (সরাসরি কর্নার কিক)"}
            </text>
            
            {/* কর্নার কিকের নিখুঁত ইন-সুইং ট্র্যাকিং পাথ (প্রথমে বামে গিয়ে কার্ভ হয়ে সতীর্থ বরাবর ফেরত আসে) */}
            <path d="M 388,225 C 365,140 370,120 375,110" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrow)" />
            <text x="325" y="145" fill="#10b981" fontSize="7" fontWeight="black" textAnchor="middle">IN-SWING PATH</text>
          </g>
        </svg>
      )
    },
    

   {
      id: "14",
      type: "ONSIDE",
      category: { en: "Exception", bn: "ব্যতিক্রমী নিয়ম" },
      title: { en: "14. Exception 3: Direct Goal Kick", bn: "১৪. ব্যতিক্রম ৩: সরাসরি গোল কিক" },
      desc: {
        en: "An attacker receiving the ball directly from a regular Goal Kick restart is completely exempted from offside, even if positioned deep behind the opponent defense.",
        bn: "নিজের গোলপোস্ট থেকে গোল কিক নেওয়ার মুহূর্তে সতীর্থ স্ট্রাইকার বিপক্ষ ডিফেন্সের পেছনে (অফসাইড পজিশনে) দাঁড়িয়ে সরাসরি বল রিসিভ করলেও তা সম্পূর্ণ বৈধ (ONSIDE)।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৬ সেকেন্ডের নিখুঁত ফুল-পিচ গোল কিক অ্যাকশন লুপ */

            /* ১. গোলকিপার/কিকার: বামপাশের নিজের গোলবক্স থেকে কিক করবে */
            @keyframes kickerAction14 {
              0%, 100% { cx: 22px; cy: 120px; }
              35% { cx: 18px; cy: 120px; } 
              40% { cx: 22px; cy: 120px; }
            }

            /* ২. ডট লাইন অনুসারে ফুটবল ট্র্যাকিং (১০০% স্মুথ প্যারাবোলিক আর্ক) */
            @keyframes goalKickArc14 {
              0%, 35% { cx: 26px; cy: 120px; r: 4px; }       /* কিকের আগে স্থির বল */
              40% { cx: 32px; cy: 120px; r: 4.5px; }         /* কিকের মুহূর্ত (ডট লাইনের শুরু) */
              65% { cx: 32px; cy: 120px; r: 4.5px; }     
              70% { cx: 120px; cy: 45px; r: 8.5px; }         /* বাতাসে ভাসমান উচ্চতা (সাইজে বড় ফিল) */
              75% { cx: 220px; cy: 35px; r: 9px; }           /* ডট লাইনের সর্বোচ্চ শীর্ষবিন্দু */
              85% { cx: 300px; cy: 75px; r: 6px; }           /* নিচে নামার মুহূর্ত (সাইজ ছোট হচ্ছে) */
              92%, 100% { cx: 335px; cy: 120px; r: 4px; }     /* অফসাইড পজিশনে রিসিভারের পায়ে নিখুঁত ল্যান্ডিং */
            }

            /* ৩. আমাদের মূল রিসিভার: কিকের শুরু থেকেই সে বিপক্ষ ডিফেন্স লাইনের পেছনে অফসাইড জোনে থাকবে */
            @keyframes attackerPosition14 {
              0%, 35% { cx: 330px; cy: 122px; }          
              40% { cx: 332px; cy: 120px; }              
              70% { cx: 333px; cy: 118px; }              
              92%, 100% { cx: 335px; cy: 120px; }          /* বল ড্রপ করার সাথে সাথে রিসিভ */
            }

            /* ৪. বিপক্ষ ডিফেন্ডারদের হাই ডিফেন্সিভ লাইন (৩০০px এ অনবরত জকিং মুভমেন্ট) */
            @keyframes defOneMove14 { 0%, 100% { cx: 295px; cy: 65px; } 50% { cx: 298px; cy: 68px; } }
            @keyframes defTwoMove14 { 0%, 100% { cx: 300px; cy: 120px; } 50% { cx: 297px; cy: 117px; } }
            @keyframes defThreeMove14 { 0%, 100% { cx: 293px; cy: 175px; } 50% { cx: 296px; cy: 172px; } }
            
            /* বিপক্ষ গোলকিপার: সতর্ক মুভমেন্ট */
            @keyframes oppGkWatch14 {
              0%, 100% { cx: 375px; cy: 120px; }
              40% { cx: 372px; cy: 116px; }
              75% { cx: 376px; cy: 122px; }
            }

            /* অফসাইড পস ফেইজ (৪০% থেকে ৬৫% পর্যন্ত স্ক্রিনে রেড এলার্ট ও লাইন দেখাবে) */
            @keyframes offsideCheck14 {
              0%, 39% { opacity: 0; pointer-events: none; }
              40%, 65% { opacity: 1; }
              66%, 100% { opacity: 0; pointer-events: none; }
            }

            /* অনসাইড এক্সেপশন সাকসেস ফেইজ (৬৬% থেকে ১০০% পর্যন্ত সবুজ থিম দেখাবে) */
            @keyframes kickSuccess14 {
              0%, 65% { opacity: 0; pointer-events: none; }
              66%, 95% { opacity: 1; }
              96%, 100% { opacity: 0; pointer-events: none; }
            }

            .player-14-kicker { animation: kickerAction14 6s infinite linear; }
            .player-14-receiver { animation: attackerPosition14 6s infinite linear; }
            .player-14-def1 { animation: defOneMove14 6s infinite linear; }
            .player-14-def2 { animation: defTwoMove14 6s infinite linear; }
            .player-14-def3 { animation: defThreeMove14 6s infinite linear; }
            .player-14-oppgk { animation: oppGkWatch14 6s infinite linear; }
            .ball-14 { animation: goalKickArc14 6s infinite linear; }
            
            .layer-offside-14 { animation: offsideCheck14 6s infinite linear; }
            .layer-success-14 { animation: kickSuccess14 6s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* নিজের বামপাশের গোলবক্স মার্কিং এরিয়া */}
          <path d="M 0,85 L 30,85 L 30,155 L 0,155" fill="none" stroke="#ebdccb" strokeWidth="1.5" strokeOpacity="0.5" />
          
          {/* আমাদের কিকার/গোলকিপার (বামপাশে) */}
          <circle cx="22" cy="120" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" className="player-14-kicker" />

          {/* বিপক্ষ ডিফেন্স লাইন (৩০০px পজিশনে দাঁড়িয়ে অফসাইড ট্র্যাপ তৈরি করে সচল) */}
          <circle cx="295" cy="65" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-14-def1" />
          <circle cx="300" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-14-def2" />
          <circle cx="293" cy="175" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-14-def3" />
          
          {/* বিপক্ষ গোলকিপার (ডানপাশের গোলপোস্টে) */}
          <circle cx="375" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-14-oppgk" />
          
          {/* আমাদের মূল রিসিভার/স্ট্রাইকার (শুরু থেকেই অফসাইড জোনে সক্রিয়) */}
          <circle cx="330" cy="122" r="10" fill="#ebdccb" stroke="#10b981" strokeWidth="2.5" className="player-14-receiver" />
          
          {/* ফুটবল */}
          <circle cx="26" cy="120" r="4" fill="#10b981" className="ball-14" />

          {/* === লেয়ার ১: অফসাইড চেক ও পস মোমেন্ট (কিকের মুহূর্ত) === */}
          <g className="layer-offside-14">
            {/* বিপক্ষ ডিফেন্ডার ২ এর অবস্থান অনুযায়ী অফসাইড লাইন (৩০০px এ) */}
            <line x1="300" y1="20" x2="300" y2="220" stroke="#ff4a4a" strokeWidth="2" strokeDasharray="5 4" />
            
            {/* পস ইন্ডিকেটর প্যানেল */}
            <rect x="90" y="30" width="220" height="22" fill="#ff4a4a" rx="4" />
            <text x="200" y="44" fill="#ffffff" fontSize="8.5" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ KICK MOMENT: AHEAD OF DEFENDERS" : "‖ কিকের মুহূর্ত: স্ট্রাইকার স্পষ্ট অফসাইড পজিশনে"}
            </text>
            
            <text x="300" y="15" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="middle">OFFSIDE TRAP LINE</text>
            <text x="342" y="145" fill="#ff4a4a" fontSize="6.5" fontWeight="bold" textAnchor="middle">OFFSIDE ZONE</text>
          </g>

          {/* === লেয়ার ২: গোল কিক এক্সেপশন সাকসেস ও অনসাইড নোটিফিকেশন === */}
          <g className="layer-success-14">
            {/* অনসাইড সাকসেস প্যানেল */}
            <rect x="90" y="30" width="220" height="22" fill="#10b981" rx="4" />
            <text x="200" y="44" fill="#ffffff" fontSize="8.5" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "✔ ONSIDE: EXCEPTION (DIRECT GOAL KICK)" : "✔ অনসাইড: ব্যতিক্রম (সরাসরি গোল কিক)"}
            </text>
            
            {/* লং গোল কিক প্যারাবোলিক ট্র্যাকিং পাথ (যার সাথে বলের অ্যানিমেশন এবার পুরোপুরি সিঙ্কড) */}
            <path d="M 32,120 C 120,10 240,10 335,120" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrow)" />
            <text x="335" y="142" fill="#10b981" fontSize="7" fontWeight="black" textAnchor="middle">VALID RECEIVE!</text>
          </g>
        </svg>
      )
    },
    
    {
      id: "15",
      type: "ONSIDE",
      category: { en: "Exception", bn: "ব্যতিক্রমী নিয়ম" },
      title: { en: "15. Defender Steps Off the Pitch", bn: "১৫. ডিফেন্ডার মাঠের বাইরে চলে গেলে" },
      desc: {
        en: "If a defender steps off the boundary line to trap an attacker, they are still considered active on the goal-line/touchline for offside validation.",
        bn: "অফসাইড ট্র্যাপ পাতার জন্য বিপক্ষ ডিফেন্ডার মাঠের শেষ সীমানার বাইরে চলে গেলেও তাকে মাঠের লাইনেই সচল ধরা হবে, ফলে আমাদের স্ট্রাইকার সম্পূর্ণ অনসাইড থাকবেন।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ছবি image_9b5e87.png এর পজিশন ও লাল ট্র্যাকার লাইন অনুযায়ী ৬ সেকেন্ডের লুপ */

            /* ১. পাসার প্লেয়ার: মাঝমাঠের নিচ থেকে ওপরে পাস দেবে (cx: 210, cy: 165) */
            @keyframes passerAction15 {
              0%, 100% { cx: 210px; cy: 165px; }
              35% { cx: 207px; cy: 167px; }
              40% { cx: 209px; cy: 166px; }
            }

            /* ২. ফুটবল ট্র্যাকিং: পাসারের পা থেকে স্ট্রাইকারের কাছে যাবে */
            @keyframes shortPassArc15 {
              0%, 35% { cx: 215px; cy: 160px; }          
              40% { cx: 218px; cy: 158px; r: 7.5; }       
              65% { cx: 218px; cy: 158px;r:7.5; }       
              85%, 100% { cx: 280px; cy: 125px; r:4; }     /* স্ট্রাইকারের পায়ে ডেলিভারি */
            }

            /* ৩. আমাদের স্ট্রাইকার (সবুজ সার্কেল): ছবির পজিশন অনুযায়ী cx: 280, cy: 125 এ থাকবে */
            @keyframes strikerRun15 {
              0%, 30% { cx: 275px; cy: 127px; }       
              40% { cx: 278px; cy: 126px; }          /* কিকের মুহূর্তে পজিশন */
              85%, 100% { cx: 280px; cy: 125px; }     
            }

            /* ৪. ইন-ফিল্ড ডিফেন্ডার (ছবির লাল ট্র্যাকিং লাইন অনুযায়ী ডান থেকে বামে cx: 260 এ আসবে) */
            @keyframes inFieldDefMove15 {
              0%, 35% { cx: 320px; cy: 90px; }       /* শুরুতে ডানে থাকে */
              60%, 100% { cx: 260px; cy: 90px; }     /* বামে এগিয়ে এসে লাল সার্কেল পজিশনে থামে */
            }

            /* ৫. অফ-ফিল্ড ডিফেন্ডার (মাঠের উপরে টাচলাইনের বাইরে ডান থেকে বামে cx: 260 এর দিকে আসবে) */
            @keyframes offFieldDefMove15 {
              0%, 35% { cx: 330px; cy: 15px; }       /* শুরুতে ডানে মাঠের বাইরে */
              60%, 100% { cx: 260px; cy: 15px; }     /* বামে এগিয়ে এসে লাল সার্কেল পজিশন বরাবর বাইরে থামে */
            }

            /* ৬. বিপক্ষ গোলকিপার */
            @keyframes gkWatch15 { 0%, 100% { cx: 355px; cy: 120px; } 50% { cx: 352px; cy: 122px; } }

            /* অফসাইড পস ফেইজ (৪০% থেকে ৬৫% পর্যন্ত স্ক্রিনে রেড থিম এলার্ট ও লাইন) */
            @keyframes offsideCheck15 {
              0%, 39% { opacity: 0; pointer-events: none; }
              40%, 65% { opacity: 1; }
              66%, 100% { opacity: 0; pointer-events: none; }
            }

            /* অনসাইড এক্সেপশন সাকসেস ফেইজ (৬৬% থেকে ১০০% পর্যন্ত সবুজ থিম) */
            @keyframes passSuccess15 {
              0%, 65% { opacity: 0; pointer-events: none; }
              66%, 95% { opacity: 1; }
              96%, 100% { opacity: 0; pointer-events: none; }
            }

            .player-15-passer { animation: passerAction15 6s infinite linear; }
            .player-15-receiver { animation: strikerRun15 6s infinite linear; }
            .player-15-defIn { animation: inFieldDefMove15 6s infinite linear; }
           
            .player-15-gk { animation: gkWatch15 6s infinite linear; }
            .ball-15 { animation: shortPassArc15 6s infinite linear; }
            
            .layer-offside-15 { animation: offsideCheck15 6s infinite linear; }
            .layer-success-15 { animation: passSuccess15 6s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* আমাদের পাসার সতীর্থ প্লেয়ার (মাঠের নিচে মাঝমাঠের কাছে) */}
          <circle cx="210" cy="165" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" className="player-15-passer" />

          {/* বিপক্ষ গোলকিপার (ডি-বক্সের লাইনে) */}
          <circle cx="355" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-15-gk" />

          
          
          {/* বিপক্ষ অফ-ফিল্ড ডিফেন্ডার (মাঠের উপরের বাউন্ডারি লাইনের বাইরে - cy: 15) */}
          <circle cx="260" cy="15" r="10" fill="#4a5568" stroke="#ff4a4a" strokeWidth="2" className="player-15-defOff" />
          <text x="330" y="30" fill="#ff4a4a" fontSize="6" fontWeight="black" textAnchor="middle" className="layer-offside-15">OFF-FIELD</text>
          
          {/* আমাদের মূল স্ট্রাইকার/রিসিভার প্লেয়ার (সবুজ সার্কেল) */}
          <circle cx="275" cy="127" r="10" fill="#ebdccb" stroke="#10b981" strokeWidth="2.5" className="player-15-receiver" />
          
          {/* ফুটবল */}
          <circle cx="215" cy="160" r="4" fill="#10b981" className="ball-15" />

          {/* === লেয়ার ১: অফসাইড চেক ও পস মোমেন্ট (কিকের মুহূর্ত - লাল থিম) === */}
          <g className="layer-offside-15">
            {/* ছবির মতো হুবহু লাল অফসাইড ইন্ডিকেটর লাইন (cx: 260 এ সোজা নিচে নেমে গেছে) */}
            <line x1="260" y1="20" x2="260" y2="190" stroke="#ff4a4a" strokeWidth="3" />
            
           

            {/* পস ইন্ডিকেটর প্যানেল */}
            <rect x="90" y="45" width="220" height="22" fill="#ff4a4a" rx="4" />
            <text x="200" y="59" fill="#ffffff" fontSize="8.5" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ KICK MOMENT: DEFENDER IS OFF-FIELD" : "‖ কিকের মুহূর্ত: ডিফেন্ডার মাঠের বাইরে"}
            </text>
          </g>

          {/* === লেয়ার ২: অনসাইড এক্সেপশন সাকসেস ও নোটিফিকেশন (সবুজ থিম) === */}
          <g className="layer-success-15">
            {/* ছবির মতো সবুজ ওনসাইড নোটিফিকেশন বক্স (নিচের দিকে) */}
            <rect x="250" y="195" width="80" height="18" fill="#10b981" rx="4" />
            <text x="290" y="207" fill="#ffffff" fontSize="8.5" fontWeight="black" textAnchor="middle">
              ✓ ONSIDE
            </text>
            
            {/* পাস ট্র্যাকিং পাথ */}
            <path d="M 220,160 L 275,128" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrow)" />
          </g>
        </svg>
      )
    },
    
    {
      id: "16",
      type: "offside",
      category: { en: "Active Play", bn: "সক্রিয় অংশগ্রহণ" },
      title: { en: "16. Returning From Offside", bn: "১৬. অফসাইড থেকে পিছনে এসে বল ধরা" },
      desc: {
        en: "An attacker who is in an offside position when the ball is passed runs backward into an onside area to receive it. It remains an offside offence based on the initial pass moment.",
        bn: "পাস দেওয়ার মুহূর্তে আক্রমণকারী অফসাইড পজিশনে ছিলেন। বল ছাড়ার পর তিনি পেছনে অনসাইড জোনে দৌড়ে এসে বল রিসিভ করলেও সেটি অফসাইড, কারণ পাসের মুহূর্তে তিনি অফসাইডেই ছিলেন।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৫ সেকেন্ডের নিখুঁত সিনক্রোনাইজড লুপ */
            /* আক্রমণকারী: ৩০%-৬০% পাসের সময় অফসাইডে (310px) পস থাকবে, ৬০% এর পর পেছনে (220px) এসে বল ধরবে */
            @keyframes runBack19 {
              0% { cx: 310px; }
              30%, 60% { cx: 310px; } 
              85%, 100% { cx: 220px; }
            }
            /* বল: ৩০%-৬০% রিলিজ মোমেন্টে পস, ৬০% এর পর প্লেয়ারের পেছনে আসার পজিশনে পৌঁছাবে */
            @keyframes passToBack19 {
              0%, 29% { cx: 80px; cy: 160px; }
              30%, 60% { cx: 100px; cy: 150px; } 
              85%, 100% { cx: 220px; cy: 120px; }
            }
            /* পস ইউজার ইন্টারফেস এবং অফসাইড লাইন: ৩০% থেকে ৬০% এর মধ্যে জ্বলবে */
            @keyframes uiFade19 {
              0%, 29% { opacity: 0; }
              30%, 59% { opacity: 1; }
              60%, 100% { opacity: 0; }
            }
            .player-19-att { animation: runBack19 5s infinite linear; }
            .ball-19 { animation: passToBack19 5s infinite linear; }
            .pause-overlay-19 { animation: uiFade19 5s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* ডিফেন্ডার (যিনি অফসাইড লাইন তৈরি করছেন) */}
          <circle cx="260" cy="70" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" />
          <circle cx="360" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" />
          
          {/* পাসিং সতীর্থ */}
          <circle cx="80" cy="160" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" />
          
          {/* আক্রমণকারী (শুরুতে অফসাইডে থাকবে, পরে পেছনে অনসাইড জোনে রান নেবে) */}
          <circle cx="310" cy="120" r="10" fill="#ebdccb" stroke="#ff4a4a" strokeWidth="2.5" className="player-19-att" />
          
          {/* ফুটবল */}
          <circle cx="80" cy="160" r="4" fill="#ff4a4a" className="ball-19" />
          
          {/* বল ছাড়ার মুহূর্তের অফসাইড জাজমেন্ট লেয়ার */}
          <g className="pause-overlay-19">
            {/* ডিফেন্ডারকে বেস করে টানা লাল অফসাইড ডেডলাইন */}
            <line x1="260" y1="20" x2="260" y2="220" stroke="#ff4a4a" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* স্ক্রিন নোটিফিকেশন বক্স */}
            <rect x="90" y="25" width="220" height="22" fill="#ff4a4a" rx="4" />
            <text x="200" y="40" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ PAUSED: OFFSIDE AT MOMENT OF PASS" : "‖ পস: বল ছাড়ার সময় স্পষ্ট অফসাইড"}
            </text>

            <text x="310" y="95" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="middle">OFFSIDE POSITION</text>
            <text x="260" y="95" fill="#ebdccb" fontSize="7" fontWeight="bold" textAnchor="middle">DEFENCE LINE</text>
            
            {/* কিকের এনার্জি রিং */}
            <circle cx="80" cy="160" r="14" fill="none" stroke="#ff4a4a" strokeWidth="1.5" strokeDasharray="3 2" />
          </g>
        </svg>
      )
    },
    {
      id: "17",
      type: "offside",
      category: { en: "Active Play", bn: "সক্রিয় অংশগ্রহণ" },
      title: { en: "17. Offside on Run & Receiving Before Line", bn: "১৭. একসাথে দৌড়ে অফসাইড ও লাইনের আগে বল ধরা" },
      desc: {
        en: "Both attacker and defender sprint. At the pass, the attacker breaches the line. The attacker then brakes, letting the defender pass by, and collects the ball *before* the defense line. Still offside.",
        bn: "আক্রমণকারী ও ডিফেন্ডার দুজনেই একসাথে দৌড়াচ্ছেন। পাস করার মুহূর্তে আক্রমণকারী অফসাইডে চলে যান। এরপর সে ব্রেক করে বা থেমে গিয়ে ডিফেন্ডারকে সামনে যেতে দেয় এবং ডিফেন্স লাইনের *আগে* এসে বল রিসিভ করে।"
      },
      svg: (
        <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            /* ৫ সেকেন্ডের সমন্বিত ডাইনামিক লুপ */
            
            /* ডিফেন্ডার: ০-৩০% একসাথে দৌড়াবে, ৩০-৬০% পস মোমেন্টে স্থির, ৬০-১০০% এ সে আক্রমণকারীকে ছাড়িয়ে সামনে চলে যাবে (350px) */
            @keyframes defSprint20 {
              0% { cx: 160px; }
              30%, 60% { cx: 230px; }
              100% { cx: 350px; }
            }
            
            /* আক্রমণকারী: ০-৩০% দ্রুত দৌড়াবে (অফসাইড হবে), ৩০-৬০% পস থাকবে, ৬০-৮০% সে ব্রেক করে গতি একদম কমিয়ে দেবে, ফলে রিসিভ করার সময় সে ডিফেন্ডারের পেছনে (310px) থাকবে */
            @keyframes attSprint20 {
              0% { cx: 160px; }
              30%, 60% { cx: 255px; } /* পাসের মুহূর্তে স্পষ্ট অফসাইড */
              80% { cx: 280px; }      /* গতি কমিয়ে ব্রেক করার মোমেন্ট */
              100% { cx: 310px; }     /* ডিফেন্ডার (350px) এর আগে বল রিসিভ করার স্পট */
            }
            
            /* বল: ০-৩০% সতীর্থের কাছে, ৩০-৬০% রিলিজ মোমেন্টে পস, ৬০-১০০% এ ডিফেন্স লাইনের আগে থাকা আক্রমণকারীর কাছে পৌঁছাবে */
            @keyframes ballPass20 {
              0%, 29% { cx: 70px; cy: 160px; }
              30%, 60% { cx: 95px; cy: 150px; }
              100% { cx: 310px; cy: 120px; }
            }
            
            /* পস ইউজার ইন্টারফেস ও রেড ডেডলাইন: ৩০% থেকে ৬০% এর মধ্যে ট্র্যাকিং করবে */
            @keyframes uiFade20 {
              0%, 29% { opacity: 0; }
              30%, 59% { opacity: 1; }
              60%, 100% { opacity: 0; }
            }
            
            .player-20-def { animation: defSprint20 5s infinite linear; }
            .player-20-att { animation: attSprint20 5s infinite linear; }
            .ball-20 { animation: ballPass20 5s infinite linear; }
            .pause-overlay-20 { animation: uiFade20 5s infinite linear; }
          `}</style>
          
          {renderFullPitchBackground()}
          
          {/* গোলকিপার (ফিক্সড) */}
          <circle cx="375" cy="120" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" />
          
          {/* পাসিং সতীর্থ খেলোয়াড় */}
          <circle cx="70" cy="160" r="10" fill="#ebdccb" stroke="#0a0705" strokeWidth="1.5" />
          
          {/* ডিফেন্ডার (স্প্রিন্ট শেষে সে সামনে এগিয়ে যাবে) */}
          <circle cx="160" cy="70" r="10" fill="#4a5568" stroke="#ebdccb" strokeWidth="1.5" className="player-20-def" />
          
          {/* আক্রমণকারী (পাসের মুহূর্তে অফসাইডে কিন্তু রিসিভের সময় পেছনে) */}
          <circle cx="160" cy="120" r="10" fill="#ebdccb" stroke="#ff4a4a" strokeWidth="2.5" className="player-20-att" />
          
          {/* ফুটবল */}
          <circle cx="70" cy="160" r="4" fill="#ff4a4a" className="ball-20" />
          
          {/* ৩০% থেকে ৬০% টাইমিংয়ের পস মোমেন্ট ভিজ্যুয়াল লেয়ার */}
          <g className="pause-overlay-20">
            {/* চলমান ডিফেন্ডারের পজিশনকে বেস করে তাৎক্ষণিক লাল অফসাইড লাইন */}
            <line x1="230" y1="20" x2="230" y2="220" stroke="#ff4a4a" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* স্ক্রিন নোটিফিকেশন BOX */}
            <rect x="90" y="25" width="220" height="22" fill="#ff4a4a" rx="4" />
            <text x="200" y="40" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
              {language === "en" ? "‖ PAUSED: OFFSIDE POSITION AT RELEASE" : "‖ পস: বল ছাড়ার সময় স্পষ্ট অফসাইড"}
            </text>

            {/* ডিফেন্ডার ও অফসাইড টেক্সট মার্কার */}
            <text x="230" y="95" fill="#ebdccb" fontSize="7" fontWeight="bold" textAnchor="middle">DEFENDER</text>
            <text x="265" y="95" fill="#ff4a4a" fontSize="7" fontWeight="black" textAnchor="middle">OFFSIDE</text>
            
            {/* কিকের এনার্জি রিং */}
            <circle cx="70" cy="160" r="14" fill="none" stroke="#ff4a4a" strokeWidth="1.5" strokeDasharray="3 2" />
          </g>
        </svg>
      )
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#0a0705] text-[#ebdccb] font-sans p-6 md:p-12 relative select-none">
      
      {/* ল্যাঙ্গুয়েজ সুইচ */}
      <div className="absolute top-6 right-6 z-50 flex items-center bg-[#ebdccb]/5 backdrop-blur-md rounded-lg p-1 border border-[#ebdccb]/10 shadow-xl">
        <button
          onClick={() => setLanguage("en")}
          className={`px-4 py-1.5 rounded text-xs font-black tracking-wider transition-all ${
            language === "en" ? "bg-[#ebdccb] text-[#0a0705] skew-x-[-12deg]" : "text-[#ebdccb]/60 hover:text-[#ebdccb]"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage("bn")}
          className={`px-4 py-1.5 rounded text-xs font-black tracking-wider transition-all ${
            language === "bn" ? "bg-[#ebdccb] text-[#0a0705] skew-x-[-12deg]" : "text-[#ebdccb]/60 hover:text-[#ebdccb]"
          }`}
        >
          বাং
        </button>
      </div>

      {/* হেডার */}
      <div className="text-center mt-12 mb-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-[#ebdccb] text-[#0a0705] font-black text-xs uppercase tracking-widest px-4 py-1 skew-x-[-12deg] mb-4">
          <span className="w-1 h-3 bg-[#0a0705] block italic" />
          <span>FIFA LAW 11 ULTIMATE VISUAL INDEX</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-[#ebdccb]">
          {language === "en" ? "THE 18 ACTION SCENARIOS" : "অফসাইড ও ব্যতিক্রমের ১৮টি অ্যাকশন দৃশ্যপট"}
        </h1>
        <p className="mt-4 text-xs md:text-sm font-bold tracking-widest text-[#d9c3b0]/60 uppercase">
          {language === "en" ? "Full Pitch Visual Guides for Instant Rule Understanding" : "ইউজার যাতে পড়া ছাড়াই এনিমেশন দেখে বুঝতে পারে তার জন্য ফুল-পিচ সিনক্রোনাইজড ড্যাশবোর্ড"}
        </p>
      </div>

      {/* গ্রিড লেআউট */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {scenarios.map((item) => (
          <div 
            key={item.id}
            className="flex flex-col bg-[#120e0b]/60 backdrop-blur-sm rounded-xl border border-[#ebdccb]/10 p-5 hover:border-[#ebdccb]/30 transition-all shadow-2xl"
          >
            <div className="w-full relative rounded-lg overflow-hidden border border-[#ebdccb]/5 bg-[#14100d] p-1">
              {item.svg}
              
              <div className="absolute bottom-2 right-10">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-xl ${
                  item.type === "offside" ? "bg-[#ff4a4a] text-white" : "bg-[#10b981] text-[#0a0705]"
                }`}>
                  {item.type === "offside" ? "● OFFSIDE" : "✓ ONSIDE"}
                </span>
              </div>
            </div>

            <div className="mt-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#ebdccb]/40">
                  {item.category[language]}
                </span>
                <h3 className="text-lg font-black text-[#ebdccb] tracking-tight uppercase italic flex items-center mt-1">
                  <span className={`w-1 h-3 mr-2 block skew-x-[-12deg] ${
                    item.type === "offside" ? "bg-[#ff4a4a]" : "bg-[#10b981]"
                  }`} />
                  {item.title[language]}
                </h3>
                <p className="mt-2 text-xs md:text-sm text-[#d9c3b0]/70 leading-relaxed font-normal">
                  {item.desc[language]}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#ebdccb]/5 flex items-center justify-between text-[10px] font-mono text-[#ebdccb]/20">
                <span>VISUAL ATLAS</span>
                <span>CASE_{item.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}