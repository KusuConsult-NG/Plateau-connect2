'use client'

import { useState } from 'react'
import { FiCheckCircle, FiStar, FiClock, FiMapPin } from 'react-icons/fi'
import { formatCurrency } from '@/lib/utils'

const STATS = {
    acceptanceRate: 92,
    driverRating: 4.85,
    tripsThisWeek: 56,
}

export default function DriverDashboard() {
    const [hasNewRequest, setHasNewRequest] = useState(true)
    const [timeLeft, setTimeLeft] = useState(25) // seconds

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="bg-dark-bg-secondary border-b border-dark-border p-6">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <StatCard
                        icon={<FiCheckCircle className="w-6 h-6" />}
                        label="Acceptance Rate"
                        value={`${STATS.acceptanceRate}%`}
                        iconBg="bg-blue-500/10"
                        iconColor="text-blue-500"
                    />
                    <StatCard
                        icon={<FiStar className="w-6 h-6" />}
                        label="Driver Rating"
                        value={STATS.driverRating.toFixed(2)}
                        iconBg="bg-yellow-500/10"
                        iconColor="text-yellow-500"
                    />
                    <StatCard
                        icon={<FiClock className="w-6 h-6" />}
                        label="Trips This Week"
                        value={STATS.tripsThisWeek}
                        iconBg="bg-green-500/10"
                        iconColor="text-green-500"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 grid grid-cols-3 gap-0">
                {/* Map Area (Left - 2 columns) */}
                <div className="col-span-2 bg-dark-bg-tertiary relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-dark-text-secondary">
                            <div className="text-6xl mb-4">🗺️</div>
                            <p className="text-lg">Live Map</p>
                            <p className="text-sm">
                                Map integration would show your current location and nearby ride requests
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Ride Request (Right - 1 column) */}
                <div className="bg-dark-bg-secondary border-l border-dark-border p-6 overflow-y-auto">
                    {hasNewRequest ? (
                        <div className="space-y-6">
                            {/* Timer */}
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-3">
                                    <span className="text-3xl font-bold">00:{timeLeft.toString().padStart(2, '0')}</span>
                                </div>
                                <h2 className="text-xl font-bold">New Ride Request</h2>
                            </div>

                            {/* Ride Details */}
                            <div className="card space-y-4">
                                {/* Pickup */}
                                <div className="space-y-2">
                                    <p className="text-sm text-dark-text-secondary">Pickup</p>
                                    <div className="flex items-start space-x-2">
                                        <FiMapPin className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                                        <p className="font-medium">123 Main St, Jos</p>
                                    </div>
                                </div>

                                {/* Destination */}
                                <div className="space-y-2">
                                    <p className="text-sm text-dark-text-secondary">Destination</p>
                                    <div className="flex items-start space-x-2">
                                        <FiMapPin className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                                        <p className="font-medium">456 Central Ave, Jos</p>
                                    </div>
                                </div>

                                {/* Trip Info */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-border">
                                    <div>
                                        <p className="text-sm text-dark-text-secondary mb-1">Est. Fare</p>
                                        <p className="text-xl font-bold text-success">{formatCurrency(1500)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-dark-text-secondary mb-1">Est. Distance</p>
                                        <p className="text-xl font-bold">5.2 km</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => setHasNewRequest(false)}
                                    className="btn-success w-full py-4 text-lg font-semibold"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => setHasNewRequest(false)}
                                    className="btn-danger w-full py-3"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-lg font-bold mb-2">Looking for rides...</h3>
                            <p className="text-sm text-dark-text-secondary">
                                You'll be notified when a new ride request is available
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function StatCard({
    icon,
    label,
    value,
    iconBg,
    iconColor,
}: {
    icon: React.ReactNode
    label: string
    value: string | number
    iconBg: string
    iconColor: string
}) {
    return (
        <div className="card">
            <div className={`w-12 h-12 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <p className="text-sm text-dark-text-secondary mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    )
}
