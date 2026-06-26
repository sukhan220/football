

// // // // import { NextResponse } from "next/server";
// // // // import { PrismaClient } from "@/app/generated/prisma/client";

// // // // const prisma = new PrismaClient();

// // // // // এপিআই এর অফিশিয়াল নামের সাথে আপনার ডাটাবেজের নামের ম্যাপিং ডিকশনারি
// // // // const API_TO_DB_NAME_MAP: Record<string, string> = {
// // // //   "south korea": "korea republic",
// // // //   "united states": "usa",
// // // //   "united states of america": "usa",
// // // //   "bosnia and herzegovina": "bosnia-h",
// // // //   "cape verde islands": "cape verde",
// // // //   "cabo verde": "cape verde",
// // // // };

// // // // export async function GET(request: Request) {
// // // //   try {
// // // //     const { searchParams } = new URL(request.url);
// // // //     const competitionCode = searchParams.get("competitionCode") || "WC"; 
// // // //     const seasonYear = searchParams.get("season") || "2026";

// // // //     // ----------------------------------------------------------------
// // // //     // ১. ডাটাবেজ থেকে সিজন এবং ম্যাচের গ্রুপ নেম-এর ম্যাপিং ডাটা আনা
// // // //     // ----------------------------------------------------------------
// // // //     const season = await prisma.season.findFirst({
// // // //       where: {
// // // //         year: seasonYear,
// // // //         competition: { apiCode: competitionCode },
// // // //       },
// // // //     });

// // // //     if (!season) {
// // // //       return NextResponse.json({ error: "Season not found!" }, { status: 404 });
// // // //     }

// // // //     const dbMatches = await prisma.match.findMany({
// // // //       where: {
// // // //         seasonId: season.id,
// // // //         groupName: { not: null }
// // // //       },
// // // //       include: {
// // // //         homeTeam: { select: { id: true, name: true } },
// // // //         awayTeam: { select: { id: true, name: true } }
// // // //       }
// // // //     });

// // // //     // টিম নেম থেকে গ্রুপ এবং টিম আইডি ট্র্যাক করার ম্যাপ
// // // //     const teamGroupMap: Record<string, string> = {};
// // // //     const teamIdMap: Record<string, string> = {};
    
// // // //     dbMatches.forEach(match => {
// // // //       if (match.groupName) {
// // // //         // ডাবল স্পেস হ্যান্ডেল করার জন্য Regex ক্লিনআপ
// // // //         const cleanGroup = match.groupName
// // // //           .replace(/GROUP/i, "")
// // // //           .replace(/[^a-zA-Z0-9]/g, "")
// // // //           .toUpperCase()
// // // //           .trim();
        
// // // //         const homeNameLower = match.homeTeam.name.toLowerCase().trim();
// // // //         const awayNameLower = match.awayTeam.name.toLowerCase().trim();

// // // //         teamGroupMap[homeNameLower] = cleanGroup;
// // // //         teamGroupMap[awayNameLower] = cleanGroup;

// // // //         teamIdMap[homeNameLower] = match.homeTeam.id;
// // // //         teamIdMap[awayNameLower] = match.awayTeam.id;
// // // //       }
// // // //     });

// // // //     // ----------------------------------------------------------------
// // // //     // ২. football-data.org থেকে গ্লোবাল স্ট্যান্ডিংস ডাটা ফেচ করা
// // // //     // ----------------------------------------------------------------
// // // //     const apiResponse = await fetch(
// // // //       `https://api.football-data.org/v4/competitions/${competitionCode}/standings?season=${seasonYear}`,
// // // //       {
// // // //         headers: {
// // // //           "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY || "",
// // // //         },
// // // //         next: { revalidate: 300 },
// // // //       }
// // // //     );

// // // //     if (!apiResponse.ok) {
// // // //       throw new Error(`Football-data.org returned status ${apiResponse.status}`);
// // // //     }

// // // //     const apiData = await apiResponse.json();
// // // //     const apiStandings = apiData.standings || [];

// // // //     // ----------------------------------------------------------------
// // // //     // ৩. ডাটা কম্বাইন ও গ্রুপ প্রসেসিং করা
// // // //     // ----------------------------------------------------------------
// // // //     const groupedStandings: Record<string, any[]> = {};

// // // //     apiStandings.forEach((groupItem: any) => {
// // // //       if (groupItem.type !== "TOTAL") return;

// // // //       const tableRows = groupItem.table || [];

// // // //       tableRows.forEach((row: any) => {
// // // //         const rawTeamName = row.team?.name;
// // // //         if (!rawTeamName) return;

