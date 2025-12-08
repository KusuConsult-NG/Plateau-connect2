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
        // Get the public key - use window.ENV if available (server-rendered), otherwise process.env
        const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

        if (!publicKey) {
            alert('Payment configuration error: Paystack public key is missing. Please contact support.')
            console.error('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not set')
            return
        }

        const PaystackPop = (await import('@paystack/inline-js')).default
        const paystack = new PaystackPop()

        paystack.newTransaction({
            key: publicKey,
            email,
            amount: amount * 100, // Convert to kobo
            metadata,
            onSuccess: (transaction: any) => {
                if (onSuccess) {
                    onSuccess(transaction.reference)
                }
            },
            onCancel: () => {
                if (onClose) {
                    onClose()
                }
            },
        })
    }

    return (
        <button onClick={handlePayment} className={className}>
            {text} (₦{(amount || 0).toLocaleString()})
        </button>
    )
}
