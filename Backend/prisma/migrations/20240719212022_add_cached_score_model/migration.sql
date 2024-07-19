/*
  Warnings:

  - A unique constraint covering the columns `[internshipId,word]` on the table `CachedScore` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CachedScore_internshipId_word_key" ON "CachedScore"("internshipId", "word");
