import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { calculateFare } from '@/lib/constants'
import { calculateDistance } from '@/lib/utils'

// GET - List rides
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')

        const where: any = {}

        // Filter by role
        if (session.user.role === 'RIDER') {
            where.riderId = session.user.id
        } else if (session.user.role === 'DRIVER') {
            where.driverId = session.user.id
        }
        // Admin can see all rides

        if (status) {
            where.status = status
        }

        const rides = await prisma.ride.findMany({
            where,
            include: {
                rider: {
                    select: { id: true, name: true, email: true, phone: true },
                },
                driver: {
                    select: { id: true, name: true, email: true, phone: true },
                },
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        })

        return NextResponse.json({ rides })
    } catch (error) {
        console.error('Error fetching rides:', error)
        return NextResponse.json(
            { error: 'Failed to fetch rides' },
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
            { error: 'Failed to create ride' },
            { status: 500 }
        )
    }
}
