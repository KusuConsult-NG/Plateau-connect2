-- COMPLETE Safe Migration for DriverProfile Table
-- Adds ALL columns required by the schema
-- Run this in Supabase SQL Editor

-- Personal Details
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='firstName') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "firstName" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='lastName') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "lastName" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='email') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN email TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='phone') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN phone TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='address') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN address TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='profilePicture') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "profilePicture" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Vehicle Information
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='vehicleType') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "vehicleType" TEXT NOT NULL DEFAULT 'STANDARD';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='vehicleMake') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "vehicleMake" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='vehicleModel') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "vehicleModel" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='vehicleYear') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "vehicleYear" INTEGER NOT NULL DEFAULT 2020;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='vehicleColor') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "vehicleColor" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='licensePlate') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "licensePlate" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Driver's License
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='licenseNumber') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "licenseNumber" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='licenseExpiry') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "licenseExpiry" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='licenseFrontImage') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "licenseFrontImage" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='licenseBackImage') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "licenseBackImage" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Vehicle Documents
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='vehicleRegistration') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "vehicleRegistration" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='insurance') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN insurance TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- National ID (KYC)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='nationalIdType') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "nationalIdType" TEXT NOT NULL DEFAULT 'NIN';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='nationalIdNumber') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "nationalIdNumber" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='nationalIdDocument') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "nationalIdDocument" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Additional KYC
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='proofOfAddress') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "proofOfAddress" TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='bvn') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN bvn TEXT;
    END IF;
END $$;

-- Bank Details
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='bankName') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "bankName" TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='accountNumber') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "accountNumber" TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='accountName') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "accountName" TEXT;
    END IF;
END $$;

-- Status & Ratings
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='status') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='rating') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN rating DOUBLE PRECISION NOT NULL DEFAULT 0;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='totalTrips') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "totalTrips" INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='acceptanceRate') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "acceptanceRate" DOUBLE PRECISION NOT NULL DEFAULT 0;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='isOnline') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "isOnline" BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- Location tracking
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='currentLatitude') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "currentLatitude" DOUBLE PRECISION;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='currentLongitude') THEN
        ALTER TABLE "DriverProfile" ADD COLUMN "currentLongitude" DOUBLE PRECISION;
    END IF;
END $$;

-- Drop old licenseDocument column if exists
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='DriverProfile' AND column_name='licenseDocument') THEN
        ALTER TABLE "DriverProfile" DROP COLUMN "licenseDocument";
    END IF;
END $$;

-- Remove defaults (they were only for safe migration)
ALTER TABLE "DriverProfile" 
    ALTER COLUMN "firstName" DROP DEFAULT,
    ALTER COLUMN "lastName" DROP DEFAULT,
    ALTER COLUMN email DROP DEFAULT,
    ALTER COLUMN phone DROP DEFAULT,
    ALTER COLUMN address DROP DEFAULT,
    ALTER COLUMN "profilePicture" DROP DEFAULT,
    ALTER COLUMN "vehicleType" DROP DEFAULT,
    ALTER COLUMN "vehicleMake" DROP DEFAULT,
    ALTER COLUMN "vehicleModel" DROP DEFAULT,
    ALTER COLUMN "vehicleYear" DROP DEFAULT,
    ALTER COLUMN "vehicleColor" DROP DEFAULT,
    ALTER COLUMN "licensePlate" DROP DEFAULT,
    ALTER COLUMN "licenseNumber" DROP DEFAULT,
    ALTER COLUMN "licenseExpiry" DROP DEFAULT,
    ALTER COLUMN "licenseFrontImage" DROP DEFAULT,
    ALTER COLUMN "licenseBackImage" DROP DEFAULT,
    ALTER COLUMN "vehicleRegistration" DROP DEFAULT,
    ALTER COLUMN insurance DROP DEFAULT,
    ALTER COLUMN "nationalIdType" DROP DEFAULT,
    ALTER COLUMN "nationalIdNumber" DROP DEFAULT,
    ALTER COLUMN "nationalIdDocument" DROP DEFAULT;

-- Create indexes
CREATE INDEX IF NOT EXISTS "DriverProfile_userId_idx" ON "DriverProfile"("userId");
CREATE INDEX IF NOT EXISTS "DriverProfile_status_idx" ON "DriverProfile"(status);
CREATE INDEX IF NOT EXISTS "DriverProfile_isOnline_idx" ON "DriverProfile"("isOnline");
CREATE INDEX IF NOT EXISTS "DriverProfile_nationalIdNumber_idx" ON "DriverProfile"("nationalIdNumber");
CREATE INDEX IF NOT EXISTS "DriverProfile_bvn_idx" ON "DriverProfile"(bvn);

-- Verify all columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'DriverProfile'
ORDER BY ordinal_position;
