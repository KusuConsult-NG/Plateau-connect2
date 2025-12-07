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
        if (!session?.user || session.user.role !== 'DRIVER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const ride = await prisma.ride.findUnique({
            where: { id: params.id },
        })

        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
        }

        if (ride.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'Ride is not available' },
                { status: 400 }
            )
        }

        // Accept the ride
        const updatedRide = await prisma.ride.update({
            where: { id: params.id },
            data: {
                driverId: session.user.id,
                status: 'ACCEPTED',
                acceptedAt: new Date(),
            },
            include: {
                rider: {
                    select: { id: true, name: true, email: true, phone: true },
                },
                driver: {
                    select: { id: true, name: true, email: true, phone: true },
                },
            },
        })

        // TODO: Notify rider about driver acceptance
        // await triggerRiderNotification(ride.riderId, updatedRide)

        return NextResponse.json({ ride: updatedRide })
    } catch (error) {
        console.error('Error accepting ride:', error)
        return NextResponse.json(
            { error: 'Failed to accept ride' },
            { status: 500 }
        )
    }
}
