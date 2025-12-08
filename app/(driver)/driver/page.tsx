'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { FiCheckCircle, FiStar, FiClock, FiMapPin, FiNavigation, FiPhone, FiMessageSquare, FiUser, FiUsers } from 'react-icons/fi'
import { formatCurrency } from '@/lib/utils'
import { VEHICLE_TYPES } from '@/lib/constants'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const STATS = {
    acceptanceRate: 92,
    driverRating: 4.85,
    tripsThisWeek: 56,
}

export default function DriverDashboard() {
    const { data: session } = useSession()

    // 1. Fetch ALL active rides (passengers) for this driver
    const { data: activeData, mutate: mutateActive } = useSWR('/api/rides?type=active', fetcher)
    const activePassengers = activeData?.rides || []

    // 2. Fetch available rides
    const { data: availableData, mutate: mutateAvailable } = useSWR('/api/rides?type=available', fetcher, {
        refreshInterval: 5000
    })
    const availableRides = availableData?.rides || []

    const [processingId, setProcessingId] = useState<string | null>(null)

    // Calculate Capacity
    // Default to 4 seater if not found (should come from profile)
    const vehicleCapacity = VEHICLE_TYPES.FOUR_SEATER.capacity
    const seatsOccupied = activePassengers.length
    const seatsAvailable = vehicleCapacity - seatsOccupied

    const handleAccept = async (rideId: string) => {
        if (seatsAvailable <= 0) {
            alert('Vehicle is full!')
            return
        }

        setProcessingId(rideId)
        try {
            const res = await fetch(`/api/rides/${rideId}/accept`, { method: 'POST' })
            const result = await res.json()

            if (!res.ok) throw new Error(result.error || 'Failed to accept ride')

            alert('Passenger added to trip manifest! 📝')
            mutateActive()
            mutateAvailable()
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error accepting ride')
        } finally {
            setProcessingId(null)
        }
    }

    // Only render dashboard if we have session
    if (!session) return null

    // Group available rides by Schedule
    const scheduledGroups = availableRides.reduce((groups: any, ride: any) => {
        const time = ride.departureTime || 'Immediate'
        if (!groups[time]) groups[time] = []
        groups[time].push(ride)
        return groups
    }, {})

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="bg-dark-bg-secondary/50 backdrop-blur-md border-b border-dark-border/50 p-6 z-10">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
                    <div className="flex items-center space-x-2 bg-dark-bg-tertiary px-4 py-2 rounded-full border border-dark-border">
                        <FiUsers className={seatsAvailable > 0 ? 'text-success' : 'text-error'} />
                        <span className="font-bold text-white">{seatsOccupied}/{vehicleCapacity} Seats Used</span>
                    </div>
                </div>

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
                        label="Passengers Today"
                        value={activePassengers.length + 12} // Mock total
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
                                <span className="relative z-10">{activePassengers.length > 0 ? '🚌' : '🗺️'}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {activePassengers.length > 0 ? 'Active Trip Manifest' : 'Waiting for Schedule'}
                            </h2>
                            <p className="text-lg text-gray-400 max-w-md mx-auto">
                                {activePassengers.length > 0
                                    ? `Carrying ${activePassengers.length} passengers.`
                                    : 'Select a schedule from the list to start filling your vehicle.'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Dynamic View */}
                <div className="bg-dark-bg-secondary/90 backdrop-blur-xl border-l border-dark-border/50 p-6 overflow-y-auto relative z-20 shadow-2xl">
                    {activePassengers.length > 0 && (
                        <div className="mb-8 border-b border-dark-border/50 pb-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                <FiNavigation className="mr-2 text-primary" /> Active Passengers
                            </h2>
                            <div className="space-y-3">
                                {activePassengers.map((p: any) => (
                                    <PassengerCard
                                        key={p.id}
                                        passenger={p}
                                        onUpdate={() => { mutateActive(); mutateAvailable(); }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                            <FiClock className="mr-2 text-warning" /> Scheduled Requests
                        </h2>

                        {Object.keys(scheduledGroups).length === 0 ? (
                            <div className="text-center py-10 text-dark-text-secondary border border-dashed border-dark-border rounded-xl">
                                No pending requests at the moment.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(scheduledGroups).map(([time, rides]: [string, any]) => (
                                    <div key={time} className="space-y-3">
                                        <div className="flex items-center space-x-2 text-sm font-bold text-primary uppercase tracking-wider">
                                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                                            <span>Departure: {time}</span>
                                        </div>
                                        {rides.map((ride: any) => (
                                            <RequestCard
                                                key={ride.id}
                                                ride={ride}
                                                onAccept={handleAccept}
                                                processing={processingId === ride.id}
                                                disabled={seatsAvailable <= 0}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- Sub Components ---

function PassengerCard({ passenger, onUpdate }: { passenger: any, onUpdate: () => void }) {
    const [updating, setUpdating] = useState(false)

    const updateStatus = async (status: string) => {
        if (!confirm(`Mark ${passenger.rider.name} as ${status}?`)) return
        setUpdating(true)
        try {
            await fetch(`/api/rides/${passenger.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            onUpdate()
        } catch (e) { alert('Error updating') }
        finally { setUpdating(false) }
    }

    const isPickedUp = passenger.status === 'IN_PROGRESS'

    return (
        <div className="bg-dark-bg-tertiary p-3 rounded-xl border border-dark-border flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <FiUser className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                    <p className="font-bold text-white text-sm truncate">{passenger.rider.name}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${isPickedUp ? 'bg-primary/20 text-primary' : 'bg-warning/20 text-warning'}`}>
                        {passenger.status}
                    </span>
                </div>
                <p className="text-xs text-dark-text-secondary truncate">{passenger.destination}</p>
            </div>
            {passenger.status !== 'COMPLETED' && (
                <button
                    onClick={() => updateStatus(isPickedUp ? 'COMPLETED' : 'IN_PROGRESS')}
                    disabled={updating}
                    className={`p-2 rounded-lg text-xs font-bold ${isPickedUp ? 'bg-success/20 text-success hover:bg-success/30' : 'bg-primary/20 text-primary hover:bg-primary/30'}`}
                >
                    {isPickedUp ? 'Drop' : 'Pick'}
                </button>
            )}
        </div>
    )
}

function RequestCard({ ride, onAccept, processing, disabled }: any) {
    return (
        <div className="card-glass p-4 border border-dark-border/60 hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-dark-text-secondary uppercase">From</span>
                        <span className="font-bold text-white">{ride.pickupLocation}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-dark-text-secondary uppercase">To</span>
                        <span className="font-bold text-white">{ride.destination}</span>
                    </div>
                </div>
                <p className="font-bold gradient-text">{formatCurrency(ride.estimatedFare)}</p>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="bg-gray-700 p-1 rounded">
                        <FiUser className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-300">{ride.rider.name}</span>
                </div>
                <button
                    onClick={() => onAccept(ride.id)}
                    disabled={processing || disabled}
                    className="btn-primary py-1.5 px-4 text-xs font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? '...' : disabled ? 'Full Details' : 'Accept'}
                </button>
            </div>
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
