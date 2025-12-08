-- SQL Script to fix missing columns in Production Database
-- Run this in your Supabase SQL Editor

-- 1. ensuring Ride table has all necessary columns
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "rideType" TEXT DEFAULT 'FOUR_SEATER';
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "pickupLocation" TEXT;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "pickupLatitude" DOUBLE PRECISION;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "pickupLongitude" DOUBLE PRECISION;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "destination" TEXT;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "destinationLatitude" DOUBLE PRECISION;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "destinationLongitude" DOUBLE PRECISION;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "distance" DOUBLE PRECISION;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "estimatedFare" DOUBLE PRECISION;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "actualFare" DOUBLE PRECISION;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "estimatedDuration" INTEGER;

-- Timestamps
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "acceptedAt" TIMESTAMP(3);
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "startedAt" TIMESTAMP(3);
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3);
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3);

-- 2. Payment Table improvements
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "rideId" TEXT;
ALTER TABLE "Payment" ALTER COLUMN "rideId" DROP NOT NULL; -- Ensure it is nullable
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "transactionRef" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "gatewayResponse" JSONB;

-- Ensure Uniqueness
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Payment_transactionRef_key') THEN
        ALTER TABLE "Payment" ADD CONSTRAINT "Payment_transactionRef_key" UNIQUE ("transactionRef");
    END IF;
END $$;
