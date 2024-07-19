-- CreateTable
CREATE TABLE "CachedScore" (
    "id" SERIAL NOT NULL,
    "internshipId" INTEGER NOT NULL,
    "word" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "CachedScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CachedScore_internshipId_key" ON "CachedScore"("internshipId");

-- AddForeignKey
ALTER TABLE "CachedScore" ADD CONSTRAINT "CachedScore_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
