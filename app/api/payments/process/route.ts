import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { rideId, paymentMethod, provider } = body

        // Validate ride
        const ride = await prisma.ride.findUnique({
            where: { id: rideId },
        })

        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
        }

        if (ride.riderId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const amount = ride.actualFare || ride.estimatedFare

        // TODO: Integrate with actual payment gateway (Paystack/Stripe)
        // For now, create a payment record
        const payment = await prisma.payment.create({
            data: {
                rideId,
                userId: session.user.id,
                amount,
                currency: 'NGN',
                status: 'PENDING',
                paymentMethod,
                provider: provider || 'paystack',
                transactionRef: `TXN-${Date.now()}`,
            },
        })

        // Simulate successful payment (replace with actual gateway integration)
        const updatedPayment = await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: 'COMPLETED',
                paidAt: new Date(),
            },
        })

        return NextResponse.json({ payment: updatedPayment }, { status: 201 })
    } catch (error) {
        console.error('Error processing payment:', error)
        return NextResponse.json(
            { error: 'Failed to process payment' },
            { status: 500 }
        )
    }
}