// // // //         const apiTeamNameLower = rawTeamName.toLowerCase().trim();
// // // //         const mappedName = API_TO_DB_NAME_MAP[apiTeamNameLower] || apiTeamNameLower;

// // // //         let finalGroup = teamGroupMap[mappedName];
// // // //         const teamId = teamIdMap[mappedName];
        
// // // //         if (!finalGroup) {
// // // //           if (groupItem.group) {
// // // //             finalGroup = groupItem.group.replace(/GROUP/i, "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().trim();
// // // //           } else {
// // // //             finalGroup = "OVERALL";
// // // //           }
// // // //         }

// // // //         const teamStats = {
// // // //           teamId: teamId || null,
// // // //           name: rawTeamName,
// // // //           logo: row.team?.crest || null,
// // // //           mp: row.playedGames || 0,
// // // //           w: row.won || 0,
// // // //           d: row.draw || 0,
// // // //           l: row.lost || 0,
// // // //           gf: row.goalsFor || 0,
// // // //           ga: row.goalsAgainst || 0,
// // // //           gd: row.goalDifference || 0,
// // // //           pts: row.points || 0,
// // // //         };

// // // //         if (!groupedStandings[finalGroup]) {
// // // //           groupedStandings[finalGroup] = [];
// // // //         }
// // // //         groupedStandings[finalGroup].push(teamStats);
// // // //       });
// // // //     });

// // // //     // ----------------------------------------------------------------
// // // //     // ৪. সর্টিং, পজিশন সেট এবং আপনার রিলেশনাল টেবিলে ডাটাবেজ সিঙ্ক
// // // //     // ----------------------------------------------------------------
// // // //     const finalResponse: Record<string, any[]> = {};
// // // //     const sortedGroups = Object.keys(groupedStandings).sort();

// // // //     for (const group of sortedGroups) {
// // // //       const sortedTeams = groupedStandings[group].sort((a, b) => {
// // // //         if (b.pts !== a.pts) return b.pts - a.pts;
// // // //         return b.gd - a.gd;
// // // //       });

// // // //       // ৪.১: ডাটাবেজের 'Standing' মেইন টেবিলে গ্রুপের এন্ট্রি নিশ্চিত করা (GROUP L, GROUP G ফরম্যাট)
// // // //       const dbGroupName = `GROUP ${group}`;
// // // //       const standingParent = await prisma.standing.upsert({
// // // //         where: {
// // // //           seasonId_groupName: {
// // // //             seasonId: season.id,
// // // //             groupName: dbGroupName,
// // // //           },
// // // //         },
// // // //         update: {}, // গ্রুপ অলরেডি ক্রিয়েট থাকলে কিছু করার দরকার নেই
// // // //         create: {
// // // //           seasonId: season.id,
// // // //           groupName: dbGroupName,
// // // //         },
// // // //       });

// // // //       // ৪.২: 'StandingRow' টেবিলে টিমগুলোর ডাটা সিঙ্ক করার জন্য প্রস্তুত করা
// // // //       const rowOperations = sortedTeams
// // // //         .filter(team => team.teamId !== null) // টিম আইডি না থাকলে স্কিপ করবে
// // // //         .map((team, idx) => {
// // // //           const position = idx + 1;

// // // //           return prisma.standingRow.upsert({
// // // //             where: {
// // // //               standingId_teamId: {
// // // //                 standingId: standingParent.id,
// // // //                 teamId: team.teamId!,
// // // //               },
// // // //             },
// // // //             update: {
// // // //               position: position,
// // // //               played: team.mp,
// // // //               win: team.w,
// // // //               draw: team.d,
// // // //               loss: team.l,
// // // //               goalsFor: team.gf,
// // // //               goalsAgainst: team.ga,
// // // //               goalDiff: team.gd,
// // // //               points: team.pts,
// // // //             },
// // // //             create: {
// // // //               standingId: standingParent.id,
// // // //               teamId: team.teamId!,
// // // //               position: position,
// // // //               played: team.mp,
// // // //               win: team.w,
// // // //               draw: team.d,
// // // //               loss: team.l,
// // // //               goalsFor: team.gf,
// // // //               goalsAgainst: team.ga,
// // // //               goalDiff: team.gd,
// // // //               points: team.pts,
// // // //             },
// // // //           });
// // // //         });

// // // //       // ট্রানজেকশনের মাধ্যমে এই গ্রুপের সব রোর ডাটা একবারে সেভ হবে
// // // //       if (rowOperations.length > 0) {
// // // //         await prisma.$transaction(rowOperations);
// // // //       }

