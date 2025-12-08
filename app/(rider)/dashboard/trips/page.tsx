'use client'

import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import PaymentButton from '@/components/PaymentButton'
import { FiMapPin, FiClock, FiCalendar, FiCreditCard } from 'react-icons/fi'
import { formatCurrency, formatDateTime } from '@/lib/utils'

// Fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function TripsPage() {
    const { data: session } = useSession()
    // Fetch rides for the current user
    const { data, error, mutate } = useSWR('/api/rides?role=RIDER', fetcher, {
        refreshInterval: 5000
    })

    const loading = !data && !error

    const handlePaymentSuccess = async (reference: string, rideId: string, amount: number) => {
        try {
            // Call our backend to verify and record the payment
            const response = await fetch('/api/payments/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reference,
                    amount,
                    metadata: { rideId }
                }),
            })

            if (response.ok) {
                alert('Payment verified successfully!')
                mutate() // Refresh the list to show updated status
            } else {
                alert('Payment verification failed on server.')
            }
        } catch (e) {
            console.error('Verification error:', e)
            alert('Error verifying payment.')
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8 animate-slideUp">
                <h1 className="text-3xl font-bold mb-2 gradient-text">Your Trips</h1>
                <p className="text-dark-text-secondary">Track your ride history and payments.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-dark-bg-tertiary/50 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : error || data?.error ? (
                <div className="text-error p-4 bg-error/10 rounded-xl">
                    {data?.error || 'Failed to load trips. Please try again.'}
                </div>
            ) : !data?.rides || data.rides.length === 0 ? (
                <div className="text-center py-10 text-dark-text-secondary">
                    No trips found. Book your first ride!
                </div>
            ) : (
                <div className="space-y-6">
                    {data.rides.map((ride: any) => {
                        const isPaid = ride.payment && ride.payment.status === 'COMPLETED'
                        const isCancelled = ride.status === 'CANCELLED'

                        return (
                            <div key={ride.id} className="card-glass animate-slideIn">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    {/* Ride Info */}
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center space-x-2 text-sm text-dark-text-secondary mb-2">
                                            <FiCalendar />
                                            <span>{formatDateTime(ride.createdAt)}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${ride.status === 'COMPLETED' ? 'bg-success/10 text-success' :
                                                ride.status === 'CANCELLED' ? 'bg-error/10 text-error' :
                                                    'bg-primary/10 text-primary'
                                                }`}>
                                                {ride.status}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="mt-1">
                                                    <div className="w-3 h-3 rounded-full bg-success border-2 border-white/20"></div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-dark-text-secondary">From</p>
                                                    <p className="font-semibold text-white">{ride.pickupLocation}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="mt-1">
                                                    <div className="w-3 h-3 rounded-full bg-error border-2 border-white/20"></div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-dark-text-secondary">To</p>
                                                    <p className="font-semibold text-white">{ride.destination}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price & Action */}
                                    <div className="flex flex-col items-end space-y-3 min-w-[150px]">
                                        <p className="text-2xl font-bold gradient-text">
                                            {formatCurrency(ride.estimatedFare)}
                                        </p>

                                        {isPaid ? (
                                            <div className="flex items-center space-x-2 text-success font-bold bg-success/10 px-3 py-2 rounded-lg">
                                                <FiCreditCard />
                                                <span>Paid</span>
                                            </div>
                                        ) : isCancelled ? (
                                            <span className="text-dark-text-secondary">Cancelled</span>
                                        ) : (
                                            <PaymentButton
                                                email={session?.user?.email || ride.rider.email}
                                                amount={ride.estimatedFare}
                                                text="Pay Now"
                                                metadata={{ rideId: ride.id }}
                                                onSuccess={(ref) => handlePaymentSuccess(ref, ride.id, ride.estimatedFare)}
                                                className="btn-primary w-full py-2 px-6 text-sm font-bold shadow-lg shadow-primary/20"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
