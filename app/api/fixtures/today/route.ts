import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const statusMapping: Record<string, "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" | "CANCELLED"> = {
  SCHEDULED: "SCHEDULED",
  TIMED: "SCHEDULED",
  LIVE: "LIVE",
  IN_PLAY: "LIVE",
  PAUSED: "LIVE",
  FINISHED: "FINISHED",
  POSTPONED: "POSTPONED",
  SUSPENDED: "POSTPONED",
  CANCELLED: "CANCELLED",
};

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const competitionCode = searchParams.get("competitionCode") || "WC"; 
    const seasonYear = searchParams.get("season") || "2026";

    // 📅 শুধুমাত্র আজকের তারিখ বের করার লজিক (YYYY-MM-DD ফরম্যাট)
    const todayStr = new Date().toISOString().split('T')[0]; 

    console.log("SYNCING_TODAY_MATCHES_FOR:", { competitionCode, todayStr });

    // 🚀 এখানে সিজনের সব ম্যাচের বদলে শুধুমাত্র আজকের তারিখের ফিল্টার যোগ করা হয়েছে
    const apiUrl = `https://api.football-data.org/v4/competitions/${competitionCode}/matches?dateFrom=${todayStr}&dateTo=${todayStr}`;
    
    const apiResponse = await fetch(apiUrl, {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY || "YOUR_API_TOKEN_HERE",
      },
      next: { revalidate: 0 }
    });

    if (!apiResponse.ok) {
      return NextResponse.json({ message: "ফুটবল এপিআই থেকে ডাটা পাওয়া যায়নি।" }, { status: 400 });
    }

    const footballData = await apiResponse.json();
    console.log("FOOTBALL_API_RESPONSE_FOR_TODAY:", footballData);
    const matches = footballData.matches || [];

    // যদি আজ কোনো ম্যাচ না থাকে তবে অযথা ডাটাবেজ কুয়েরি না করে এখানেই শেষ করবে
    if (matches.length === 0) {
      return NextResponse.json({ success: true, message: "আজ কোনো ম্যাচ নেই।" });
    }

    const compName = footballData.competition?.name || "FIFA World Cup";
    const compSlug = competitionCode.toLowerCase(); 
    const seasonSlug = `${compSlug}-${seasonYear}`; 

    // ২. COMPETITION আপসার্ট
    const dbCompetition = await prisma.competition.upsert({
      where: { slug: compSlug },
      update: { apiCode: competitionCode },
      create: {
        name: compName,
        slug: compSlug,
        apiCode: competitionCode,
        type: competitionCode === "WC" ? "INTERNATIONAL" : "CLUB"
      }
    });

    // ৩. SEASON আপসার্ট
    const dbSeason = await prisma.season.upsert({
      where: { slug: seasonSlug },
      update: { isActive: true }, 
      create: {
        year: seasonYear,
        slug: seasonSlug,
        isActive: true,
        competitionId: dbCompetition.id
      }
    });

    // ডামি TBD টিম এনশিওর করা
    const tbdTeam = await prisma.team.upsert({
      where: { apiId: 0 }, 
      update: {},
      create: {
        apiId: 0,
        name: "To Be Determined",
        slug: "to-be-determined-0",
        logo: null,
        isNational: competitionCode === "WC"
      }
    });

    // ৪. টিমগুলো ডাটাবেজে এনшиওর করা (শুধুমাত্র আজকের ম্যাচের টিমগুলো)
    const dbTeamsCache: Record<number, string> = {}; 

    for (const match of matches) {
      if (match.homeTeam?.id && !dbTeamsCache[match.homeTeam.id]) {
        const homeTeamSlug = `${slugify(match.homeTeam.name)}-${match.homeTeam.id}`;
        const team = await prisma.team.upsert({
          where: { apiId: match.homeTeam.id },
          update: { logo: match.homeTeam.crest || null },
          create: {
            apiId: match.homeTeam.id,
            name: match.homeTeam.shortName || match.homeTeam.name,
            slug: homeTeamSlug,
            logo: match.homeTeam.crest || null,
            isNational: competitionCode === "WC"
          }
        });
        dbTeamsCache[match.homeTeam.id] = team.id;
      }

      if (match.awayTeam?.id && !dbTeamsCache[match.awayTeam.id]) {
        const awayTeamSlug = `${slugify(match.awayTeam.name)}-${match.awayTeam.id}`;
        const team = await prisma.team.upsert({
          where: { apiId: match.awayTeam.id },
          update: { logo: match.awayTeam.crest || null },
          create: {
            apiId: match.awayTeam.id,
            name: match.awayTeam.shortName || match.awayTeam.name,
            slug: awayTeamSlug,
            logo: match.awayTeam.crest || null,
            isNational: competitionCode === "WC"
          }
        });
        dbTeamsCache[match.awayTeam.id] = team.id;
      }
    }

    // ৫. MATCHES আপসার্ট করার কুয়েরিগুলো ট্রানজেকশনে জমা করা (Performance Booster 🚀)
    const prismaQueries = [];
    
    for (const match of matches) {
      const currentStatus = statusMapping[match.status] || "SCHEDULED";
      const homeTeamUUID = match.homeTeam?.id ? dbTeamsCache[match.homeTeam.id] : tbdTeam.id;
      const awayTeamUUID = match.awayTeam?.id ? dbTeamsCache[match.awayTeam.id] : tbdTeam.id;

      let displayGroupName = match.group ? match.group.replace("_", " ") : null;
      let roundName = match.stage === "REGULAR_SEASON" ? `Matchday ${match.matchday}` : match.stage;

      prismaQueries.push(
        prisma.match.upsert({
          where: { apiId: match.id }, 
          update: {
            homeTeamId: homeTeamUUID,
            awayTeamId: awayTeamUUID,
            homeScore: match.score?.fullTime?.home ?? 0,
            awayScore: match.score?.fullTime?.away ?? 0,
            status: currentStatus,
            elapsedTime: match.score?.duration === "REGULAR" ? 90 : 0,
            matchDate: new Date(match.utcDate),
            round: roundName,
            groupName: displayGroupName,
            stage: match.stage
          },
          create: {
            apiId: match.id,
            seasonId: dbSeason.id,
            homeTeamId: homeTeamUUID,
            awayTeamId: awayTeamUUID,
            matchDate: new Date(match.utcDate),
            round: roundName,
            groupName: displayGroupName,
            stage: match.stage,
            venue: match.venue || "TBD",
            homeScore: match.score?.fullTime?.home ?? 0,
            awayScore: match.score?.fullTime?.away ?? 0,
            status: currentStatus,
            elapsedTime: 0
          }
        })
      );
    }

    // সব ম্যাচ একবারে দ্রুত ট্রানজেকশন আকারে এক্সিকিউট হবে
    const syncedMatches = await prisma.$transaction(prismaQueries);

    return NextResponse.json({
      success: true,
      message: `আজকের ${syncedMatches.length} টি ম্যাচ সফলভাবে লাইভ আপডেট হয়েছে!`,
    });

  } catch (error: any) {
    console.error("FOOTBALL_SYNC_ERROR:", error);
    return NextResponse.json({ message: "ডাটাবেজ সিঙ্ক করতে অভ্যন্তরীণ সমস্যা হয়েছে।" }, { status: 500 });
  }
}