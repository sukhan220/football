// // app/api/fixtures/sync/route.ts
// import { NextResponse } from "next/server";

// // football-data.org এর স্ট্যাটাসকে ফ্রন্টএন্ডের ইউনিফর্ম স্ট্যাটাসে রূপান্তর করার ম্যাপিং
// const statusMapping: Record<string, string> = {
//   SCHEDULED: "SCHEDULED",
//   TIMED: "SCHEDULED",
//   LIVE: "LIVE",
//   IN_PLAY: "LIVE",
//   PAUSED: "LIVE",
//   FINISHED: "FINISHED",
//   POSTPONED: "POSTPONED",
//   SUSPENDED: "POSTPONED",
//   CANCELLED: "CANCELLED",
// };

// export async function GET(req: Request) {
//   try {
//     // ১. ইউআরএল কোয়েরি প্যারামিটার থেকে competitionCode এবং season নেওয়া
//     const { searchParams } = new URL(req.url);
    
//     // WC (FIFA World Cup), PL (Premier League), CL (Champions League) ইত্যাদি
//     const competitionCode = searchParams.get("competitionCode") || "WC"; 
//     const season = searchParams.get("season") || "2026";
//     const statusFilter = searchParams.get("status") || "ALL"; // ALL, LIVE, SCHEDULED, FINISHED

//     // ২. Server Environment থেকে API Key চেক করা
//     const apiKey = process.env.FOOTBALL_DATA_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json(
//         { message: "Server configuration error: API Key is missing" }, 
//         { status: 500 }
//       );
//     }

//     // ৩. football-data.org এপিআই এন্ডপয়েন্ট তৈরি
//     // const targetUrl = `https://api.football-data.org/v4/competitions/${competitionCode}/matches?season=${season}`;
//     const targetUrl = `https://api.football-data.org/v4/competitions/${competitionCode}/matches?season=${season}`;
    
//     const apiResponse = await fetch(targetUrl, {
//       headers: {
//         "X-Auth-Token": apiKey,
//       },
//       next: { revalidate: 30 } // ৩০ সেকেন্ডের জন্য ক্যাশ করবে যাতে প্রতি রিফ্রেশে থার্ড-পার্টি API ব্লক না করে
//     });

//     if (!apiResponse.ok) {
//       const errText = await apiResponse.text();
//       console.error("Football-Data API Public Error:", errText);
//       return NextResponse.json(
//         { message: "ফুটবল এপিআই ডাটা সরবরাহ করতে পারেনি।" }, 
//         { status: 400 }
//       );
//     }

//     const footballData = await apiResponse.json();
//     const matches = footballData.matches || [];

//     // ৪. থার্ড-পার্টি ডাটাকে আপনার ফ্রন্টএন্ডের ইন্টারফেস (Fixture) অনুযায়ী সাজানো (Mapping)
//     let formattedFixtures = matches.map((match: any) => {
//       const currentStatus = statusMapping[match.status] || "SCHEDULED";
//       const roundName = match.stage === "REGULAR_SEASON" ? `Matchday ${match.matchday}` : match.stage;

//       return {
//         id: String(match.id),
//         season: String(season),
//         homeTeam: match.homeTeam.shortName || match.homeTeam.name,
//         awayTeam: match.awayTeam.shortName || match.awayTeam.name,
//         homeTeamLogo: match.homeTeam.crest || null,
//         awayTeamLogo: match.awayTeam.crest || null,
//         matchDate: match.utcDate,
//         round: roundName,
//         venue: match.venue || null,
//         homeScore: match.score.fullTime.home !== null ? match.score.fullTime.home : null,
//         awayScore: match.score.fullTime.away !== null ? match.score.fullTime.away : null,
//         status: currentStatus,
//         category: {
//           id: footballData.competition?.id ? String(footballData.competition.id) : "custom-id",
//           name: footballData.competition?.name || "Football Tournament",
//         },
//       };
//     });

//     // ৫. যদি ফ্রন্টএন্ড থেকে নির্দিষ্ট কোনো স্ট্যাটাস ফিল্টার পাঠানো হয় (যেমন: LIVE বা FINISHED)
//     if (statusFilter && statusFilter !== "ALL") {
//       formattedFixtures = formattedFixtures.filter(
//         (fixture: any) => fixture.status === statusFilter
//       );
//     }

//     // টাইমলাইন অনুযায়ী সর্ট করা (কাছাকাছি সময়ের ম্যাচগুলো আগে থাকবে)
//     formattedFixtures.sort((a: any, b: any) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());

//     return NextResponse.json(formattedFixtures, {
//       headers: {
//         "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15", 
//       },
//     });

