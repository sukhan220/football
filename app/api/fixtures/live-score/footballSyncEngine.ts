import { FootballApiManager } from "@/utils/footballApiManager"; // আপনার ক্লাসের সঠিক পাথ দিন

/**
 * এপিআই থেকে সরাসরি লাইভ ম্যাচের র (Raw) ডেটা ফেচ করে রিটার্ন করে।
 * কোনো ডেটাবেজ অপারেশন (Prisma) এখানে নেই।
 */
export async function syncLiveScores() {
  console.log("Fetching Live Scores from API-Sports (No DB Operations)...");

  // ১. আপনার তৈরি করা ম্যানেজার ক্লাস থেকে নিখুঁত রোটেশনাল কী নেওয়া হলো
  const activeKey = await FootballApiManager.getLiveApiKey();

  try {
    // ২. লাইভ এপিআই-তে সরাসরি রিকোয়েস্ট পাঠানো হচ্ছে
    const response = await fetch("https://v3.football.api-sports.io/odds/live?league=1", {
      method: "GET",
      headers: {
        "x-rapidapi-key": activeKey,
        "x-rapidapi-host": "v3.football.api-sports.io",
      },
      next: { revalidate: 0 } // লাইভ ডেটার জন্য ক্যাশিং বন্ধ
    });

    const liveData = await response.json();

    // এপিআই রেসপন্স ভ্যালিডেশন
    if (!liveData || !liveData.response) {
      console.log("No live match data received or invalid API key.");
      return [];
    }

    // ৩. এপিআই থেকে প্রাপ্ত লাইভ ম্যাচের র (Raw) রেসপন্স অ্যারেটি সরাসরি রিটার্ন করে দেওয়া হচ্ছে
    console.log(`Successfully fetched ${liveData.response.length} live matches from API.`);
    return liveData.response; 

  } catch (error) {
    console.error("Error inside Live Score Fetcher:", error);
    return [];
  }
}