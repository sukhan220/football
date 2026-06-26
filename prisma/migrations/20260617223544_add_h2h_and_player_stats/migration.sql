-- AlterTable
ALTER TABLE "match_lineups" ADD COLUMN     "assists" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "goals" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "passesAccuracy" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "passesTotal" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rating" TEXT,
ADD COLUMN     "saves" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shotsOnGoal" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shotsTotal" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tackles" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "head_to_heads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "teamOneId" UUID NOT NULL,
    "teamTwoId" UUID NOT NULL,
    "played" INTEGER NOT NULL DEFAULT 0,
    "teamOneWins" INTEGER NOT NULL DEFAULT 0,
    "teamTwoWins" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "head_to_heads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "head_to_heads_teamOneId_teamTwoId_key" ON "head_to_heads"("teamOneId", "teamTwoId");
