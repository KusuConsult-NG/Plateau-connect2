-- Create ENUM types for the database

-- UserRole enum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'DRIVER', 'RIDER');

-- RideStatus enum
CREATE TYPE "RideStatus" AS ENUM ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- PaymentStatus enum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- PaymentMethodType enum
CREATE TYPE "PaymentMethodType" AS ENUM ('CARD', 'BANK_TRANSFER');

-- DriverStatus enum
CREATE TYPE "DriverStatus" AS ENUM ('PENDING_VERIFICATION', 'VERIFIED', 'ACTIVE', 'INACTIVE', 'SUSPENDED');
