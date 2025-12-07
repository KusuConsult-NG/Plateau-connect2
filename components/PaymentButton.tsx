'use client'

import { useState } from 'react'

interface PaymentButtonProps {
    email: string
    amount: number
    metadata?: any
    onSuccess?: (reference: string) => void
    onClose?: () => void
    className?: string
}

export default function PaymentButton({
    email,
    amount,
    metadata,
    onSuccess,
    onClose,
    className = 'btn-success w-full py-3',
}: PaymentButtonProps) {
    const handlePayment = async () => {
        const PaystackPop = (await import('@paystack/inline-js')).default
        const paystack = new PaystackPop()

        paystack.newTransaction({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
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
            Fund Wallet (₦{amount.toLocaleString()})
        </button>
    )
}
