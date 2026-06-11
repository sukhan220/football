/*
  Warnings:

  - You are about to drop the column `content` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `excerpt` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `readingTime` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `seoDescription` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `seoKeywords` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `seoTitle` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `translationGroup` on the `articles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "articles_language_idx";

-- DropIndex
DROP INDEX "articles_slug_idx";

-- DropIndex
DROP INDEX "articles_slug_key";

-- DropIndex
DROP INDEX "articles_translationGroup_idx";

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "content",
DROP COLUMN "excerpt",
DROP COLUMN "language",
DROP COLUMN "readingTime",
DROP COLUMN "seoDescription",
DROP COLUMN "seoKeywords",
DROP COLUMN "seoTitle",
DROP COLUMN "slug",
DROP COLUMN "title",
DROP COLUMN "translationGroup";

-- CreateTable
CREATE TABLE "article_translations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "articleId" UUID NOT NULL,
    "language" "Language" NOT NULL,
    "title" TEXT NOT NULL,
    "shortTitle" TEXT,
    "slug" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "excerpt" TEXT,
    "readingTime" INTEGER,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "article_translations_slug_idx" ON "article_translations"("slug");

-- CreateIndex
CREATE INDEX "article_translations_language_idx" ON "article_translations"("language");

-- CreateIndex
CREATE UNIQUE INDEX "article_translations_articleId_language_key" ON "article_translations"("articleId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "article_translations_language_slug_key" ON "article_translations"("language", "slug");

-- AddForeignKey
ALTER TABLE "article_translations" ADD CONSTRAINT "article_translations_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
