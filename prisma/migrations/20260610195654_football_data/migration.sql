/*
  Warnings:

  - Added the required column `year` to the `tournament_metas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tournament_metas" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "tournament_metas_year_displayOrder_idx" ON "tournament_metas"("year", "displayOrder");
