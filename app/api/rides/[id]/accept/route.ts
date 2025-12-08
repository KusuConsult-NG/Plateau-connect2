import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// POST - Accept a ride
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'DRIVER') {
            return NextResponse.json({ error: 'Unauthorized. Only drivers can accept rides.' }, { status: 401 })
        }

        const rideId = params.id

        // Transaction to ensure atomic update and avoid race conditions
        const result = await prisma.$transaction(async (tx) => {
            const ride = await tx.ride.findUnique({
                where: { id: rideId },
            })

            if (!ride) {
                throw new Error('Ride not found')
            }

            if (ride.status !== 'PENDING') {
                throw new Error('Ride is no longer available')
            }

            if (ride.driverId) {
                throw new Error('Ride already accepted by another driver')
            }

            // Update the ride
            const updatedRide = await tx.ride.update({
                where: { id: rideId },
                data: {
                    status: 'ACCEPTED',
                    driverId: session.user.id,
                },
                include: {
                    rider: {
                        select: { id: true, name: true, phone: true },
                    },
                },
            })

            return updatedRide
        })

        return NextResponse.json({ success: true, ride: result })

    } catch (error) {
        console.error('Error accepting ride:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to accept ride' },
            { status: 400 }
        )
    }
}
