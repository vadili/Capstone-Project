/*
  Warnings:

  - A unique constraint covering the columns `[title,company]` on the table `Internship` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Internship_title_company_key" ON "Internship"("title", "company");
