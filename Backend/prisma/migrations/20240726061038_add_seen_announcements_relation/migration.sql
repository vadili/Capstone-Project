-- CreateTable
CREATE TABLE "_SeenAnnouncements" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SeenAnnouncements_AB_unique" ON "_SeenAnnouncements"("A", "B");

-- CreateIndex
CREATE INDEX "_SeenAnnouncements_B_index" ON "_SeenAnnouncements"("B");

-- AddForeignKey
ALTER TABLE "_SeenAnnouncements" ADD CONSTRAINT "_SeenAnnouncements_A_fkey" FOREIGN KEY ("A") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeenAnnouncements" ADD CONSTRAINT "_SeenAnnouncements_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
