import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const competitionCode = searchParams.get("competitionCode") || "WC";
    const seasonYear = searchParams.get("season") || "2026";

    // নতুন স্কিমা রিলেশন অনুযায়ী ডাটাবেজ থেকে ম্যাচ ফেচ করা
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
        homeTeam: true,  // হোম টিমের লোগো ও নাম নেওয়ার জন্য
        awayTeam: true,  // অ্যাওয়ে টিমের লোগো ও নাম নেওয়ার জন্য
        season: true,
      },
      orderBy: {
        matchDate: "asc", // ডেট অনুযায়ী সিরিয়ালি সাজানোর জন্য
      },
    });

    // ফ্রন্টএন্ডের ইন্টারফেস স্ট্রাকচারের সাথে মিল রেখে ডাটা ম্যাপ করা
    const formattedFixtures = matches.map((match) => ({
      id: match.id,
      season: match.season.year,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      homeTeamLogo: match.homeTeam.logo,
      awayTeamLogo: match.awayTeam.logo,
      matchDate: match.matchDate.toISOString(),
      round: match.round,
      venue: match.venue,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      status: match.status,
    }));

    return NextResponse.json(formattedFixtures);
  } catch (error: any) {
    console.error("GET_FIXTURES_ERROR:", error);
    return NextResponse.json(
      { message: "ডাটাবেজ থেকে ফিক্সচার লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}