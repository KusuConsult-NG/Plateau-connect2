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

        // Notify rider about driver acceptance
        try {
            // Fetch complete driver details including profile for vehicle info
            const driverProfile = await prisma.driverProfile.findUnique({
                where: { userId: session.user.id }
            })

            const vehicleModel = driverProfile ? `${driverProfile.vehicleColor} ${driverProfile.vehicleMake} ${driverProfile.vehicleModel}` : 'Vehicle'
            const licensePlate = driverProfile?.licensePlate || 'N/A'

            /* 
             * In a real app, you would import this from @/lib/notifications
             * But since we just created it, we can use it.
             */
            const { sendBookingConfirmation } = await import('@/lib/notifications')

            await sendBookingConfirmation(
                updatedRide.rider.email as string,
                updatedRide.rider.phone as string,
                {
                    riderName: updatedRide.rider.name as string,
                    driverName: updatedRide.driver?.name as string,
                    vehicleModel: vehicleModel,
                    licensePlate: licensePlate,
                    pickup: updatedRide.pickupLocation,
                    destination: updatedRide.destination,
                    fare: updatedRide.estimatedFare
                }
            )
        } catch (notifyError) {
            console.error('Failed to send notification:', notifyError)
            // Don't fail the request just because notification failed
        }

        return NextResponse.json({ ride: updatedRide })
    } catch (error) {
        console.error('Error accepting ride:', error)
        return NextResponse.json(
            { error: 'Failed to accept ride' },
            { status: 500 }
        )
    }
}
