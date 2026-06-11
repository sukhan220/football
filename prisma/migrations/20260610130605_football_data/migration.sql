/*
  Warnings:

  - A unique constraint covering the columns `[apiCode]` on the table `competitions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[apiEventId]` on the table `match_events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[apiId]` on the table `matches` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[apiId]` on the table `players` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[apiId]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "match_events" DROP CONSTRAINT "match_events_playerId_fkey";

-- DropForeignKey
ALTER TABLE "match_events" DROP CONSTRAINT "match_events_teamId_fkey";

-- DropForeignKey
ALTER TABLE "match_lineups" DROP CONSTRAINT "match_lineups_playerId_fkey";

-- DropForeignKey
ALTER TABLE "match_lineups" DROP CONSTRAINT "match_lineups_teamId_fkey";

-- DropForeignKey
ALTER TABLE "standing_rows" DROP CONSTRAINT "standing_rows_teamId_fkey";

-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "apiCode" TEXT;

-- AlterTable
ALTER TABLE "match_events" ADD COLUMN     "apiEventId" TEXT;

-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "apiId" INTEGER,
ADD COLUMN     "groupName" TEXT,
ADD COLUMN     "stage" TEXT;

-- AlterTable
ALTER TABLE "players" ADD COLUMN     "apiId" INTEGER;

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "apiId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "competitions_apiCode_key" ON "competitions"("apiCode");

-- CreateIndex
CREATE UNIQUE INDEX "match_events_apiEventId_key" ON "match_events"("apiEventId");

-- CreateIndex
CREATE UNIQUE INDEX "matches_apiId_key" ON "matches"("apiId");

-- CreateIndex
CREATE UNIQUE INDEX "players_apiId_key" ON "players"("apiId");

-- CreateIndex
CREATE UNIQUE INDEX "teams_apiId_key" ON "teams"("apiId");

-- AddForeignKey
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_lineups" ADD CONSTRAINT "match_lineups_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_lineups" ADD CONSTRAINT "match_lineups_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standing_rows" ADD CONSTRAINT "standing_rows_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
