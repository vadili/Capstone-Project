/*
  Warnings:

  - You are about to drop the `ApplicationStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApplicationStatus" DROP CONSTRAINT "ApplicationStatus_internshipId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationStatus" DROP CONSTRAINT "ApplicationStatus_userId_fkey";

-- DropTable
DROP TABLE "ApplicationStatus";

-- CreateTable
CREATE TABLE "UserSavedInternship" (
    "userId" INTEGER NOT NULL,
    "internshipId" INTEGER NOT NULL,

    CONSTRAINT "UserSavedInternship_pkey" PRIMARY KEY ("userId","internshipId")
);

-- CreateTable
CREATE TABLE "UserLikedInternship" (
    "userId" INTEGER NOT NULL,
    "internshipId" INTEGER NOT NULL,

    CONSTRAINT "UserLikedInternship_pkey" PRIMARY KEY ("userId","internshipId")
);

-- AddForeignKey
ALTER TABLE "UserSavedInternship" ADD CONSTRAINT "UserSavedInternship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedInternship" ADD CONSTRAINT "UserSavedInternship_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikedInternship" ADD CONSTRAINT "UserLikedInternship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikedInternship" ADD CONSTRAINT "UserLikedInternship_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
