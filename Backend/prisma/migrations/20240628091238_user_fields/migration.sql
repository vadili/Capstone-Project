/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "role",
ADD COLUMN     "company" TEXT,
ADD COLUMN     "companyCulture" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "gpa" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "previousInternships" BOOLEAN,
ADD COLUMN     "raceEthnicity" TEXT,
ADD COLUMN     "school" TEXT,
ADD COLUMN     "technicalSkills" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "userType" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");
