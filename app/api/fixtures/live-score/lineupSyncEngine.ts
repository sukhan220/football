import { prisma } from "@/lib/prisma";

export async function syncLineupsAndStatistics(fixtureIds: number[]) {
  if (fixtureIds.length === 0) {
    console.log("No active fixtures found for Lineup/Stats sync.");
    return;
  }

  // ডায়াগ্রামের রিকোয়ারমেন্ট অনুযায়ী ডেডিকেটেড কী
  const activeKey = process.env.MATCH_LINEUP_statistics || "";

  for (const id of fixtureIds) {
    try {
      console.log(`Fetching Lineup & Stats for Fixture ID: ${id} using Dedicated Key`);

      // ১. লাইনআপ ফেচিং
      const lineupRes = await fetch(`https://v3.football.api-sports.io/fixtures/lineups?fixture=${id}`, {
        headers: { "x-rapidapi-key": activeKey, "x-rapidapi-host": "v3.football.api-sports.io" }
      });
      const lineupData = await lineupRes.json();

      // ২. স্ট্যাটিস্টিকস ফেচিং
      const statsRes = await fetch(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${id}`, {
        headers: { "x-rapidapi-key": activeKey, "x-rapidapi-host": "v3.football.api-sports.io" }
      });
      const statsData = await statsRes.json();

      // ৩. প্রিজমা ট্রানজেকশন দিয়ে ডেটাবেজে সেভ
      await prisma.$transaction(async (tx) => {
        if (lineupData && lineupData.response) {
          for (const teamLineup of lineupData.response) {
            const teamApiId = teamLineup.team.id;
            const allPlayers = [...teamLineup.startXI, ...teamLineup.substitutes];
            
            for (const p of allPlayers) {
              const playerRecord = await tx.player.upsert({
                where: { apiId: p.player.id },
                update: { name: p.player.name, position: p.player.pos },
                create: { apiId: p.player.id, name: p.player.name, slug: `player-${p.player.id}`, position: p.player.pos }
              });

              const matchRecord = await tx.match.findUnique({ where: { apiId: id } });
              const teamRecord = await tx.team.findUnique({ where: { apiId: teamApiId } });

              if (matchRecord && teamRecord) {
                await tx.matchLineup.upsert({
                  where: { matchId_playerId: { matchId: matchRecord.id, playerId: playerRecord.id } },
                  update: { jerseyNo: p.player.number, position: p.player.pos },
                  create: {
                    matchId: matchRecord.id,
                    teamId: teamRecord.id,
                    playerId: playerRecord.id,
                    jerseyNo: p.player.number,
                    position: p.player.pos,
                  }
                });
              }
            }
          }
        }
      });

      console.log(`Successfully saved lineup/stats for fixture ${id}`);

    } catch (error) {
      console.error(`Failed to sync lineup/stats for fixture ${id}:`, error);
    }
  }
}