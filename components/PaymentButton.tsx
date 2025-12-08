'use client'

import { useState } from 'react'

interface PaymentButtonProps {
    email: string
    amount: number
    metadata?: any
    text?: string
    onSuccess?: (reference: string) => void
    onClose?: () => void
    className?: string
}

export default function PaymentButton({
    email,
    amount,
    metadata,
    text = 'Fund Wallet',
    onSuccess,
    onClose,
    className = 'btn-success w-full py-3',
}: PaymentButtonProps) {
    const handlePayment = async () => {
        console.log('=== PAYMENT BUTTON CLICKED ===')
        console.log('Email:', email)
        console.log('Amount:', amount)

        // Get the public key
        const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

        console.log('Public Key Available:', !!publicKey)
        console.log('Public Key (first 10 chars):', publicKey ? publicKey.substring(0, 10) + '...' : 'MISSING')

        if (!publicKey) {
            const errorMsg = 'Payment configuration error: Paystack public key is missing. Please configure NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in Vercel.'
            alert(errorMsg)
            console.error('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not set')
            console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('PAYSTACK')))
            return
        }

        try {
            console.log('Loading Paystack...')
            const PaystackPop = (await import('@paystack/inline-js')).default
            console.log('Paystack loaded, creating instance...')
            const paystack = new PaystackPop()

            console.log('Initiating transaction...')
            paystack.newTransaction({
                key: publicKey,
                email,
                amount: amount * 100, // Convert to kobo
                metadata,
                onSuccess: (transaction: any) => {
                    console.log('Payment successful!', transaction)
                    if (onSuccess) {
                        onSuccess(transaction.reference)
                    }
                },
                onCancel: () => {
                    console.log('Payment cancelled by user')
                    if (onClose) {
                        onClose()
                    }
                },
            })
        } catch (error) {
            console.error('Payment error:', error)
            alert('Failed to initialize payment. Check console for details.')
        }
    }

    return (
        <button onClick={handlePayment} className={className}>
            {text} (₦{(amount || 0).toLocaleString()})
        </button>
    )
}
