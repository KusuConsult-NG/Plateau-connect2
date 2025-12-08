-- Safe Migration: Add Missing Columns to DriverProfile Table
-- This script safely adds columns if they don't exist
-- Run this in Supabase SQL Editor

-- Add firstName if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='DriverProfile' AND column_name='firstName') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "firstName" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add lastName if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='DriverProfile' AND column_name='lastName') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "lastName" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add email if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='DriverProfile' AND column_name='email') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN email TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add phone if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='DriverProfile' AND column_name='phone') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN phone TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add address if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='DriverProfile' AND column_name='address') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN address TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add profilePicture if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='DriverProfile' AND column_name='profilePicture') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "profilePicture" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add licenseFrontImage if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='DriverProfile' AND column_name='licenseFrontImage') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "licenseFrontImage" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add licenseBackImage if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='DriverProfile' AND column_name='licenseBackImage') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "licenseBackImage" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add nationalIdType if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='DriverProfile' AND column_name='nationalIdType') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "nationalIdType" TEXT NOT NULL DEFAULT 'NIN';
    END IF;
END $$;

-- Add nationalIdNumber if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='DriverProfile' AND column_name='nationalIdNumber') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "nationalIdNumber" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add nationalIdDocument if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='DriverProfile' AND column_name='nationalIdDocument') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "nationalIdDocument" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add proofOfAddress if it doesn't exist (optional field)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='DriverProfile' AND column_name='proofOfAddress') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "proofOfAddress" TEXT;
    END IF;
END $$;

-- Add bvn if it doesn't exist (optional field)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='DriverProfile' AND column_name='bvn') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN bvn TEXT;
    END IF;
END $$;

-- Add isOnline if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='DriverProfile' AND column_name='isOnline') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "isOnline" BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- Drop licenseDocument column if it exists (old field)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='DriverProfile' AND column_name='licenseDocument') THEN
        ALTER TABLE "DriverProfile" DROP COLUMN "licenseDocument";
    END IF;
END $$;

-- Remove defaults (they were only for adding columns safely)
ALTER TABLE "DriverProfile" 
    ALTER COLUMN "firstName" DROP DEFAULT,
    ALTER COLUMN "lastName" DROP DEFAULT,
    ALTER COLUMN email DROP DEFAULT,
    ALTER COLUMN phone DROP DEFAULT,
    ALTER COLUMN address DROP DEFAULT,
    ALTER COLUMN "profilePicture" DROP DEFAULT,
    ALTER COLUMN "licenseFrontImage" DROP DEFAULT,
    ALTER COLUMN "licenseBackImage" DROP DEFAULT,
    ALTER COLUMN "nationalIdType" DROP DEFAULT,
    ALTER COLUMN "nationalIdNumber" DROP DEFAULT,
    ALTER COLUMN "nationalIdDocument" DROP DEFAULT;

-- Create indexes (safe - will skip if exists)
CREATE INDEX IF NOT EXISTS "DriverProfile_userId_idx" ON "DriverProfile"("userId");
CREATE INDEX IF NOT EXISTS "DriverProfile_status_idx" ON "DriverProfile"(status);
CREATE INDEX IF NOT EXISTS "DriverProfile_isOnline_idx" ON "DriverProfile"("isOnline");
CREATE INDEX IF NOT EXISTS "DriverProfile_nationalIdNumber_idx" ON "DriverProfile"("nationalIdNumber");
CREATE INDEX IF NOT EXISTS "DriverProfile_bvn_idx" ON "DriverProfile"(bvn);

-- Verify all columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'DriverProfile'
ORDER BY ordinal_position;
