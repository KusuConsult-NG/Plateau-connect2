'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { FiCheckCircle, FiStar, FiClock, FiMapPin, FiNavigation, FiPhone, FiMessageSquare, FiUser } from 'react-icons/fi'
import { formatCurrency } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const STATS = {
    acceptanceRate: 92,
    driverRating: 4.85,
    tripsThisWeek: 56,
}

export default function DriverDashboard() {
    const { data: session } = useSession()

    // 1. Check for Active Trip first
    const { data: activeData, mutate: mutateActive } = useSWR('/api/rides?type=active', fetcher)
    const activeRide = activeData?.rides?.[0]

    // 2. Fetch available rides only if no active trip
    const { data: availableData, mutate: mutateAvailable } = useSWR(
        !activeRide ? '/api/rides?type=available' : null,
        fetcher,
        { refreshInterval: 5000 }
    )

    // State to handle the "current" request being shown
    const [ignoredRides, setIgnoredRides] = useState<string[]>([])
    const [processing, setProcessing] = useState(false)

    // Find the first available ride that hasn't been ignored
    const newRequest = availableData?.rides?.find((ride: any) => !ignoredRides.includes(ride.id))

    const handleAccept = async (rideId: string) => {
        setProcessing(true)
        try {
            const res = await fetch(`/api/rides/${rideId}/accept`, { method: 'POST' })
            const result = await res.json()

            if (!res.ok) throw new Error(result.error || 'Failed to accept ride')

            alert('Ride accepted! switching to navigation...')
            mutateActive() // This will trigger the switch to Active View
            mutateAvailable()
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error accepting ride')
        } finally {
            setProcessing(false)
        }
    }

    const handleDecline = (rideId: string) => {
        setIgnoredRides(prev => [...prev, rideId])
    }

    // Only render dashboard if we have session
    if (!session) return null

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="bg-dark-bg-secondary/50 backdrop-blur-md border-b border-dark-border/50 p-6 z-10">
                <h1 className="text-3xl font-bold mb-6 gradient-text">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        icon={<FiCheckCircle className="w-6 h-6 text-white" />}
                        label="Acceptance Rate"
                        value={`${STATS.acceptanceRate}%`}
                        gradient="from-blue-500 to-cyan-500"
                    />
                    <StatCard
                        icon={<FiStar className="w-6 h-6 text-white" />}
                        label="Driver Rating"
                        value={STATS.driverRating.toFixed(2)}
                        gradient="from-yellow-400 to-orange-500"
                    />
                    <StatCard
                        icon={<FiClock className="w-6 h-6 text-white" />}
                        label="Trips This Week"
                        value={STATS.tripsThisWeek}
                        gradient="from-green-500 to-emerald-500"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 relative">
                {/* Map Area (Always Left) */}
                <div className="lg:col-span-2 bg-dark-bg-tertiary relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('/map-dark.png')] bg-cover bg-center opacity-50 transition-opacity group-hover:opacity-60"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-dark-text-secondary animate-pulse-glow">
                            <div className="text-8xl mb-6 relative">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
                                <span className="relative z-10">{activeRide ? '🚙' : '🗺️'}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {activeRide ? 'Navigation Active' : 'Live Map'}
                            </h2>
                            <p className="text-lg text-gray-400 max-w-md mx-auto">
                                {activeRide
                                    ? `Navigating to ${activeRide.status === 'ACCEPTED' ? 'Pickup' : 'Dropoff'}`
                                    : (newRequest ? 'New request found!' : 'Searching for high demand areas near you...')
                                }
                            </p>
                        </div>
                    </div>

                    <div className="absolute top-6 left-6 flex items-center space-x-2 bg-dark-bg/80 backdrop-blur-md px-4 py-2 rounded-full border border-success/30 shadow-lg shadow-success/10">
                        <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${activeRide ? 'bg-primary' : 'bg-success'}`}></span>
                        <span className={`font-semibold text-sm ${activeRide ? 'text-primary' : 'text-success'}`}>
                            {activeRide ? 'On Trip' : 'You are Online'}
                        </span>
                    </div>
                </div>

                {/* Sidebar - Dynamic View */}
                <div className="bg-dark-bg-secondary/90 backdrop-blur-xl border-l border-dark-border/50 p-6 overflow-y-auto relative z-20 shadow-2xl">
                    {activeRide ? (
                        <ActiveTripView
                            ride={activeRide}
                            onUpdate={() => {
                                mutateActive()
                                mutateAvailable()
                            }}
                        />
                    ) : newRequest ? (
                        <RideRequestView
                            ride={newRequest}
                            onAccept={handleAccept}
                            onDecline={handleDecline}
                            processing={processing}
                        />
                    ) : (
                        <ScannerView />
                    )}
                </div>
            </div>
        </div>
    )
}

// --- Sub Components ---

function ActiveTripView({ ride, onUpdate }: { ride: any, onUpdate: () => void }) {
    const [updating, setUpdating] = useState(false)

    const updateStatus = async (status: string) => {
        if (!confirm(`Are you sure you want to ${status === 'IN_PROGRESS' ? 'Start Trip' : 'Complete Trip'}?`)) return

        setUpdating(true)
        try {
            const res = await fetch(`/api/rides/${ride.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })

            if (!res.ok) throw new Error('Failed to update status')

            onUpdate() // Refresh parent state
        } catch (err) {
            alert('Error updating status')
        } finally {
            setUpdating(false)
        }
    }

    const isAccepted = ride.status === 'ACCEPTED'
    const isInProgress = ride.status === 'IN_PROGRESS'

    return (
        <div className="space-y-6 animate-slideIn">
            <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <FiNavigation className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white">Current Trip</h2>
                <p className="text-primary font-bold">
                    {isAccepted ? 'Heading to Pickup' : 'Heading to Destination'}
                </p>
            </div>

            {/* Passenger Info */}
            <div className="bg-dark-bg-tertiary p-4 rounded-xl flex items-center space-x-4 border border-dark-border">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <FiUser className="text-white w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-white">{ride.rider?.name || 'Passenger'}</h3>
                    <div className="flex items-center text-yellow-400 text-sm">
                        <FiStar className="fill-current w-3 h-3 mr-1" />
                        <span>4.9</span>
                    </div>
                </div>
                <div className="flex-1 flex justify-end space-x-2">
                    <button className="p-2 rounded-full bg-success/20 text-success hover:bg-success/30"><FiPhone /></button>
                    <button className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30"><FiMessageSquare /></button>
                </div>
            </div>

            {/* Route Info */}
            <div className="space-y-4">
                <div className={`p-4 rounded-xl border-l-4 ${isAccepted ? 'bg-primary/10 border-primary' : 'bg-dark-bg-tertiary border-gray-600'}`}>
                    <p className="text-xs text-dark-text-secondary uppercase mb-1">Pickup</p>
                    <p className="font-bold text-white text-lg">{ride.pickupLocation}</p>
                </div>

                <div className={`p-4 rounded-xl border-l-4 ${isInProgress ? 'bg-error/10 border-error' : 'bg-dark-bg-tertiary border-gray-600'}`}>
                    <p className="text-xs text-dark-text-secondary uppercase mb-1">Dropoff</p>
                    <p className="font-bold text-white text-lg">{ride.destination}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4">
                {isAccepted && (
                    <button
                        onClick={() => updateStatus('IN_PROGRESS')}
                        disabled={updating}
                        className="w-full py-4 btn-primary font-bold text-lg shadow-lg shadow-primary/20"
                    >
                        {updating ? 'Updating...' : 'Start Trip ▶'}
                    </button>
                )}

                {isInProgress && (
                    <button
                        onClick={() => updateStatus('COMPLETED')}
                        disabled={updating}
                        className="w-full py-4 bg-success text-white rounded-xl font-bold text-lg hover:bg-success/90 shadow-lg shadow-success/20"
                    >
                        {updating ? 'Finishing...' : 'Complete Trip ✅'}
                    </button>
                )}
            </div>
        </div>
    )
}

