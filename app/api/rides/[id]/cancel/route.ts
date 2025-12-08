import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const rideId = params.id

        // Get the ride
        const ride = await prisma.ride.findUnique({
            where: { id: rideId },
        })

        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
        }

        // Verify ownership - only the rider can cancel their own ride
        if (ride.riderId !== session.user.id) {
            return NextResponse.json(
                { error: 'You can only cancel your own rides' },
                { status: 403 }
            )
        }

        // Only allow cancellation for PENDING or ACCEPTED rides
        if (ride.status !== 'PENDING' && ride.status !== 'ACCEPTED') {
            return NextResponse.json(
                { error: `Cannot cancel ${ride.status.toLowerCase()} rides` },
                { status: 400 }
            )
        }

        // Update ride status to CANCELLED
        const updatedRide = await prisma.ride.update({
            where: { id: rideId },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date(),
            },
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
        })

        return NextResponse.json({
            success: true,
            message: 'Ride cancelled successfully',
            ride: updatedRide,
        })
    } catch (error) {
        console.error('Error cancelling ride:', error)
        return NextResponse.json(
            { error: 'Failed to cancel ride' },
            { status: 500 }
        )
    }
}
