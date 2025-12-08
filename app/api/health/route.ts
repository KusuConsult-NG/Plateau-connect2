import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Health check endpoint with database connectivity test
export async function GET() {
    try {
        // Test database connection with a simple query
        await prisma.$queryRaw`SELECT 1`

        return NextResponse.json({
            status: 'ok',
            database: 'connected',
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error('[Health Check] Database connection failed:', error)

        return NextResponse.json(
            {
                status: 'error',
                database: 'disconnected',
                error: error instanceof Error ? error.message : String(error),
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        )
    }
}