//   } catch (error: any) {
//     console.error("GET_PUBLIC_FIXTURES_FROM_API_ERROR:", error);
//     return NextResponse.json(
//       { message: "ডাটা লোড করতে সমস্যা হয়েছে।" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// // ফুটবল এপিআই-এর স্ট্যাটাসকে আপনার MatchStatus এনামে কনভার্ট করার ম্যাপিং
// const statusMapping: Record<string, "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" | "CANCELLED"> = {
//   SCHEDULED: "SCHEDULED",
//   TIMED: "SCHEDULED",
//   LIVE: "LIVE",
//   IN_PLAY: "LIVE",
//   PAUSED: "LIVE",
//   FINISHED: "FINISHED",
//   POSTPONED: "POSTPONED",
//   SUSPENDED: "POSTPONED",
//   CANCELLED: "CANCELLED",
// };

// // স্লাগ জেনারেট করার হেল্পার ফাংশন
// function slugify(text: string): string {
//   return text
//     .toString()
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/[^\w\-]+/g, "")
//     .replace(/\-\-+/g, "-");
// }

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const competitionCode = searchParams.get("competitionCode") || "WC"; // default World Cup ('WC')
//     const seasonYear = searchParams.get("season") || "2026";

//     const apiKey = process.env.FOOTBALL_DATA_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json(
//         { message: "Server configuration error: API Key is missing" }, 
//         { status: 500 }
//       );
//     }

//     // ১. ফুটবল API থেকে লাইভ ডাটা ফেচ করা
//     const targetUrl = `https://api.football-data.org/v4/competitions/${competitionCode}/matches?season=${seasonYear}`;
//     const apiResponse = await fetch(targetUrl, {
//       headers: { "X-Auth-Token": apiKey },
//       next: { revalidate: 30 } // ৩০ সেকেন্ড ক্যাশিং
//     });

//     if (!apiResponse.ok) {
//       return NextResponse.json({ message: "ফুটবল এপিআই থেকে ডাটা পাওয়া যায়নি।" }, { status: 400 });
//     }

//     const footballData = await apiResponse.json();
    
//     const matches = footballData.matches || [];

//     const compName = footballData.competition?.name || "FIFA World Cup";
//     const compSlug = competitionCode.toLowerCase(); 
//     const seasonSlug = `${compSlug}-${seasonYear}`; 

//     // ২. COMPETITION আপসার্ট (apiCode দিয়ে ট্র্যাকিং)
//     const dbCompetition = await prisma.competition.upsert({
//       where: { slug: compSlug },
//       update: { apiCode: competitionCode },
//       create: {
//         name: compName,
//         slug: compSlug,
//         apiCode: competitionCode,
//         type: competitionCode === "WC" ? "INTERNATIONAL" : "CLUB"
//       }
//     });

//     // ৩. SEASON আপসার্ট
//     const dbSeason = await prisma.season.upsert({
//       where: { slug: seasonSlug },
//       update: { isActive: true }, 
//       create: {
//         year: seasonYear,
//         slug: seasonSlug,
//         isActive: true,
//         competitionId: dbCompetition.id
//       }
//     });

//     // ৪. টিমগুলো ডাটাবেজে এনশিওর করা (apiId দিয়ে ট্র্যাকিং)
//     const dbTeamsCache: Record<number, string> = {}; // দ্রুত আইডির রিলেশন খোঁজার জন্য মেমোরি ক্যাশ

//     for (const match of matches) {
//       // হোম টিম প্রসেস
//       if (match.homeTeam?.id && !dbTeamsCache[match.homeTeam.id]) {
//         const homeTeamSlug = slugify(match.homeTeam.name);
//         const team = await prisma.team.upsert({
//           where: { apiId: match.homeTeam.id },
//           update: { logo: match.homeTeam.crest || null },
//           create: {
//             apiId: match.homeTeam.id,
//             name: match.homeTeam.shortName || match.homeTeam.name,
//             slug: homeTeamSlug,
//             logo: match.homeTeam.crest || null,
//             isNational: competitionCode === "WC"
//           }
//         });
//         dbTeamsCache[match.homeTeam.id] = team.id;
//       }

//       // অ্যাওয়ে টিম প্রসেস
//       if (match.awayTeam?.id && !dbTeamsCache[match.awayTeam.id]) {
//         const awayTeamSlug = slugify(match.awayTeam.name);
//         const team = await prisma.team.upsert({
//           where: { apiId: match.awayTeam.id },
//           update: { logo: match.awayTeam.crest || null },
//           create: {
//             apiId: match.awayTeam.id,
//             name: match.awayTeam.shortName || match.awayTeam.name,
//             slug: awayTeamSlug,
//             logo: match.awayTeam.crest || null,
//             isNational: competitionCode === "WC"
//           }
//         });
//         dbTeamsCache[match.awayTeam.id] = team.id;
//       }
//     }

