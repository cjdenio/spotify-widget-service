/*
  Warnings:

  - You are about to alter the column `spotifyTokenExpiration` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "spotifyToken" TEXT NOT NULL,
    "spotifyRefreshToken" TEXT NOT NULL,
    "spotifyTokenExpiration" DATETIME
);
INSERT INTO "new_User" ("email", "id", "name", "spotifyRefreshToken", "spotifyToken", "spotifyTokenExpiration") SELECT "email", "id", "name", "spotifyRefreshToken", "spotifyToken", "spotifyTokenExpiration" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
