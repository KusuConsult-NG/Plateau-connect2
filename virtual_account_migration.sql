-- Add VirtualAccount table to Supabase database

-- 1. Create VirtualAccount table
CREATE TABLE IF NOT EXISTS "VirtualAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "paystackCustomerCode" TEXT NOT NULL,
    "paystackAccountId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VirtualAccount_pkey" PRIMARY KEY ("id")
);

-- 2. Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "VirtualAccount_userId_key" ON "VirtualAccount"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "VirtualAccount_accountNumber_key" ON "VirtualAccount"("accountNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "VirtualAccount_paystackCustomerCode_key" ON "VirtualAccount"("paystackCustomerCode");
CREATE UNIQUE INDEX IF NOT EXISTS "VirtualAccount_paystackAccountId_key" ON "VirtualAccount"("paystackAccountId");

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS "VirtualAccount_userId_idx" ON "VirtualAccount"("userId");
CREATE INDEX IF NOT EXISTS "VirtualAccount_accountNumber_idx" ON "VirtualAccount"("accountNumber");

-- 4. Add foreign key
ALTER TABLE "VirtualAccount" ADD CONSTRAINT "VirtualAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
