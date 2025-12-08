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

            case 'dedicatedaccount.assign.success':
                console.log('Virtual account assigned to customer')
                break

            case 'transfer.success':
                // Check if it's a ride payment or wallet funding
                const transferDescription = event.data.narration || event.data.description || ''
                if (transferDescription.includes('RIDE-')) {
                    await handleRidePaymentTransfer(event.data)
                } else {
                    await handleVirtualAccountCredit(event.data)
                }
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

async function handleVirtualAccountCredit(data: any) {
    try {
        // Find virtual account by customer code or account details
        const virtualAccount = await prisma.virtualAccount.findFirst({
            where: {
                OR: [
                    { paystackCustomerCode: data.customer?.customer_code },
                    { accountNumber: data.account_number },
                ],
            },
            include: {
                user: {
                    include: {
                        wallet: true,
                    },
                },
            },
        })

        if (!virtualAccount) {
            console.error('Virtual account not found for transfer')
            return
        }

        // Get or create wallet
        let wallet = virtualAccount.user.wallet

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: {
                    userId: virtualAccount.userId,
                    balance: 0,
                },
            })
        }

        const amount = data.amount / 100 // Convert from kobo to naira
        const reference = data.reference || data.transaction_reference

        // Check if already processed
        const existingTransaction = await prisma.walletTransaction.findUnique({
            where: { reference },
        })

        if (existingTransaction) {
            console.log('Transaction already processed:', reference)
            return
        }

        // Update wallet balance and create transaction atomically
        await prisma.$transaction([
            prisma.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: {
                        increment: amount,
                    },
                },
            }),
            prisma.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    type: 'DEPOSIT',
                    amount,
                    description: `Bank transfer to ${virtualAccount.accountNumber}`,
                    reference,
                    status: 'COMPLETED',
                },
            }),
        ])

        console.log(`✅ Wallet auto-credited: ₦${amount} for user ${virtualAccount.userId}`)
    } catch (error) {
        console.error('Error handling virtual account credit:', error)
        throw error
    }
}

async function handleRidePaymentTransfer(data: any) {
    try {
        const narration = data.narration || data.description || ''
        const match = narration.match(/RIDE-([A-Z0-9]{8})/i)

        if (!match) {
            console.error('No ride reference found in transfer narration')
            return
        }

        const rideIdPrefix = match[1].toLowerCase()

        // Find ride starting with this ID
        const ride = await prisma.ride.findFirst({
            where: {
                id: {
                    startsWith: rideIdPrefix,
                },
            },
            include: {
                payment: true,
            },
        })

        if (!ride) {
            console.error('Ride not found for reference:', match[0])
            return
        }

        const amount = data.amount / 100 // Convert from kobo to naira

        // Verify amount matches
        if (Math.abs(amount - ride.estimatedFare) > 1) {
            console.error(`Amount mismatch: expected ${ride.estimatedFare}, got ${amount}`)
            return
        }

        const reference = data.reference || data.transaction_reference

        // Check if already processed
        if (ride.payment && ride.payment.status === 'COMPLETED') {
            console.log('Ride already paid:', ride.id)
            return
        }

        // Create or update payment record
        if (ride.payment) {
            await prisma.payment.update({
                where: { id: ride.payment.id },
                data: {
                    status: 'COMPLETED',
                    ridePaymentMethod: 'BANK_TRANSFER',
                    bankReference: match[0],
                    transactionRef: reference,
                    paidAt: new Date(),
                },
            })
        } else {
            await prisma.payment.create({
                data: {
                    rideId: ride.id,
                    userId: ride.riderId,
                    amount: ride.estimatedFare,
                    status: 'COMPLETED',
                    paymentMethod: 'BANK_TRANSFER',
                    ridePaymentMethod: 'BANK_TRANSFER',
                    provider: 'paystack',
                    transactionRef: reference,
                    bankReference: match[0],
                    paidAt: new Date(),
                },
            })
        }

        console.log(`✅ Ride payment confirmed via bank transfer: ${match[0]} - ₦${amount}`)
    } catch (error) {
        console.error('Error handling ride payment transfer:', error)
        throw error
    }
}
```