function RideRequestView({ ride, onAccept, onDecline, processing }: any) {
    return (
        <div className="space-y-8 animate-slideIn">
            <div className="text-center relative">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mb-4 shadow-lg shadow-primary/30 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
                    <span className="text-3xl font-bold text-white relative z-10">New</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Ride Request</h2>
                <p className="text-primary font-medium animate-pulse">Accept now!</p>
            </div>

            <div className="card-glass p-0 overflow-hidden border border-dark-border/60">
                <div className="p-5 space-y-6">
                    <div className="relative pl-8 border-l-2 border-dark-border/50 ml-2">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-success border-2 border-dark-bg-secondary shadow-lg shadow-success/20"></div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-dark-text-secondary uppercase tracking-wider">Pickup</p>
                            <p className="font-bold text-white text-lg">{ride.pickupLocation}</p>
                        </div>
                    </div>
                    <div className="relative pl-8 border-l-2 border-dark-border/50 ml-2">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-error border-2 border-dark-bg-secondary shadow-lg shadow-error/20"></div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-dark-text-secondary uppercase tracking-wider">Destination</p>
                            <p className="font-bold text-white text-lg">{ride.destination}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-dark-bg-tertiary/50 p-4 grid grid-cols-2 gap-4 border-t border-dark-border/50">
                    <div className="text-center border-r border-dark-border/50">
                        <p className="text-xs text-dark-text-secondary mb-1">Est. Fare</p>
                        <p className="text-2xl font-bold gradient-text">{formatCurrency(ride.estimatedFare)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-dark-text-secondary mb-1">Distance</p>
                        <p className="text-xl font-bold text-white">{(ride.distance || 0).toFixed(1)} km</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <button
                    onClick={() => onAccept(ride.id)}
                    disabled={processing}
                    className="btn-success w-full py-4 text-lg font-bold shadow-lg shadow-success/20 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? 'Accepting...' : 'Accept Ride'}
                </button>
                <button
                    onClick={() => onDecline(ride.id)}
                    className="w-full py-4 text-error font-semibold hover:bg-error/10 rounded-xl transition-colors border border-transparent hover:border-error/20"
                >
                    Decline Request
                </button>
            </div>
        </div>
    )
}

function ScannerView() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn">
            <div className="w-24 h-24 rounded-full bg-dark-bg-tertiary flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping-slow"></div>
                <span className="text-5xl animate-bounce-slow">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Finding Rides...</h3>
            <p className="text-dark-text-secondary max-w-xs">
                We're scanning for passengers nearby. You'll be notified instantly.
            </p>
        </div>
    )
}

function StatCard({ icon, label, value, gradient }: { icon: React.ReactNode, label: string, value: string | number, gradient: string }) {
    return (
        <div className="card-glass group hover:bg-dark-bg-tertiary transition-colors">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <p className="text-sm font-medium text-dark-text-secondary mb-1">{label}</p>
            <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
    )
}
