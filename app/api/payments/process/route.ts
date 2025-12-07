import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || ''

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { rideId, paymentMethod, email } = body

        // Validate ride
        const ride = await prisma.ride.findUnique({
            where: { id: rideId },
            include: {
                rider: true,
            },
        })

        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
        }

        if (ride.riderId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const amount = ride.actualFare || ride.estimatedFare

        // Generate unique reference
        const reference = `RIDE-${rideId}-${Date.now()}`

        // Create payment record
        const payment = await prisma.payment.create({
            data: {
                rideId,
                userId: session.user.id,
                amount,
                currency: 'NGN',
                status: 'PENDING',
                paymentMethod,
                provider: 'paystack',
                transactionRef: reference,
            },
        })

        // Initialize Paystack payment
        const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email || ride.rider.email,
                amount: amount * 100, // Paystack expects amount in kobo (smallest currency unit)
                reference,
                currency: 'NGN',
                callback_url: `${process.env.NEXTAUTH_URL}/dashboard/rides/${rideId}/payment-success`,
                metadata: {
                    rideId,
                    userId: session.user.id,
                    paymentId: payment.id,
                },
            }),
        })

        const paystackData = await paystackResponse.json()

        if (!paystackData.status) {
            // Payment initialization failed
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'FAILED' },
            })

            return NextResponse.json(
                { error: paystackData.message || 'Payment initialization failed' },
                { status: 400 }
            )
        }

        // Return payment details and authorization URL
        return NextResponse.json({
            payment: {
                id: payment.id,
                reference,
                amount,
                currency: 'NGN',
            },
            authorization_url: paystackData.data.authorization_url,
            access_code: paystackData.data.access_code,
        }, { status: 201 })
    } catch (error) {
        console.error('Error processing payment:', error)
        return NextResponse.json(
            { error: 'Failed to process payment' },
            { status: 500 }
        )
    }
}

// Verify payment status
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const reference = searchParams.get('reference')

        if (!reference) {
            return NextResponse.json({ error: 'Reference required' }, { status: 400 })
        }

        // Verify payment with Paystack
        const paystackResponse = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        )

        const paystackData = await paystackResponse.json()

        if (!paystackData.status) {
            return NextResponse.json(
                { error: 'Payment verification failed' },
                { status: 400 }
            )
        }

        // Update payment in database
        const payment = await prisma.payment.findFirst({
            where: { transactionRef: reference },
        })

        if (payment && paystackData.data.status === 'success') {
            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'COMPLETED',
                    paidAt: new Date(),
                },
            })
        }

        return NextResponse.json({
            verified: paystackData.data.status === 'success',
            payment: paystackData.data,
        })
    } catch (error) {
        console.error('Error verifying payment:', error)
        return NextResponse.json(
            { error: 'Failed to verify payment' },
            { status: 500 }
        )
    }
}
