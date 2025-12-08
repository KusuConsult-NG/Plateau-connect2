'use client'

import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { useState } from 'react'
import PaymentButton from '@/components/PaymentButton'
import TripSummaryModal from '@/components/TripSummaryModal'
import { FiMapPin, FiClock, FiCalendar, FiCreditCard, FiX, FiFileText } from 'react-icons/fi'
import { formatCurrency, formatDateTime } from '@/lib/utils'

// Fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Payment Options Modal
function PaymentOptionsModal({
    rideId,
    amount,
    onClose,
    onSuccess
}: {
    rideId: string,
    amount: number,
    onClose: () => void,
    onSuccess: () => void
}) {
    const { data: options, error } = useSWR(`/api/rides/${rideId}/payment-options`, fetcher)
    const [step, setStep] = useState<'SELECT' | 'TRANSFER'>('SELECT')
    const [paying, setPaying] = useState(false)

    const handleWalletPay = async () => {
        if (!confirm(`Pay ₦${amount} from your wallet?`)) return

        setPaying(true)
        try {
            const res = await fetch(`/api/rides/${rideId}/pay-from-wallet`, {
                method: 'POST',
            })
            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Payment failed')

            alert('Payment successful! 🎉')
            onSuccess()
            onClose()
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Payment failed')
        } finally {
            setPaying(false)
        }
    }

    if (!options && !error) return <div className="p-8 text-center text-white">Loading options...</div>
    if (error) return <div className="p-8 text-center text-error">Failed to load options</div>

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-dark-bg-secondary w-full max-w-md rounded-2xl border border-dark-border shadow-2xl overflow-hidden animate-slideIn">

                {/* Header */}
                <div className="p-4 border-b border-dark-border flex justify-between items-center bg-dark-bg-tertiary/50">
                    <h3 className="text-xl font-bold text-white">Payment Method</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <FiX className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6 text-center">
                        <p className="text-dark-text-secondary text-sm mb-1">Total Amount</p>
                        <p className="text-3xl font-bold gradient-text">{formatCurrency(amount)}</p>
                    </div>

                    {step === 'SELECT' ? (
                        <div className="space-y-4">
                            {/* Option 1: Wallet */}
                            <button
                                onClick={handleWalletPay}
                                disabled={!options.canPayFromWallet || paying}
                                className={`w-full p-4 rounded-xl border-2 flex items-center justify-between group transition-all duration-300 ${options.canPayFromWallet
                                    ? 'border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10'
                                    : 'border-dark-border opacity-50 cursor-not-allowed bg-dark-bg-tertiary'
                                    }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${options.canPayFromWallet ? 'bg-primary/20 text-primary' : 'bg-gray-700 text-gray-400'
                                        }`}>
                                        <FiCreditCard className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-white">Pay from Wallet</p>
                                        <p className={`text-sm ${options.canPayFromWallet ? 'text-success' : 'text-error'}`}>
                                            Bal: {formatCurrency(options.walletBalance)}
                                        </p>
                                    </div>
                                </div>
                                {paying ? (
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${options.canPayFromWallet ? 'border-primary' : 'border-gray-600'
                                        }`}>
                                        {options.canPayFromWallet && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                                    </div>
                                )}
                            </button>

                            {/* Option 2: Bank Transfer */}
                            <button
                                onClick={() => setStep('TRANSFER')}
                                className="w-full p-4 rounded-xl border-2 border-dark-border hover:border-white/30 bg-dark-bg-tertiary hover:bg-white/5 transition-all duration-300 flex items-center justify-between group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                        <div className="text-xl">🏦</div>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-white">Direct Bank Transfer</p>
                                        <p className="text-sm text-dark-text-secondary">Transfer to Company Account</p>
                                    </div>
                                </div>
                                <div className="text-gray-400 group-hover:translate-x-1 transition-transform">→</div>
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fadeIn">
                            {/* Bank Transfer Details */}
                            <div className="bg-dark-bg-tertiary rounded-xl p-4 border border-dark-border mb-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-dark-text-secondary uppercase tracking-wider">Bank Name</p>
                                        <p className="font-bold text-white text-lg">{options.bankTransfer.bankName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-dark-text-secondary uppercase tracking-wider">Account Number</p>
                                        <p className="font-mono text-2xl text-primary font-bold tracking-widest">{options.bankTransfer.accountNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-dark-text-secondary uppercase tracking-wider">Account Name</p>
                                        <p className="font-medium text-white">{options.bankTransfer.accountName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6">
                                <p className="text-warning text-sm font-bold mb-2">⚠️ IMPORTANT INSTRUCTION</p>
                                <p className="text-gray-300 text-sm mb-2">
                                    Copy this code and paste it in your transfer description/narration:
                                </p>
                                <div className="bg-dark-bg p-3 rounded border border-warning/20 flex justify-between items-center cursor-pointer hover:bg-black/40"
                                    onClick={() => navigator.clipboard.writeText(options.bankTransfer.reference)}>
                                    <code className="text-warning font-mono font-bold text-lg">{options.bankTransfer.reference}</code>
                                    <span className="text-xs text-dark-text-secondary">Click to copy</span>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setStep('SELECT')}
                                    className="flex-1 py-3 rounded-xl border border-dark-border text-white hover:bg-white/5 font-bold"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90"
                                >
                                    I've Sent It
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function TripsPage() {
    const { data: session } = useSession()
    const [cancellingId, setCancellingId] = useState<string | null>(null)
    const [selectedRideForPayment, setSelectedRideForPayment] = useState<{ id: string, amount: number } | null>(null)
    const [selectedRideForSummary, setSelectedRideForSummary] = useState<any | null>(null)

    // Fetch rides for the current user
    const { data, error, mutate } = useSWR('/api/rides?role=RIDER', fetcher, {
        refreshInterval: 5000
    })

    const loading = !data && !error

    const handleCancelRide = async (rideId: string) => {
        if (!confirm('Are you sure you want to cancel this trip? This action cannot be undone.')) {
            return
        }

        setCancellingId(rideId)
        try {
            const response = await fetch(`/api/rides/${rideId}/cancel`, {
                method: 'POST',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to cancel ride')
            }

            alert('Trip cancelled successfully')
            mutate() // Refresh the list
        } catch (error) {
            console.error('Cancellation error:', error)
            alert(error instanceof Error ? error.message : 'Failed to cancel trip')
        } finally {
            setCancellingId(null)
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
                                    {/* Ride Info and Status */}
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center space-x-2 text-sm text-dark-text-secondary mb-2">
                                            <FiCalendar />
                                            <span>{formatDateTime(ride.createdAt)}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${ride.status === 'COMPLETED' ? 'bg-success/10 text-success' :
                                                ride.status === 'CANCELLED' ? 'bg-error/10 text-error' :
                                                    ride.status === 'PENDING' ? 'bg-warning/10 text-warning' :
                                                        'bg-primary/10 text-primary'
                                                }`}>
                                                {ride.status}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Pickup & Destination */}
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
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex items-center space-x-2 text-success font-bold bg-success/10 px-3 py-2 rounded-lg justify-center">
                                                    <FiCreditCard />
                                                    <span>Paid</span>
                                                </div>
                                                {ride.status === 'COMPLETED' && (
                                                    <button
                                                        onClick={() => setSelectedRideForSummary(ride)}
                                                        className="btn-outline border-primary/30 text-primary hover:bg-primary/10 w-full py-2 px-4 text-sm font-bold flex items-center justify-center space-x-2"
                                                    >
                                                        <FiFileText className="w-4 h-4" />
                                                        <span>View Summary</span>
                                                    </button>
                                                )}
                                            </div>
                                        ) : isCancelled ? (
                                            <span className="text-dark-text-secondary">Cancelled</span>
                                        ) : (
                                            <div className="flex flex-col space-y-2 w-full">
                                                <button
                                                    onClick={() => setSelectedRideForPayment({ id: ride.id, amount: ride.estimatedFare })}
                                                    className="btn-primary w-full py-2 px-6 text-sm font-bold shadow-lg shadow-primary/20"
                                                >
                                                    Pay Now
                                                </button>

                                                {(ride.status === 'PENDING' || ride.status === 'ACCEPTED') && (
                                                    <button
                                                        onClick={() => handleCancelRide(ride.id)}
                                                        disabled={cancellingId === ride.id}
                                                        className="btn-outline border-error/30 text-error hover:bg-error/10 w-full py-2 px-6 text-sm font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
                                                    >
                                                        {cancellingId === ride.id ? (
                                                            <span>Cancelling...</span>
                                                        ) : (
                                                            <>
                                                                <FiX className="w-4 h-4" />
                                                                <span>Cancel Trip</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Payment Modal */}
            {selectedRideForPayment && (
                <PaymentOptionsModal
                    rideId={selectedRideForPayment.id}
                    amount={selectedRideForPayment.amount}
                    onClose={() => setSelectedRideForPayment(null)}
                    onSuccess={() => {
                        setSelectedRideForPayment(null)
                        mutate()
                    }}
                />
            )}

            {/* Trip Summary Modal */}
            {selectedRideForSummary && (
                <TripSummaryModal
                    ride={selectedRideForSummary}
                    onClose={() => setSelectedRideForSummary(null)}
                />
            )}
        </div>
    )
}
