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
            {/* Header with Glassmorphism */}
            <div className="bg-dark-bg-secondary/50 backdrop-blur-md border-b border-dark-border/50 p-6 z-10">
                <h1 className="text-3xl font-bold mb-6 gradient-text">Dashboard</h1>

                {/* Stats Grid */}
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
                {/* Map Area (Left - 2 columns) */}
                <div className="lg:col-span-2 bg-dark-bg-tertiary relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('/map-dark.png')] bg-cover bg-center opacity-50 transition-opacity group-hover:opacity-60"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-dark-text-secondary animate-pulse-glow">
                            <div className="text-8xl mb-6 relative">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
                                <span className="relative z-10">🗺️</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Live Map</h2>
                            <p className="text-lg text-gray-400 max-w-md mx-auto">
                                Searching for high demand areas near you...
                            </p>
                        </div>
                    </div>

                    {/* Online Status Float */}
                    <div className="absolute top-6 left-6 flex items-center space-x-2 bg-dark-bg/80 backdrop-blur-md px-4 py-2 rounded-full border border-success/30 shadow-lg shadow-success/10">
                        <span className="w-2.5 h-2.5 bg-success rounded-full animate-pulse"></span>
                        <span className="font-semibold text-success text-sm">You are Online</span>
                    </div>
                </div>

                {/* Sidebar - Ride Request (Right - 1 column) */}
                <div className="bg-dark-bg-secondary/90 backdrop-blur-xl border-l border-dark-border/50 p-6 overflow-y-auto relative z-20 shadow-2xl">
                    {hasNewRequest ? (
                        <div className="space-y-8 animate-slideIn">
                            {/* Timer with Warning Gradient */}
                            <div className="text-center relative">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mb-4 shadow-lg shadow-primary/30 relative">
                                    <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
                                    <span className="text-3xl font-bold text-white relative z-10">00:{timeLeft.toString().padStart(2, '0')}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white">New Ride Request</h2>
                                <p className="text-primary font-medium animate-pulse">Expires soon!</p>
                            </div>

                            {/* Ride Details Card */}
                            <div className="card-glass p-0 overflow-hidden border border-dark-border/60">
                                <div className="p-5 space-y-6">
                                    {/* Pickup */}
                                    <div className="relative pl-8 border-l-2 border-dark-border/50 ml-2">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-success border-2 border-dark-bg-secondary shadow-lg shadow-success/20"></div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-dark-text-secondary uppercase tracking-wider">Pickup</p>
                                            <p className="font-bold text-white text-lg">123 Main St, Jos</p>
                                            <p className="text-sm text-gray-400">Near Terminus Market</p>
                                        </div>
                                    </div>

                                    {/* Destination */}
                                    <div className="relative pl-8 border-l-2 border-dark-border/50 ml-2">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-error border-2 border-dark-bg-secondary shadow-lg shadow-error/20"></div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-dark-text-secondary uppercase tracking-wider">Destination</p>
                                            <p className="font-bold text-white text-lg">456 Central Ave, Jos</p>
                                            <p className="text-sm text-gray-400">Hill Station Hotel</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Trip Info Footer */}
                                <div className="bg-dark-bg-tertiary/50 p-4 grid grid-cols-2 gap-4 border-t border-dark-border/50">
                                    <div className="text-center border-r border-dark-border/50">
                                        <p className="text-xs text-dark-text-secondary mb-1">Est. Fare</p>
                                        <p className="text-2xl font-bold gradient-text">{formatCurrency(1500)}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-dark-text-secondary mb-1">Distance</p>
                                        <p className="text-xl font-bold text-white">5.2 km</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                <button
                                    onClick={() => setHasNewRequest(false)}
                                    className="btn-success w-full py-4 text-lg font-bold shadow-lg shadow-success/20 hover:scale-[1.02] transition-transform"
                                >
                                    Accept Ride
                                </button>
                                <button
                                    onClick={() => setHasNewRequest(false)}
                                    className="w-full py-4 text-error font-semibold hover:bg-error/10 rounded-xl transition-colors border border-transparent hover:border-error/20"
                                >
                                    Decline Request
                                </button>
                            </div>
                        </div>
                    ) : (
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
    gradient,
}: {
    icon: React.ReactNode
    label: string
    value: string | number
    gradient: string
}) {
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
