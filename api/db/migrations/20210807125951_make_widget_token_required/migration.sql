/*
  Warnings:

  - Made the column `widgetToken` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "widgetToken" TEXT NOT NULL,
    "spotifyToken" TEXT NOT NULL,
    "spotifyRefreshToken" TEXT NOT NULL,
    "spotifyTokenExpiration" DATETIME
);
INSERT INTO "new_User" ("email", "id", "name", "spotifyRefreshToken", "spotifyToken", "spotifyTokenExpiration", "widgetToken") SELECT "email", "id", "name", "spotifyRefreshToken", "spotifyToken", "spotifyTokenExpiration", "widgetToken" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