// // // //       // ক্লায়েন্ট বা ফ্রন্টএন্ড রেসপন্স ফরম্যাট রেডি
// // // //       finalResponse[group] = sortedTeams.map((team, idx) => ({
// // // //         position: idx + 1,
// // // //         ...team,
// // // //       }));
// // // //     }

// // // //     console.log("✅ Successfully calculated, sorted, and synced Standings into DB!");
// // // //     return NextResponse.json(finalResponse);

// // // //   } catch (error: any) {
// // // //     console.error("Prisma Relational Standing Error:", error);
// // // //     return NextResponse.json(
// // // //       { error: error.message || "Internal Server Error" }, 
// // // //       { status: 500 }
// // // //     );
// // // //   }
// // // // }



// // // import { NextResponse } from "next/server";

// // // const countryMapper: Record<string, string> = {
// // //   "USA": "United States",
// // //   "IR Iran": "Iran",
// // //   "Korea Republic": "South Korea",
// // //   "Czechia": "Czech Republic",
// // //   "Cote d'Ivoire": "Ivory Coast"
// // // };

// // // const BASE_URL = "https://worldcup26.ir";

// // // // টোকেন জেনারেট ফাংশন
// // // async function getValidToken(): Promise<string> {
// // //   const email = process.env.WORLDCUP_API_EMAIL || "golpojolpo_dev@example.com";
// // //   const password = process.env.WORLDCUP_API_PASSWORD || "GolpoJolpo2026!";
// // //   const name = "Golpojolpo System Admin";

// // //   const loginRes = await fetch(`${BASE_URL}/auth/authenticate`, {
// // //     method: "POST",
// // //     headers: { "Content-Type": "application/json" },
// // //     body: JSON.stringify({ email, password }),
// // //   });

// // //   if (loginRes.ok) {
// // //     const loginData = await loginRes.json();
// // //     return loginData.token;
// // //   }

// // //   const registerRes = await fetch(`${BASE_URL}/auth/register`, {
// // //     method: "POST",
// // //     headers: { "Content-Type": "application/json" },
// // //     body: JSON.stringify({ name, email, password }),
// // //   });

// // //   if (registerRes.ok) {
// // //     const registerData = await registerRes.json();
// // //     return registerData.token;
// // //   }

// // //   throw new Error("Authentication failed on worldcup26.ir");
// // // }

// // // export async function GET() {
// // //   try {
// // //     const token = await getValidToken();
// // //     const headers = {
// // //       "Authorization": `Bearer ${token}`,
// // //       "Content-Type": "application/json",
// // //     };

// // //     // 🔄 ১. প্রথমে সব টিমের আইডি এবং নামের লিস্ট তুলে আনা (আইডি থেকে নাম বের করার জন্য)
// // //     const teamsResponse = await fetch(`${BASE_URL}/get/teams`, { method: "GET", headers });
// // //     let teamNameMap: Record<string, string> = {};
    
// // //     if (teamsResponse.ok) {
// // //       const teamsData = await teamsResponse.json();
// // //       const teamsArray = Array.isArray(teamsData) ? teamsData : (teamsData.teams || []);
// // //       teamsArray.forEach((t: any) => {
// // //         if (t.id && t.name_en) {
// // //           teamNameMap[String(t.id)] = t.name_en;
// // //         }
// // //       });
// // //     }

// // //     // 📊 ২. এবার মূল গ্রুপ স্ট্যান্ডিংস ডেটা তুলে আনা
// // //     const response = await fetch(`${BASE_URL}/get/groups`, {
// // //       method: "GET",
// // //       headers,
// // //       next: { revalidate: 300 },
// // //     });

// // //     if (!response.ok) {
// // //       throw new Error(`Failed to fetch groups. Status: ${response.status}`);
// // //     }

// // //     const jsonResult = await response.json();
// // //     const groupsArray = Array.isArray(jsonResult) 
// // //       ? jsonResult 
// // //       : (jsonResult.groups || jsonResult.data || Object.values(jsonResult).find(Array.isArray) || []);

// // //     if (groupsArray.length === 0) {
// // //       throw new Error("No valid group array found in API response.");
// // //     }

// // //     // 🔄 ৩. ডেটা ফরম্যাটিং ও আইডি-টু-নেম কনভার্সন
// // //     const formattedStandings = groupsArray.map((group: any) => {
// // //       const currentGroupName = group.group || group.name || "Unknown";
// // //       const teamsList = Array.isArray(group.teams) ? group.teams : [];

