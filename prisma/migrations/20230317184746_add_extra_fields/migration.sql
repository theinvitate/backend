/*
  Warnings:

  - You are about to drop the column `middleName` on the `User` table. All the data in the column will be lost.
  - Added the required column `isEmailValidated` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resetPasswordToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validateEmailToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "middleName",
ADD COLUMN     "dateResetPasswordRequest" TIMESTAMP(3),
ADD COLUMN     "isEmailValidated" BOOLEAN NOT NULL,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT NOT NULL,
ADD COLUMN     "validateEmailToken" TEXT NOT NULL;
