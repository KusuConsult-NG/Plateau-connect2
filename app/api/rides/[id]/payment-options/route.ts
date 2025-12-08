import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { COMPANY_ACCOUNT, generateRideReference } from '@/lib/company-account'

// GET - Get payment options for a ride
export async function GET(
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
            include: {
                payment: true,
            },
        })

        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
        }

        // Verify ownership
        if (ride.riderId !== session.user.id) {
            return NextResponse.json(
                { error: 'You can only view payment options for your own rides' },
                { status: 403 }
            )
        }

        // Get wallet balance
        const wallet = await prisma.wallet.findUnique({
            where: { userId: session.user.id },
        })

        const walletBalance = wallet?.balance || 0

        // Generate reference for bank transfer
        const bankReference = generateRideReference(ride.id)

        return NextResponse.json({
            rideId: ride.id,
            amount: ride.estimatedFare,
            walletBalance,
            canPayFromWallet: walletBalance >= ride.estimatedFare,
            bankTransfer: {
                ...COMPANY_ACCOUNT,
                reference: bankReference,
                amount: ride.estimatedFare,
            },
            isPaid: ride.payment?.status === 'COMPLETED',
        })
    } catch (error) {
        console.error('Payment options error:', error)
        return NextResponse.json(
            { error: 'Failed to get payment options' },
            { status: 500 }
        )
    }
}
