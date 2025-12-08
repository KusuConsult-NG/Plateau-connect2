import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PaymentMethodType } from '@prisma/client'

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { amount, reference, metadata } = body

        // Validate
        if (!amount || !reference) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Verify with Paystack
        const verifyResponse = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        )

        const verifyData = await verifyResponse.json()

        if (!verifyData.status || verifyData.data.status !== 'success') {
            return NextResponse.json(
                { error: 'Payment verification failed' },
                { status: 400 }
            )
        }

        // Check if payment already exists (idempotency)
        const existingPayment = await prisma.payment.findUnique({
            where: { transactionRef: reference },
        })

        if (existingPayment) {
            return NextResponse.json({
                success: true,
                message: 'Payment already recorded',
                data: existingPayment
            })
        }

        // Create Payment Record
        // Extract rideId from Paystack metadata if available (preferred) or request metadata
        const paystackMeta = verifyData.data.metadata || {}
        const rideId = paystackMeta.rideId || metadata?.rideId

        const payment = await prisma.payment.create({
            data: {
                userId: session.user.id,
                amount: amount,
                currency: 'NGN',
                status: 'COMPLETED',
                provider: 'paystack',
                transactionRef: reference,
                paymentMethod: 'CARD', // Default to CARD for Paystack
                paidAt: new Date(),
                gatewayResponse: verifyData.data,
                // Connect ride if ID exists
                rideId: rideId || undefined,
            },
        })

        // If linked to a ride, update the ride status
        if (rideId) {
            await prisma.ride.update({
                where: { id: rideId },
                data: {
                    status: 'COMPLETED', // Or keep as is, but mark paid via relation
                    // In many apps, payment happens after ride? 
                    // Or before? If pre-payment, maybe 'ACCEPTED' -> 'PAID'.
                    // For now, let's just ensure payment is linked. 
                    // We can validly say the ride flow involves payment.
                },
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Payment verified and recorded',
            data: payment
        })

    } catch (error) {
        console.error('Payment processing error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
