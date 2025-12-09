-- Add password reset fields to User table
-- Run this in your Supabase SQL Editor

-- Add resetToken field
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'resetToken'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "resetToken" TEXT;
    END IF;
END $$;

-- Add resetTokenExpiry field
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'resetTokenExpiry'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);
    END IF;
END $$;

-- Create index on resetToken for faster lookups
CREATE INDEX IF NOT EXISTS "User_resetToken_idx" ON "User"("resetToken");

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'User' 
AND column_name IN ('resetToken', 'resetTokenExpiry')
ORDER BY column_name;
