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
        const { amount, reference, metadata } = body

        // Validate
        if (!amount || !reference) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Create Payment Record (Pending)
        // Note: For funding wallet, we might not have a rideId.
        // We'll need to make rideId optional in schema or handle wallet funding differently.
        // For now, let's assume this is for a specific ride or general transaction.

        // If funding wallet, we might want to create a Transaction model or use Payment model flexibly.
        // Given current Schema, Payment requires rideId. 
        // Let's modify logic to optionally check rideId or strictly use it for Rides.

        // If this is called AFTER successful Paystack popup transaction (verification):
        // We verify the transaction with Paystack API.

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

        // Determine if this was for a ride or wallet funding
        // Assuming metadata contains context

        return NextResponse.json({
            success: true,
            message: 'Payment verified',
            data: verifyData.data
        })

    } catch (error) {
        console.error('Payment processing error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
