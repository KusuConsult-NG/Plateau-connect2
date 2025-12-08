import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { calculateFare } from '@/lib/constants'
import { calculateDistance } from '@/lib/utils'

// GET - List rides
export async function GET(request: Request) {
    let session
    try {
        session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const type = searchParams.get('type') // 'available' or 'history'

        const where: any = {}

        // Filter by role
        if (session.user.role === 'RIDER') {
            where.riderId = session.user.id
        } else if (session.user.role === 'DRIVER') {
            if (type === 'available') {
                // Show pending rides with no driver
                where.status = 'PENDING'
                where.driverId = null
            } else if (type === 'active') {
                // Show current active ride
                where.driverId = session.user.id
                where.status = { in: ['ACCEPTED', 'IN_PROGRESS'] }
            } else {
                // Show driver's own rides
                where.driverId = session.user.id
            }
        }
    } else if (session.user.role === 'ADMIN') {
        // Admin can see all rides
        if (status && !type) {
            where.status = status
        }
    } else {
        // Fallback for undefined roles - Show nothing or error
        return NextResponse.json({ rides: [] })
    }


    const rides = await prisma.ride.findMany({
        where,
        include: {
            rider: {
                select: { id: true, name: true, email: true },
            },
            driver: {
                select: { id: true, name: true, email: true },
            },
            payment: {
                select: { id: true, status: true, amount: true },
            },
        },
        orderBy: [
            { departureTime: 'asc' }, // Prioritize scheduled time
            { createdAt: 'desc' }
        ],
        take: 50,
    })


    return NextResponse.json({ rides })
} catch (error) {
    // Enhanced error logging for production debugging
    console.error('=== RIDES API ERROR ===')
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Session user ID:', session?.user?.id)
    console.error('Session user role:', session?.user?.role)
    console.error('========================')

    // Return detailed error in development, generic in production
    const errorMessage = process.env.NODE_ENV === 'development'
        ? `Failed to fetch rides: ${error instanceof Error ? error.message : String(error)}`
        : 'Failed to fetch rides'

    return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
    )
}
}

// POST - Create a new ride request
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'RIDER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            pickupLocation,
            pickupLatitude,
            pickupLongitude,
            destination,
            destinationLatitude,
            destinationLongitude,
            rideType,
            departureTime, // Extract departureTime
            metadata,
        } = body

        // Validate required fields
        if (
            !pickupLocation ||
            !pickupLatitude ||
            !pickupLongitude ||
            !destination ||
            !destinationLatitude ||
            !destinationLongitude ||
            !rideType
        ) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Calculate distance
        const distance = calculateDistance(
            pickupLatitude,
            pickupLongitude,
            destinationLatitude,
            destinationLongitude
        )

        // Calculate fare
        const estimatedFare = calculateFare(rideType, distance)

        // Create ride
        const ride = await prisma.ride.create({
            data: {
                riderId: session.user.id,
                pickupLocation,
                pickupLatitude,
                pickupLongitude,
                destination,
                destinationLatitude,
                destinationLongitude,
                rideType,
                estimatedFare,
                distance,
                status: 'PENDING',
                departureTime: departureTime || metadata?.departureTime, // Support both top-level and metadata
            },
            include: {
                rider: {
                    select: { id: true, name: true, email: true, phone: true },
                },
            },
        })

        // TODO: Trigger real-time notification to nearby drivers
        // await triggerDriverNotification(...)

        return NextResponse.json({ ride }, { status: 201 })
    } catch (error) {
        console.error('Error creating ride:', error)
        return NextResponse.json(
            { error: `Failed to create ride: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        )
    }
}