// // //       return {
// // //         groupName: currentGroupName.length === 1 ? `Group ${currentGroupName}` : currentGroupName,
// // //         teams: teamsList.map((row: any) => {
// // //           // আইডি দিয়ে নাম খোঁজা, না পেলে ব্যাকআপ আইডি শো করবে
// // //           const rawTeamName = teamNameMap[String(row.team_id)] || row.team || `Team ${row.team_id}`;
// // //           const dbCompatibleName = countryMapper[rawTeamName] || rawTeamName;

// // //           return {
// // //             teamName: dbCompatibleName,
// // //             played: Number(row.played || 0),
// // //             won: Number(row.won || 0),
// // //             drawn: Number(row.drawn || 0),
// // //             lost: Number(row.lost || 0),
// // //             goalsFor: Number(row.gf || 0),
// // //             goalsAgainst: Number(row.ga || 0),
// // //             goalDifference: Number(row.gd || (Number(row.gf || 0) - Number(row.ga || 0))),
// // //             points: Number(row.pts || 0),
// // //           };
// // //         }),
// // //       };
// // //     });

// // //     return NextResponse.json({ success: true, data: formattedStandings });

// // //   } catch (error: any) {
// // //     return NextResponse.json(
// // //       { success: false, error: error.message },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // import { NextResponse } from "next/server";

// // const BASE_URL = "https://worldcup26.ir";

// // async function getValidToken(): Promise<string> {
// //   const email = process.env.WORLDCUP_API_EMAIL || "golpojolpo_dev@example.com";
// //   const password = process.env.WORLDCUP_API_PASSWORD || "GolpoJolpo2026!";
// //   const name = "Golpojolpo System Admin";

// //   const loginRes = await fetch(`${BASE_URL}/auth/authenticate`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ email, password }),
// //   });

// //   if (loginRes.ok) {
// //     const loginData = await loginRes.json();
// //     return loginData.token;
// //   }

// //   const registerRes = await fetch(`${BASE_URL}/auth/register`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ name, email, password }),
// //   });

// //   if (registerRes.ok) {
// //     const registerData = await registerRes.json();
// //     return registerData.token;
// //   }

// //   throw new Error("Authentication failed on worldcup26.ir");
// // }

// // export async function GET() {
// //   try {
// //     const token = await getValidToken();
// //     const headers = {
// //       "Authorization": `Bearer ${token}`,
// //       "Content-Type": "application/json",
// //     };

// //     // 📊 সরাসরি গ্রুপ স্ট্যান্ডিংস ডেটা ফেচ করা হচ্ছে
// //     const response = await fetch(`${BASE_URL}/get/groups`, {
// //       method: "GET",
// //       headers,
// //     });

// //     if (!response.ok) {
// //       throw new Error(`Failed to fetch groups. Status: ${response.status}`);
// //     }

// //     // এপিআই থেকে যে রিলিজড JSON এসেছে তা সরাসরি ভেরিয়েবলে নেওয়া হলো
// //     const rawJsonResult = await response.json();

// //     // কোনো ফিল্টারিং বা ম্যাপ ছাড়া সরাসরি ওদের অরিজিনাল JSON-টি রিটার্ন করা হলো
// //     return NextResponse.json({ 
// //       note: "This is the raw response directly from worldcup26.ir/get/groups",
// //       rawResponse: rawJsonResult 
// //     });

// //   } catch (error: any) {
// //     return NextResponse.json(
// //       { success: false, error: error.message },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { NextResponse } from "next/server";

// // 🛠️ আপনার Supabase/Prisma ডাটাবেজের সাথে নামের মিসম্যাচ দূর করার ম্যাপার
// const countryMapper: Record<string, string> = {
//   "USA": "United States",
//   "IR Iran": "Iran",
//   "Korea Republic": "South Korea",
//   "Czechia": "Czech Republic",
//   "Cote d'Ivoire": "Ivory Coast"
// };

// const BASE_URL = "https://worldcup26.ir";

// async function getValidToken(): Promise<string> {
//   const email = process.env.WORLDCUP_API_EMAIL || "golpojolpo_dev@example.com";
//   const password = process.env.WORLDCUP_API_PASSWORD || "GolpoJolpo2026!";
//   const name = "Golpojolpo System Admin";

//   const loginRes = await fetch(`${BASE_URL}/auth/authenticate`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
  

//   if (loginRes.ok) {
//     console.log("✅ Successfully authenticated with worldcup26.ir");
//     const loginData = await loginRes.json();
//     return loginData.token;
//   }

//   const registerRes = await fetch(`${BASE_URL}/auth/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name, email, password }),
//   });

