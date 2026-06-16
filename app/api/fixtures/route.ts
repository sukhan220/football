// fixtures API রাউট: ডাটাবেজ থেকে ম্যাচ ফেচ করে ফ্রন্টএন্ডে পাঠানোর জন্য
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const competitionCode = searchParams.get("competitionCode") || "WC";
    const seasonYear = searchParams.get("season") || "2026";

    // নতুন স্কিমা রিলেশন অনুযায়ী ডাটাবেজ থেকে ম্যাচ ফেচ করা
    const matches = await prisma.match.findMany({
      where: {
        season: {
          year: seasonYear,
          competition: {
            apiCode: competitionCode,
          },
        },
      },
      include: {
        homeTeam: true,  // হোম টিমের লোগো ও নাম নেওয়ার জন্য
        awayTeam: true,  // অ্যাওয়ে টিমের লোগো ও নাম নেওয়ার জন্য
        season: true,
      },
      orderBy: {
        matchDate: "asc", // ডেট অনুযায়ী সিরিয়ালি সাজানোর জন্য
      },
    });

    // ফ্রন্টএন্ডের ইন্টারফেস স্ট্রাকচারের সাথে মিল রেখে ডাটা ম্যাপ করা
    const formattedFixtures = matches.map((match) => {
      
      // ডাটাবেজে যেভাবে আছে (যেমন: "GROUP L") সেটিকে ফ্রন্টএন্ডের ফরম্যাট (যেমন: "GROUP_L")-এ কনভার্ট করা
      // যদি স্পেস দিয়ে থাকে ("GROUP L"), তবে সেটিকে আন্ডারস্কোর ("GROUP_L") করে নেওয়া হচ্ছে সেফটির জন্য
      const dbGroupName = (match as any).groupName || null;
      const formattedGroupName = dbGroupName 
        ? dbGroupName.trim().toUpperCase().replace(/\s+/g, "_") 
        : null;

      // ডাটাবেজের stage ফিল্ড সরাসরি নেওয়া হচ্ছে (যেমন: "GROUP_STAGE", "LAST_32" ইত্যাদি)
      const dbStage = (match as any).stage || match.round || "";
      const formattedStage = dbStage.trim().toUpperCase().replace(/\s+/g, "_");

      return {
        id: match.id,
        season: match.season.year,
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        homeTeamLogo: match.homeTeam.logo,
        awayTeamLogo: match.awayTeam.logo,
        matchDate: match.matchDate.toISOString(),
        round: match.round,
        groupName: formattedGroupName, // ডাটাবেজ থেকে সরাসরি গ্রুপ (যেমন: 'GROUP_I', 'GROUP_L') চলে যাবে
        stage: formattedStage,         // ডাটাবেজ থেকে সরাসরি স্টেজ (যেমন: 'GROUP_STAGE', 'LAST_32') চলে যাবে
        venue: match.venue,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        status: match.status,
      };
    });

    return NextResponse.json(formattedFixtures);
  } catch (error: any) {
    console.error("GET_FIXTURES_ERROR:", error);
    return NextResponse.json(
      { message: "ডাটাবেজ থেকে ফিক্সচার লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
