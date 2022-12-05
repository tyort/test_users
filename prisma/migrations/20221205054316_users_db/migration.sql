-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "profession" TEXT NOT NULL,
    "friendsCount" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL,
    "isChecked" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" TEXT NOT NULL
);
