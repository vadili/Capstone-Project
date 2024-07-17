/*
  Warnings:

  - A unique constraint covering the columns `[recruiterId]` on the table `Internship` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "ApplicationStatus" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "internshipId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not applied',

    CONSTRAINT "ApplicationStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationStatus_userId_internshipId_key" ON "ApplicationStatus"("userId", "internshipId");

-- CreateIndex
CREATE UNIQUE INDEX "Internship_recruiterId_key" ON "Internship"("recruiterId");

-- AddForeignKey
ALTER TABLE "ApplicationStatus" ADD CONSTRAINT "ApplicationStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStatus" ADD CONSTRAINT "ApplicationStatus_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
