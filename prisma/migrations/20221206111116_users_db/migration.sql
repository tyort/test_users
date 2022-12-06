-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "profession" TEXT NOT NULL,
    "friendsCount" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL,
    "isChecked" BOOLEAN NOT NULL,
    "order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ShowUnchecked" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isShow" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Search" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL
);
