


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ফুটবল এপিআই-এর স্ট্যাটাসকে আপনার MatchStatus এনামে কনভার্ট করার ম্যাপিং
const statusMapping: Record<string, "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" | "CANCELLED"> = {
  SCHEDULED: "SCHEDULED",
  TIMED: "SCHEDULED", // API-র TIMED স্ট্যাটাসকে SCHEDULED করা হলো
  LIVE: "LIVE",
  IN_PLAY: "LIVE",
  PAUSED: "LIVE",
  FINISHED: "FINISHED",
  POSTPONED: "POSTPONED",
  SUSPENDED: "POSTPONED",
  CANCELLED: "CANCELLED",
};

// স্লাগ জেনারেট করার হেল্পার ফাংশন
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
    const competitionCode = searchParams.get("competitionCode") || "WC"; // default World Cup ('WC')
    const seasonYear = searchParams.get("seasons") || "2026";

    const apiKey = process.env.FOOTBALL_DATA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "Server configuration error: API Key is missing" }, 
        { status: 500 }
      );
    }

    // ১. ফুটবল API থেকে লাইভ ডাটা ফেচ করা
    const targetUrl = `https://api.football-data.org/v4/competitions/${competitionCode}/matches?season=${seasonYear}`;
    const apiResponse = await fetch(targetUrl, {
      headers: { "X-Auth-Token": apiKey },
      next: { revalidate: 30 } // ৩০ সেকেন্ড ক্যাশিং
    });

    if (!apiResponse.ok) {
      return NextResponse.json({ message: "ফুটবল এপিআই থেকে ডাটা পাওয়া যায়নি।" }, { status: 400 });
    }

    const footballData = await apiResponse.json();
    const matches = footballData.matches || [];

    console.log(`Fetched ${matches.length} matches for ${competitionCode} ${seasonYear}`);

    const compName = footballData.competition?.name || "FIFA World Cup";
    const compSlug = competitionCode.toLowerCase(); 
    const seasonSlug = `${compSlug}-${seasonYear}`; 

    // ২. COMPETITION আপসার্ট
    let dbCompetition = await prisma.competition.findFirst({
      where: {
        OR: [
          { apiCode: competitionCode },
          { slug: compSlug }
        ]
      }
    });

    if (dbCompetition) {
      dbCompetition = await prisma.competition.update({
        where: { id: dbCompetition.id },
        data: { apiCode: competitionCode, name: compName }
      });
    } else {
      dbCompetition = await prisma.competition.create({
        data: {
          name: compName,
          slug: compSlug,
          apiCode: competitionCode,
          type: competitionCode === "WC" ? "INTERNATIONAL" : "CLUB"
        }
      });
    }

    // ৩. SEASON আপসার্ট
    let dbSeason = await prisma.season.findFirst({
      where: {
        OR: [
          { slug: seasonSlug },
          {
            competitionId: dbCompetition.id,
            year: seasonYear
          }
        ]
      }
    });

    if (dbSeason) {
      dbSeason = await prisma.season.update({
        where: { id: dbSeason.id },
        data: { isActive: true, slug: seasonSlug }
      });
    } else {
      dbSeason = await prisma.season.create({
        data: {
          year: seasonYear,
          slug: seasonSlug,
          isActive: true,
          competitionId: dbCompetition.id
        }
      });
    }

    // 🛠️ নকআউটের আনডিফাইনড টিমের জন্য একটি ডিফল্ট TBD (To Be Decided) ব্যাকআপ টিম তৈরি/খুঁজে রাখা
    let tbdTeam = await prisma.team.findFirst({ where: { slug: "tbd" } });
    if (!tbdTeam) {
      tbdTeam = await prisma.team.create({
        data: {
          apiId: 0,
          name: "To Be Decided",
          slug: "tbd",
          logo: null,
          isNational: competitionCode === "WC"
        }
      });
    }

    const dbTeamsCache: Record<number, string> = { 0: tbdTeam.id }; 

    // ৪. টিমগুলো ডাটাবেজে এনশিওর করা
    for (const match of matches) {
      // --- হোম টিম প্রসেস ---
      if (match.homeTeam?.id && !dbTeamsCache[match.homeTeam.id]) {
        const homeTeamSlug = slugify(match.homeTeam.shortName || match.homeTeam.name || "home-team");
        const teamName = match.homeTeam.shortName || match.homeTeam.name;
        const teamLogo = match.homeTeam.crest || null;

        const existingTeam = await prisma.team.findFirst({
          where: {
            OR: [
              { apiId: match.homeTeam.id },
              { slug: homeTeamSlug }
            ]
          }
        });

        let team;
        if (existingTeam) {
          team = await prisma.team.update({
            where: { id: existingTeam.id },
            data: {
              apiId: match.homeTeam.id,
              name: teamName,
              logo: teamLogo,
            }
          });
        } else {
          team = await prisma.team.create({
            data: {
              apiId: match.homeTeam.id,
              name: teamName,
              slug: homeTeamSlug,
              logo: teamLogo,
              isNational: competitionCode === "WC"
            }
          });
        }
        dbTeamsCache[match.homeTeam.id] = team.id;
      }

      // --- অ্যাওয়ে টিম প্রসেস ---
      if (match.awayTeam?.id && !dbTeamsCache[match.awayTeam.id]) {
        const awayTeamSlug = slugify(match.awayTeam.shortName || match.awayTeam.name || "away-team");
        const teamName = match.awayTeam.shortName || match.awayTeam.name;
        const teamLogo = match.awayTeam.crest || null;

        const existingTeam = await prisma.team.findFirst({
          where: {
            OR: [
              { apiId: match.awayTeam.id },
              { slug: awayTeamSlug }
            ]
          }
        });

        let team;
        if (existingTeam) {
          team = await prisma.team.update({
            where: { id: existingTeam.id },
            data: {
              apiId: match.awayTeam.id,
              name: teamName,
              logo: teamLogo,
            }
          });
        } else {
          team = await prisma.team.create({
            data: {
              apiId: match.awayTeam.id,
              name: teamName,
              slug: awayTeamSlug,
              logo: teamLogo,
              isNational: competitionCode === "WC"
            }
          });
        }
        dbTeamsCache[match.awayTeam.id] = team.id;
      }
    }

    // ৫. MATCHES আপসার্ট
    const syncedMatches = [];
    
    for (const match of matches) {
      const currentStatus = statusMapping[match.status] || "SCHEDULED";
      
      // যদি আইডি থাকে তবে ক্যাশ থেকে নিবে, না থাকলে TBD আইডিতে অ্যাসাইন হবে
      const homeTeamUUID = match.homeTeam?.id ? dbTeamsCache[match.homeTeam.id] : tbdTeam.id;
      const awayTeamUUID = match.awayTeam?.id ? dbTeamsCache[match.awayTeam.id] : tbdTeam.id;

      if (!homeTeamUUID || !awayTeamUUID) continue; 

      // নকআউট ম্যাচের জন্য গ্রুপ নেম ফিক্স
      let displayGroupName = match.group 
        ? match.group.replace("_", " ") 
        : match.stage.replace("_", " "); 
        
      let roundName = match.stage === "REGULAR_SEASON" ? `Matchday ${match.matchday}` : match.stage.replace("_", " ");

      // সেফ স্কোর লজিক: ম্যাচ শেষ না হলে বা স্কোর লাইভ না হলে null বা 0 সেট করা
      const homeScoreVal = match.score?.fullTime?.home !== null ? match.score?.fullTime?.home : 0;
      const awayScoreVal = match.score?.fullTime?.away !== null ? match.score?.fullTime?.away : 0;

      const matchRecord = await prisma.match.upsert({
        where: { apiId: match.id }, 
        update: {
          homeTeamId: homeTeamUUID,
          awayTeamId: awayTeamUUID,
          homeScore: homeScoreVal,
          awayScore: awayScoreVal,
          status: currentStatus,
          elapsedTime: match.status === "FINISHED" ? 90 : 0,
          matchDate: new Date(match.utcDate),
          round: roundName,
          groupName: displayGroupName, 
          stage: match.stage,
          venue: match.venue || "TBD",
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
          homeScore: homeScoreVal,
          awayScore: awayScoreVal,
          status: currentStatus,
          elapsedTime: 0
        }
      });

      syncedMatches.push(matchRecord);
    }

    return NextResponse.json({
      success: true,
      message: `${syncedMatches.length} টি ম্যাচ সফলভাবে ডাটাবেজে ক্রিয়েট/আপডেট (Sync) হয়েছে!`,
    });

  } catch (error: any) {
    console.error("FOOTBALL_SYNC_ERROR:", error);
    return NextResponse.json({ message: "ডাটাবেজ সিঙ্ক করতে অভ্যন্তরীণ সমস্যা হয়েছে।" }, { status: 500 });
  }
}