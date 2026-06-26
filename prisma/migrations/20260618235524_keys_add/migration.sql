-- CreateTable
CREATE TABLE "ApiKeyTracker" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "keyName" TEXT NOT NULL,
    "apiValue" TEXT NOT NULL,
    "callsUsed" INTEGER NOT NULL DEFAULT 0,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKeyTracker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKeyTracker_keyName_key" ON "ApiKeyTracker"("keyName");