//   if (registerRes.ok) {
//     const registerData = await registerRes.json();
//     return registerData.token;
//   }

//   throw new Error("Authentication failed on worldcup26.ir");
// }

// export async function GET() {
//   try {
//     const token = await getValidToken();
//     const headers = {
//       "Authorization": `Bearer ${token}`,
//       "Content-Type": "application/json",
//     };

//     // 🔄 ১. প্রথমে /get/teams থেকে সব টিমের আইডি ও নামের লিস্ট নিয়ে একটি Map তৈরি করা
//     const teamsResponse = await fetch(`${BASE_URL}/get/teams`, { method: "GET", headers });
//     let teamNameMap: Record<string, string> = {};
    
//     if (teamsResponse.ok) {
//       const teamsData = await teamsResponse.json();
//       // রেসপন্স অ্যারে বা অবজেক্ট যাই হোক সেফলি হ্যান্ডেল করা
//       const teamsArray = Array.isArray(teamsData) ? teamsData : (teamsData.teams || teamsData.data || []);
      
//       teamsArray.forEach((t: any) => {
//         if (t.id && t.name_en) {
//           teamNameMap[String(t.id)] = t.name_en; // যেমন: {"29": "Argentina"}
//         }
//       });
//     }

//     // 📊 ২. এবার মূল গ্রুপ স্ট্যান্ডিংস ডেটা তুলে আনা
//     const response = await fetch(`${BASE_URL}/get/games`, {
//       method: "GET",
//       headers,
//       next: { revalidate: 300 }, // ৫ মিনিট ক্যাশ থাকবে
//     });
    

//     if (!response.ok) {
//       throw new Error(`Failed to fetch groups. Status: ${response.status}`);
//     }

//     const jsonResult = await response.json();
    
//     // আপনার প্রোভাইড করা রেসপন্স স্ট্রাকচার অনুযায়ী jsonResult.groups থেকে অ্যারে নেওয়া
//     const groupsArray = jsonResult.groups || (Array.isArray(jsonResult) ? jsonResult : []);

//     if (groupsArray.length === 0) {
//       throw new Error("No valid group array found in API response.");
//     }

//     // 🔄 ৩. আইডি থেকে নাম কনভার্সন এবং ক্লিন ডাটা ফরম্যাটিং
//     const formattedStandings = groupsArray.map((group: any) => {
//       const currentGroupName = group.name || "Unknown";
//       const teamsList = Array.isArray(group.teams) ? group.teams : [];

//       return {
//         groupName: currentGroupName.length === 1 ? `Group ${currentGroupName}` : currentGroupName,
//         teams: teamsList.map((row: any) => {
//           // আইডি ম্যাচ করে ম্যাপ থেকে রিয়েল নাম তুলে আনা
//           const rawTeamName = teamNameMap[String(row.team_id)] || `Team ID ${row.team_id}`;
//           const dbCompatibleName = countryMapper[rawTeamName] || rawTeamName;

//           return {
//             teamName: dbCompatibleName,
//             played: Number(row.mp || 0),
//             won: Number(row.w || 0),
//             drawn: Number(row.d || 0),
//             lost: Number(row.l || 0),
//             goalsFor: Number(row.gf || 0),
//             goalsAgainst: Number(row.ga || 0),
//             goalDifference: Number(row.gd || 0),
//             points: Number(row.pts || 0),
//           };
//         }),
//       };
//     });

//     return NextResponse.json({ success: true, data: formattedStandings });

//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

const BASE_URL = "https://worldcup26.ir";
let cachedToken: string | null = null;

// অথেন্টিকেশন টোকেন জোগাড় করার ফাংশন
async function getToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  const email = process.env.WORLDCUP_API_EMAIL || "golpojolpo_dev@example.com";
  const password = process.env.WORLDCUP_API_PASSWORD || "GolpoJolpo2026!";

  const res = await fetch(`${BASE_URL}/auth/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    const data = await res.json();
    cachedToken = data.token;
    return cachedToken!;
  }
  
  throw new Error("Token generation failed");
}

// মূল এন্ডপয়েন্ট (GET Request)
export async function GET() {
  try {
    const token = await getToken();

    // সরাসরি /get/games এপিআই কল
    const response = await fetch(`${BASE_URL}/get/games`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // ১ মিনিট ক্যাশ থাকবে
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch games from source" }, { status: response.status });
    }

    const rawData = await response.json();

    // এপিআই থেকে আসা আসল 'games' অ্যারে সরাসরি রিটার্ন করে দেওয়া হলো
    return NextResponse.json(rawData.games || rawData);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}