//     // ৫. MATCHES আপসার্ট (apiId দিয়ে ট্র্যাকিং - মেইন ম্যাজিক ✨)
//     const syncedMatches = [];
    
//     for (const match of matches) {
//       const currentStatus = statusMapping[match.status] || "SCHEDULED";
//       const homeTeamUUID = dbTeamsCache[match.homeTeam.id];
//       const awayTeamUUID = dbTeamsCache[match.awayTeam.id];

//       if (!homeTeamUUID || !awayTeamUUID) continue; // কোনো কারণে টিম ডাটা মিস হলে স্কিপ করবে

//       // গ্রুপ এবং রাউন্ডের নাম ফরমেট করা
//       let displayGroupName = match.group ? match.group.replace("_", " ") : null; // "GROUP_A" -> "GROUP A"
//       let roundName = match.stage === "REGULAR_SEASON" ? `Matchday ${match.matchday}` : match.stage;

//       const matchRecord = await prisma.match.upsert({
//         where: { apiId: match.id }, // এপিআই-এর ইউনিক ম্যাচ আইডি দিয়ে খুঁজবে
//         update: {
//           homeScore: match.score?.fullTime?.home ?? 0,
//           awayScore: match.score?.fullTime?.away ?? 0,
//           status: currentStatus,
//           elapsedTime: match.score?.duration === "REGULAR" ? 90 : 0,
//           matchDate: new Date(match.utcDate),
//           round: roundName,
//           groupName: displayGroupName,
//           stage: match.stage
//         },
//         create: {
//           apiId: match.id,
//           seasonId: dbSeason.id,
//           homeTeamId: homeTeamUUID,
//           awayTeamId: awayTeamUUID,
//           matchDate: new Date(match.utcDate),
//           round: roundName,
//           groupName: displayGroupName,
//           stage: match.stage,
//           venue: match.venue || "TBD",
//           homeScore: match.score?.fullTime?.home ?? 0,
//           awayScore: match.score?.fullTime?.away ?? 0,
//           status: currentStatus,
//           elapsedTime: 0
//         }
//       });

//       syncedMatches.push(matchRecord);
//     }

//     return NextResponse.json({
//       success: true,
//       message: `${syncedMatches.length} টি ম্যাচ সফলভাবে ডাটাবেজে ক্রিয়েট/আপডেট (Sync) হয়েছে!`,
//     });

//   } catch (error: any) {
//     console.error("FOOTBALL_SYNC_ERROR:", error);
//     return NextResponse.json({ message: "ডাটাবেজ সিঙ্ক করতে অভ্যন্তরীণ সমস্যা হয়েছে।" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";

console.log("FIXTURES_ROUTE_LOADED (DEBUG MODE)");

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const competitionCode = searchParams.get("competitionCode") || "WC";
    const seasonYear = searchParams.get("season") || "2026";

    console.log("GET_FIXTURES_DEBUG_PARAMS:", { competitionCode, seasonYear });

    const apiUrl = `https://api.football-data.org/v4/competitions/${competitionCode}/matches?season=${seasonYear}`;
    
    const apiResponse = await fetch(apiUrl, {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY || "YOUR_API_TOKEN_HERE",
      },
      next: { revalidate: 0 }
    });

    if (!apiResponse.ok) {
      throw new Error(`Football API responded with status: ${apiResponse.status}`);
    }

    // ফুটবল API থেকে আসা মূল রেসপন্স

    const apiData = await apiResponse.json();

    // কোনো ডাটাবেজ অপারেশন ছাড়াই সরাসরি র-ডাটা রিটার্ন করা হচ্ছে ডিবাগের জন্য
    return NextResponse.json({
      success: true,
      message: "API থেকে ডাটা সফলভাবে ফেচ করা হয়েছে (Database Bypass Mode)",
      competition: apiData.competition,
      filters: apiData.filters,
      resultSet: apiData.resultSet,
      matchesCount: apiData.matches?.length || 0,
      matches: apiData.matches || [] // এখানে সব ম্যাচের অবজেক্ট দেখতে পাবেন
    });

  } catch (error: any) {
    console.error("GET_FIXTURES_DEBUG_ERROR:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "API থেকে ডাটা গেট করতে সমস্যা হয়েছে।", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
