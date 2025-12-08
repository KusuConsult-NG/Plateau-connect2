import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
    let url = process.env.DATABASE_URL

    // Fix for Supabase transaction pooler in production if forgotten in env vars
    if (url && url.includes('pooler.supabase.com') && !url.includes('pgbouncer=true')) {
        console.log('[DB] Auto-appending pgbouncer=true to connection URL')
        url += url.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true'
    }

    // Log connection info (censored)
    if (url) {
        const censoredUrl = url.replace(/:([^:@]+)@/, ':***@')
        console.log('[DB] Connecting with URL:', censoredUrl)
    } else {
        console.error('[DB] WARNING: DATABASE_URL is not set!')
    }

    try {
        return new PrismaClient({
            datasources: {
                db: {
                    url,
                },
            },
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        })
    } catch (error) {
        console.error('[DB] Failed to create PrismaClient:', error)
        throw error
    }
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
