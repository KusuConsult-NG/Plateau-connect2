import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
    let url = process.env.DATABASE_URL

    // Fix for Supabase transaction pooler in production if forgotten in env vars
    if (url && url.includes('pooler.supabase.com') && !url.includes('pgbouncer=true')) {
        url += url.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true'
    }

    return new PrismaClient({
        datasources: {
            db: {
                url,
            },
        },
    })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
