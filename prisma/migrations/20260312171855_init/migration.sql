-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('earning', 'payout');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'success', 'failed', 'aborted');

-- CreateEnum
CREATE TYPE "TransactionDirection" AS ENUM ('inflow', 'outflow');

-- CreateEnum
CREATE TYPE "AccountKind" AS ENUM ('platform_holding', 'funding', 'plaform_revenue', 'platform_expense', 'platform_suspense');

-- CreateEnum
CREATE TYPE "AccountOwner" AS ENUM ('user', 'platform');

-- CreateEnum
CREATE TYPE "LedgerEntryDirection" AS ENUM ('credit', 'debit');

-- CreateEnum
CREATE TYPE "PayoutRequestStatus" AS ENUM ('submitted', 'processed', 'delayed');

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "user_id" TEXT,
    "extension" TEXT,
    "url" TEXT,
    "type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phone_e164" TEXT NOT NULL,
    "dial_code" TEXT NOT NULL,
    "pwd_hash" TEXT NOT NULL,
    "share_percent" INTEGER NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "email_verified_at" TIMESTAMP(3),
    "phone_verified_at" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "display_picture" TEXT,
    "bio" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "otp_hash" TEXT,
    "session_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payout_methods" (
    "id" TEXT NOT NULL,
    "bank_code" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "bank_logo" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT true,
    "country" TEXT NOT NULL DEFAULT 'ng',
    "currency" TEXT NOT NULL DEFAULT 'ngn',
    "payout_code" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payout_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payout_requests" (
    "id" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "user_id" TEXT NOT NULL,
    "transaction_id" TEXT,
    "status" "PayoutRequestStatus" NOT NULL DEFAULT 'submitted',
    "processed_at" TIMESTAMP(3),
    "delayed_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payout_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "provider" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "reference" TEXT NOT NULL,
    "product" JSONB,
    "access_code" TEXT,
    "metadata" JSONB,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "memo" TEXT,
    "type" "TransactionType" NOT NULL,
    "direction" "TransactionDirection" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "belongs_to" "AccountOwner" NOT NULL,
    "kind" "AccountKind" NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_entries" (
    "id" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "account_id" TEXT NOT NULL,
    "direction" "LedgerEntryDirection" NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "password_resets_user_id_idx" ON "password_resets"("user_id");

-- CreateIndex
CREATE INDEX "password_resets_session_hash_idx" ON "password_resets"("session_hash");

-- CreateIndex
CREATE UNIQUE INDEX "payout_methods_payout_code_key" ON "payout_methods"("payout_code");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_reference_key" ON "transactions"("reference");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_methods" ADD CONSTRAINT "payout_methods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
