import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Get wallet balance and recent transactions
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get or create wallet for user
        let wallet = await prisma.wallet.findUnique({
            where: { userId: session.user.id },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        })

        // If wallet doesn't exist, create one
        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: {
                    userId: session.user.id,
                    balance: 0,
                },
                include: {
                    transactions: true,
                },
            })
        }

        return NextResponse.json({
            balance: wallet.balance,
            transactions: wallet.transactions,
        })
    } catch (error) {
        console.error('Error fetching wallet:', error)
        return NextResponse.json(
            { error: 'Failed to fetch wallet' },
            { status: 500 }
        )
    }
}

// POST - Process wallet deposit
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { amount, reference } = body

        if (!amount || !reference) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Verify payment with Paystack
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

        // Check if already processed
        const existingTransaction = await prisma.walletTransaction.findUnique({
            where: { reference },
        })

        if (existingTransaction) {
            return NextResponse.json({
                success: true,
                message: 'Transaction already processed',
            })
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

        // Update wallet balance and create transaction
        const result = await prisma.$transaction([
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
                    description: 'Wallet deposit via Paystack',
                    reference,
                    status: 'COMPLETED',
                },
            }),
        ])

        return NextResponse.json({
            success: true,
            message: 'Deposit successful',
            balance: result[0].balance,
        })
    } catch (error) {
        console.error('Error processing deposit:', error)
        return NextResponse.json(
            { error: 'Failed to process deposit' },
            { status: 500 }
        )
    }
}
