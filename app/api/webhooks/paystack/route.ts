import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { prisma } from '@/lib/db'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || ''

export async function POST(request: Request) {
    try {
        // Get the signature from headers
        const headersList = headers()
        const signature = headersList.get('x-paystack-signature')

        if (!signature) {
            return NextResponse.json(
                { error: 'No signature provided' },
                { status: 400 }
            )
        }

        // Get the raw body
        const body = await request.text()

        // Verify the signature
        const hash = crypto
            .createHmac('sha512', PAYSTACK_SECRET_KEY)
            .update(body)
            .digest('hex')

        if (hash !== signature) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            )
        }

        // Parse the event
        const event = JSON.parse(body)

        console.log('Paystack webhook event:', event.event)

        // Handle different event types
        switch (event.event) {
            case 'charge.success':
                await handleChargeSuccess(event.data)
                break

            case 'transfer.success':
                await handleTransferSuccess(event.data)
                break

            case 'transfer.failed':
                await handleTransferFailed(event.data)
                break

            default:
                console.log('Unhandled event type:', event.event)
        }

        return NextResponse.json({ status: 'success' })
    } catch (error) {
        console.error('Paystack webhook error:', error)
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        )
    }
}

async function handleChargeSuccess(data: any) {
    const { reference, amount, customer, metadata } = data

    try {
        // Find the payment by reference
        const payment = await prisma.payment.findFirst({
            where: { transactionRef: reference },
        })

        if (!payment) {
            console.error('Payment not found for reference:', reference)
            return
        }

        // Update payment status
        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: 'COMPLETED',
                paidAt: new Date(),
                // metadata: {
                //     paystack_data: data,
                // },
            },
        })

        // If this is for a ride, update the ride status
        if (payment.rideId) {
            await prisma.ride.update({
                where: { id: payment.rideId },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date(),
                },
            })
        }

        console.log('Payment completed:', reference)
    } catch (error) {
        console.error('Error handling charge success:', error)
    }
}

async function handleTransferSuccess(data: any) {
    const { reference, amount, recipient } = data

    try {
        // Handle successful transfer to driver
        console.log('Transfer successful:', reference)
        // TODO: Update driver earnings/payout status
    } catch (error) {
        console.error('Error handling transfer success:', error)
    }
}

async function handleTransferFailed(data: any) {
    const { reference, amount } = data

    try {
        // Handle failed transfer
        console.log('Transfer failed:', reference)
        // TODO: Notify admin or retry
    } catch (error) {
        console.error('Error handling transfer failed:', error)
    }
}
