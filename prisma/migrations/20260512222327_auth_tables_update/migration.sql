/*
  Warnings:

  - You are about to drop the column `articleId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `articleId` on the `Session` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_articleId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "articleId";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "articleId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerified" TIMESTAMP(3);
