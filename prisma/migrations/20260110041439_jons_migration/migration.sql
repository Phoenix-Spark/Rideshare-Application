/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Station` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[longitude]` on the table `Station` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[latitude]` on the table `Station` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inviteId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "emailVerificationAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "emailVerificationCode" TEXT,
ADD COLUMN     "emailVerificationCodeExpiration" TIMESTAMP(3),
ADD COLUMN     "emailVerificationCodeSendLimit" TIMESTAMP(3),
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "inviteCode" TEXT,
ADD COLUMN     "isInvite" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Station_name_key" ON "Station" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "Station_longitude_key" ON "Station" ("longitude");

-- CreateIndex
CREATE UNIQUE INDEX "Station_latitude_key" ON "Station" ("latitude");

-- CreateIndex
CREATE UNIQUE INDEX "User_inviteId_key" ON "User" ("inviteId");

-- AddForeignKey
ALTER TABLE "User"
    ADD CONSTRAINT "User_inviteId_fkey" FOREIGN KEY ("inviteId") REFERENCES "Invite" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
