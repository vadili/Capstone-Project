/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Recruiter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Recruiter_email_key" ON "Recruiter"("email");
