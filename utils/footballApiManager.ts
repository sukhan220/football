


import { prisma } from "@/lib/prisma";

export class FootballApiManager {
  /**
   * লাইভ স্কোর এবং ওডস ফেচ করার জন্য রোটেশনাল এপিআই কি রিটার্ন করে।
   * ডাটাবেজের একটি সিঙ্গেল রো-তেই কারেন্ট কী এবং কাউন্ট আপডেট ও রিসেট করে।
   */
  public static async getLiveApiKey(): Promise<string> {
    try {
      // ১. ডাটাবেজ থেকে বর্তমান ট্র্যাকার রেকর্ড খুঁজে বের করা।
      // যদি টেবিলে কোনো রেকর্ডই না থাকে, তবে প্রথমবার MATCH_1_KEY দিয়ে শুরু হবে।
      let tracker = await prisma.apiKeyTracker.findFirst({
        orderBy: { lastUsedAt: 'desc' } // সর্বশেষ ব্যবহৃত রো-টি নিবে
      });

      console.log(tracker)

      // টেবিলে কোনো ডাটা না থাকলে প্রথম রেকর্ড তৈরি করে নেওয়া
      if (!tracker) {
        tracker = await prisma.apiKeyTracker.create({
          data: {
            keyName: "MATCH_1_KEY",
            apiValue: "active_rotation",
            callsUsed: 0,
            lastSyncedFixtureIds: [],
          },
        });
      }

      let currentCount = tracker.callsUsed;
      let currentKeyName = tracker.keyName;

      // ২. 💡 ম্যাজিক লজিক: কাউন্টার যদি অলরেডি ৯৮ বা তার বেশি হয়ে যায়, তবে কাউন্ট ০ হবে এবং কী চেঞ্জ হবে
      if (currentCount >= 98) {
        // বর্তমান কী-এর নাম্বার বের করা (যেমন: "MATCH_1_KEY" থেকে ১ বের করবে)
        const currentKeyNum = parseInt(currentKeyName.split("_")[1] || "1", 10);
        
        // পরবর্তী কী-এর নাম সেট করা (১ থেকে ৬ এর মধ্যে ঘুরবে)
        const nextKeyNum = (currentKeyNum % 6) + 1;
        const nextKeyName = `MATCH_${nextKeyNum}_KEY`;

        // আগের রো-টির আইডি ব্যবহার করেই নতুন কী নেম এবং কাউন্টার ০ সেট করে আপডেট করা
        tracker = await prisma.apiKeyTracker.update({
          where: { id: tracker.id },
          data: {
            keyName: nextKeyName,
            callsUsed: 0, // ৯৮ হওয়াতে আবার ০ থেকে কাউন্ট শুরু
            lastUsedAt: new Date(),
          },
        });

        currentCount = 0;
        currentKeyName = nextKeyName;
        console.log(`[API-Key Rotated] Limit 98 reached. Resetting count to 0 and switching to: ${nextKeyName}`);
      }

      // ৩. বর্তমান অ্যাক্টিভ কী-এর কল সংখ্যা ১ বাড়িয়ে ডাটাবেজে আপডেট করা
      const updatedCalls = currentCount + 1;
      await prisma.apiKeyTracker.update({
        where: { id: tracker.id },
        data: {
          callsUsed: updatedCalls,
          lastUsedAt: new Date(),
        },
      });

      console.log(`[API-Key Logger] Active Key: ${currentKeyName} | Calls Used: ${updatedCalls}/98`);
      
      return process.env[currentKeyName] || process.env.MATCH_1_KEY || "";

    } catch (error) {
      console.error("Failed to read/update API counter from DB, using fallback:", error);
      return process.env.MATCH_1_KEY || "";
    }
  }

  /**
   * সর্বশেষ লাইভ ম্যাচগুলোর আইডি কারেন্ট সচল রো-তে আপডেট করে দিবে
   */
  public static async updateLastSyncedFixtureIds(fixtureIds: number[]) {
    if (!fixtureIds || fixtureIds.length === 0) return;
    try {
      const fixtureIdStrings = fixtureIds.map(String);

      // কারেন্ট সচল রেকর্ডটি খুঁজে বের করা
      const tracker = await prisma.apiKeyTracker.findFirst({
        orderBy: { lastUsedAt: 'desc' }
      });

      if (tracker) {
        await prisma.apiKeyTracker.update({
          where: { id: tracker.id },
          data: {
            lastSyncedFixtureIds: fixtureIdStrings,
            lastUsedAt: new Date(),
          },
        });
        console.log(`[API-Key Logger] Saved IDs to active key row: ${tracker.keyName}`);
      }
    } catch (error) {
      console.error("Failed to save synced fixture IDs to DB:", error);
    }
  }

  /**
   * লাইনআপ এবং প্লেয়ার স্ট্যাটিসটিকস ফেচ করার জন্য ফিক্সড প্রিমিয়াম কি রিটার্ন করে
   */
  public static getLineupApiKey(): string {
    return process.env.MATCH_LINEUP_statistics || "";
  }

  /**
   * ম্যাচটি হাফ-টাইম (HT) অবস্থায় আছে কিনা চেক করে
   */
  public static isHalfTime(statusLong: string): boolean {
    if (!statusLong) return false;
    const htStatuses = ["Half-Time", "HT"];
    return htStatuses.includes(statusLong);
  }

  /**
   * ম্যাচটি শেষ (Finished/FT) হয়েছে কিনা চেক করে
   */
  public static isMatchFinished(statusLong: string): boolean {
    if (!statusLong) return false;
    const finishedStatuses = ["Match Finished", "FT", "AET", "PEN", "Match Finished After Extra Time", "Match Finished After Penalty"];
    return finishedStatuses.includes(statusLong);
  }
}