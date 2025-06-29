/*
  Warnings:

  - Added the required column `userInitial` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post" ADD COLUMN     "badge" TEXT,
ADD COLUMN     "comments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "shares" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userInitial" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;
