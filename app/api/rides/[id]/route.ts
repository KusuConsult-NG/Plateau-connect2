import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Get single ride
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const ride = await prisma.ride.findUnique({
            where: { id: params.id },
            include: {
                rider: {
                    select: { id: true, name: true, email: true, phone: true, image: true },
                },
                driver: {
                    select: { id: true, name: true, email: true, phone: true, image: true },
                },
                payment: true,
            },
        })

        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
        }

        // Check authorization
        if (
            session.user.role !== 'ADMIN' &&
            ride.riderId !== session.user.id &&
            ride.driverId !== session.user.id
        ) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        return NextResponse.json({ ride })
    } catch (error) {
        console.error('Error fetching ride:', error)
        return NextResponse.json(
            { error: 'Failed to fetch ride' },
            { status: 500 }
        )
    }
}

// PATCH - Update ride status
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { status, actualFare } = body

        const ride = await prisma.ride.findUnique({
            where: { id: params.id },
        })

        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
        }

        // Only driver or admin can update ride status
        if (
            session.user.role !== 'ADMIN' &&
            ride.driverId !== session.user.id
        ) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const updateData: any = { status }

        // Set timestamps based on status
        if (status === 'IN_PROGRESS' && !ride.startedAt) {
            updateData.startedAt = new Date()
        } else if (status === 'COMPLETED' && !ride.completedAt) {
            updateData.completedAt = new Date()
            if (actualFare) {
                updateData.actualFare = actualFare
            }
        } else if (status === 'CANCELLED' && !ride.cancelledAt) {
            updateData.cancelledAt = new Date()
        }

        const updatedRide = await prisma.ride.update({
            where: { id: params.id },
            data: updateData,
            include: {
                rider: {
                    select: { id: true, name: true, email: true, phone: true },
                },
                driver: {
                    select: { id: true, name: true, email: true, phone: true },
                },
            },
        })

        // TODO: Trigger real-time update
        // await triggerRideUpdate(params.id, updatedRide)

        return NextResponse.json({ ride: updatedRide })
    } catch (error) {
        console.error('Error updating ride:', error)
        return NextResponse.json(
            { error: 'Failed to update ride' },
            { status: 500 }
        )
    }
}
