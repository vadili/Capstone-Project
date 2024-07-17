/*
  Warnings:

  - You are about to drop the `UserLikedInternship` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSavedInternship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserLikedInternship" DROP CONSTRAINT "UserLikedInternship_internshipId_fkey";

-- DropForeignKey
ALTER TABLE "UserLikedInternship" DROP CONSTRAINT "UserLikedInternship_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSavedInternship" DROP CONSTRAINT "UserSavedInternship_internshipId_fkey";

-- DropForeignKey
ALTER TABLE "UserSavedInternship" DROP CONSTRAINT "UserSavedInternship_userId_fkey";

-- DropTable
DROP TABLE "UserLikedInternship";

-- DropTable
DROP TABLE "UserSavedInternship";

-- CreateTable
CREATE TABLE "_usersSavedRelation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_usersLikedRelation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_usersSavedRelation_AB_unique" ON "_usersSavedRelation"("A", "B");

-- CreateIndex
CREATE INDEX "_usersSavedRelation_B_index" ON "_usersSavedRelation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_usersLikedRelation_AB_unique" ON "_usersLikedRelation"("A", "B");

-- CreateIndex
CREATE INDEX "_usersLikedRelation_B_index" ON "_usersLikedRelation"("B");

-- AddForeignKey
ALTER TABLE "_usersSavedRelation" ADD CONSTRAINT "_usersSavedRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "Internship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_usersSavedRelation" ADD CONSTRAINT "_usersSavedRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_usersLikedRelation" ADD CONSTRAINT "_usersLikedRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "Internship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_usersLikedRelation" ADD CONSTRAINT "_usersLikedRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
