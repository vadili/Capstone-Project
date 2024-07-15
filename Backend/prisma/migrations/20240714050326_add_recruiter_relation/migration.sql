-- AlterTable
ALTER TABLE "Internship" ADD COLUMN     "recruiterId" INTEGER;

-- AddForeignKey
ALTER TABLE "Internship" ADD CONSTRAINT "Internship_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
