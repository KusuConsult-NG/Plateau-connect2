import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PATCH - Update ride status
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'DRIVER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { status } = await request.json()
        const rideId = params.id

        // Validate status transition
        const allowedStatuses = ['IN_PROGRESS', 'COMPLETED', 'CANCELLED']
        if (!allowedStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        // Check if ride exists and belongs to driver
        const ride = await prisma.ride.findUnique({
            where: { id: rideId },
        })

        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
        }

        if (ride.driverId !== session.user.id) {
            return NextResponse.json({ error: 'Not authorized for this ride' }, { status: 403 })
        }

        // Update status
        const updatedRide = await prisma.ride.update({
            where: { id: rideId },
            data: {
                status,
                // Set timestamps based on status
                ...(status === 'IN_PROGRESS' ? { startedAt: new Date() } : {}),
                ...(status === 'COMPLETED' ? { completedAt: new Date() } : {}),
            },
        })

        return NextResponse.json({ ride: updatedRide })
    } catch (error) {
        console.error('Update status error:', error)
        return NextResponse.json(
            { error: 'Failed to update ride status' },
            { status: 500 }
        )
    }
}
