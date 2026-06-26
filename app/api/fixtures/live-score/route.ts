import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncLiveScores } from "./footballSyncEngine";
import { syncLineupsAndStatistics } from "./lineupSyncEngine";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cronSecret = searchParams.get("secret");

  // সিকিউরিটি চেক (প্রয়োজন হলে অন করে নিতে পারেন, আপাতত কমেন্ট করে রাখতে পারেন)
  // if (cronSecret !== process.env.CRON_SECRET) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const taskType = searchParams.get("task") || "score"; // 'score' অথবা 'stats'

  try {
    // ⚽ টাস্ক ১: প্রতি ২ মিনিটে শুধু লাইভ স্কোর এপিআই থেকে র ডেটা এনে স্ক্রিনে দেখাবে
    if (taskType === "score") {
      const liveMatches = await syncLiveScores(); 
      
      return NextResponse.json({
        success: true,
        message: "Live scores fetched successfully from API.",
        activeMatchesCount: liveMatches.length, // কয়টি লাইভ ম্যাচ সাকসেসফুলি আসলো
        data: liveMatches // 💡 এপিআই থেকে আসা সম্পূর্ণ র ডেটা অবজেক্ট
      });
    }

    // 📋 টাস্ক ২: প্রতি ১০ মিনিটে লাইনআপ ও স্ট্যাটস আপডেট (ডেডিকেটেড কী-এর মাধ্যমে)
    if (taskType === "stats") {
      // ডেটাবেজে বর্তমানে LIVE থাকা ম্যাচগুলোর আইডি নেওয়া হচ্ছে
      const liveMatchesInDb = await prisma.match.findMany({
        where: { status: "LIVE" },
        select: { apiId: true }
      });

      const fixtureIds = liveMatchesInDb
        .map((m) => m.apiId)
        .filter((id): id is number => id !== null);

      if (fixtureIds.length > 0) {
        await syncLineupsAndStatistics(fixtureIds);
      }

      return NextResponse.json({
        success: true,
        message: "Lineups and Statistics sync completed.",
        syncedMatchesCount: fixtureIds.length
      });
    }

    return NextResponse.json({ error: "Invalid task type" }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}