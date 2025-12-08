import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateRideReference } from '@/lib/company-account'

// POST - Pay for ride from wallet
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
                { error: 'You can only pay for your own rides' },
                { status: 403 }
            )
        }

        // Check if already paid
        if (ride.payment && ride.payment.status === 'COMPLETED') {
            return NextResponse.json(
                { error: 'This ride is already paid' },
                { status: 400 }
            )
        }

        // Get or create wallet
        let wallet = await prisma.wallet.findUnique({
            where: { userId: session.user.id },
        })

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: {
                    userId: session.user.id,
                    balance: 0,
                },
            })
        }

        // Check wallet balance
        if (wallet.balance < ride.estimatedFare) {
            return NextResponse.json(
                {
                    error: 'Insufficient wallet balance',
                    balance: wallet.balance,
                    required: ride.estimatedFare,
                },
                { status: 400 }
            )
        }

        // Perform payment transaction
        const result = await prisma.$transaction([
            // Deduct from wallet
            prisma.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: {
                        decrement: ride.estimatedFare,
                    },
                },
            }),
            // Create wallet transaction
            prisma.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    type: 'RIDE_PAYMENT',
                    amount: ride.estimatedFare,
                    description: `Payment for ride from ${ride.pickupLocation} to ${ride.destination}`,
                    reference: `wallet-${ride.id}`,
                    status: 'COMPLETED',
                },
            }),
            // Create or update payment record
            ride.payment
                ? prisma.payment.update({
                    where: { id: ride.payment.id },
                    data: {
                        status: 'COMPLETED',
                        ridePaymentMethod: 'WALLET',
                        paidAt: new Date(),
                    },
                })
                : prisma.payment.create({
                    data: {
                        rideId: ride.id,
                        userId: session.user.id,
                        amount: ride.estimatedFare,
                        status: 'COMPLETED',
                        paymentMethod: 'CARD',
                        ridePaymentMethod: 'WALLET',
                        provider: 'wallet',
                        transactionRef: `wallet-${ride.id}`,
                        paidAt: new Date(),
                    },
                }),
        ])

        return NextResponse.json({
            success: true,
            message: 'Payment successful',
            newBalance: result[0].balance,
        })
    } catch (error) {
        console.error('Wallet payment error:', error)
        return NextResponse.json(
            { error: 'Failed to process payment' },
            { status: 500 }
        )
    }
}
