-- CreateEnum
CREATE TYPE "MetaCategory" AS ENUM ('MASCOT', 'BALL', 'TECHNOLOGY', 'RULES', 'CHAMPION', 'RUNNER_UP', 'FACTS');

-- CreateTable
CREATE TABLE "tournament_metas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "seasonId" UUID NOT NULL,
    "category" "MetaCategory" NOT NULL,
    "image" TEXT,
    "bgGradient" TEXT,
    "iconName" TEXT,
    "videoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournament_metas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meta_translations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "metaId" UUID NOT NULL,
    "language" "Language" NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "slug" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "excerpt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meta_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tournament_metas_seasonId_idx" ON "tournament_metas"("seasonId");

-- CreateIndex
CREATE INDEX "tournament_metas_category_idx" ON "tournament_metas"("category");

-- CreateIndex
CREATE INDEX "meta_translations_slug_idx" ON "meta_translations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "meta_translations_metaId_language_key" ON "meta_translations"("metaId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "meta_translations_language_slug_key" ON "meta_translations"("language", "slug");

-- AddForeignKey
ALTER TABLE "tournament_metas" ADD CONSTRAINT "tournament_metas_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meta_translations" ADD CONSTRAINT "meta_translations_metaId_fkey" FOREIGN KEY ("metaId") REFERENCES "tournament_metas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
