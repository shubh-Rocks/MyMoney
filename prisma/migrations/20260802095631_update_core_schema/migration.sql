/*
  Warnings:

  - The values [Partially_PAID] on the enum `LoanStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `borrowers` table. All the data in the column will be lost.
  - The `interestType` column on the `loans` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,email]` on the table `borrowers` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `entityType` on the `audit_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `action` on the `audit_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `city` to the `borrowers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `borrowers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `borrowers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `borrowers` table without a default value. This is not possible if the table is not empty.
  - Made the column `passwordHash` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "InterestType" AS ENUM ('SIMPLE', 'COMPOUND');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI', 'NEFT', 'CHEQUE', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATED', 'UPDATED', 'DELETED', 'RESTORED');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('LOAN', 'LOAN_PAYMENT', 'BORROWER', 'USER', 'USER_PROFILE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- AlterEnum
BEGIN;
CREATE TYPE "LoanStatus_new" AS ENUM ('ACTIVE', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED');
ALTER TABLE "public"."loans" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "loans" ALTER COLUMN "status" TYPE "LoanStatus_new" USING ("status"::text::"LoanStatus_new");
ALTER TYPE "LoanStatus" RENAME TO "LoanStatus_old";
ALTER TYPE "LoanStatus_new" RENAME TO "LoanStatus";
DROP TYPE "public"."LoanStatus_old";
ALTER TABLE "loans" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- DropForeignKey
ALTER TABLE "borrowers" DROP CONSTRAINT "borrowers_userId_fkey";

-- DropForeignKey
ALTER TABLE "loans" DROP CONSTRAINT "loans_userId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_loanId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_userId_fkey";

-- DropIndex
DROP INDEX "borrowers_email_key";

-- DropIndex
DROP INDEX "borrowers_phone_key";

-- DropIndex
DROP INDEX "users_phone_key";

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "entityType",
ADD COLUMN     "entityType" "EntityType" NOT NULL,
DROP COLUMN "action",
ADD COLUMN     "action" "AuditAction" NOT NULL;

-- AlterTable
ALTER TABLE "borrowers" DROP COLUMN "address",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pincode" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "loans" DROP COLUMN "interestType",
ADD COLUMN     "interestType" "InterestType" NOT NULL DEFAULT 'SIMPLE',
ALTER COLUMN "isDeleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerified",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "phone",
ALTER COLUMN "passwordHash" SET NOT NULL;

-- DropTable
DROP TABLE "payments";

-- CreateTable
CREATE TABLE "user_profiles" (
    "userId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "gender" "Gender",
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "loan_payments" (
    "id" SERIAL NOT NULL,
    "loanId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
    "referenceNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_phone_key" ON "user_profiles"("phone");

-- CreateIndex
CREATE INDEX "loan_payments_loanId_paymentDate_idx" ON "loan_payments"("loanId", "paymentDate");

-- CreateIndex
CREATE INDEX "loan_payments_userId_paymentDate_idx" ON "loan_payments"("userId", "paymentDate");

-- CreateIndex
CREATE INDEX "audit_logs_userId_createdAt_idx" ON "audit_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_createdAt_idx" ON "audit_logs"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "borrowers_userId_isDeleted_idx" ON "borrowers"("userId", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "borrowers_userId_email_key" ON "borrowers"("userId", "email");

-- CreateIndex
CREATE INDEX "loans_userId_status_idx" ON "loans"("userId", "status");

-- CreateIndex
CREATE INDEX "loans_userId_isDeleted_idx" ON "loans"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "loans_borrowerId_idx" ON "loans"("borrowerId");

-- CreateIndex
CREATE INDEX "loans_dueDate_idx" ON "loans"("dueDate");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrowers" ADD CONSTRAINT "borrowers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_payments" ADD CONSTRAINT "loan_payments_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_payments" ADD CONSTRAINT "loan_payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
