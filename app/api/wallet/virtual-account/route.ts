import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

// GET - Get or create user's virtual account
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user already has a virtual account
        let virtualAccount = await prisma.virtualAccount.findUnique({
            where: { userId: session.user.id },
        })

        // If not, create one via Paystack
        if (!virtualAccount) {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
            })

            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 })
            }

            // Create customer on Paystack
            const customerResponse = await fetch('https://api.paystack.co/customer', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    first_name: user.name?.split(' ')[0] || user.name,
                    last_name: user.name?.split(' ').slice(1).join(' ') || '',
                    phone: user.phone || '',
                }),
            })

            const customerData = await customerResponse.json()

            if (!customerData.status) {
                throw new Error(customerData.message || 'Failed to create customer')
            }

            const customerCode = customerData.data.customer_code

            // Create dedicated virtual account
            const accountResponse = await fetch('https://api.paystack.co/dedicated_account', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer: customerCode,
                    preferred_bank: 'wema-bank', // or 'test-bank' for testing
                }),
            })

            const accountData = await accountResponse.json()

            if (!accountData.status) {
                throw new Error(accountData.message || 'Failed to create virtual account')
            }

            const { account_number, account_name, bank, id: accountId } = accountData.data

            // Save to database
            virtualAccount = await prisma.virtualAccount.create({
                data: {
                    userId: session.user.id,
                    accountNumber: account_number,
                    accountName: account_name,
                    bankName: bank.name,
                    paystackCustomerCode: customerCode,
                    paystackAccountId: accountId?.toString(),
                },
            })
        }

        return NextResponse.json({
            accountNumber: virtualAccount.accountNumber,
            accountName: virtualAccount.accountName,
            bankName: virtualAccount.bankName,
            isActive: virtualAccount.isActive,
        })
    } catch (error) {
        console.error('Virtual account error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to get virtual account' },
            { status: 500 }
        )
    }
}
