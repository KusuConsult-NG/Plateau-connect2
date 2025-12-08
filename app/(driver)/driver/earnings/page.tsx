'use client'

import { useState, useEffect } from 'react'
import { FiDollarSign, FiTrendingUp, FiDownload, FiMapPin, FiClock } from 'react-icons/fi'
import { formatCurrency } from '@/lib/utils'

interface Ride {
    id: string
    riderName: string
    pickup: string
    destination: string
    distance: number
    fare: number
    rideType: string
    completedAt: string
    paymentStatus: string
    paymentMethod: string
}

interface EarningsData {
    summary: {
        totalEarnings: number
        totalTrips: number
        todayEarnings: number
        todayTrips: number
        averagePerTrip: number
    }
    weeklyBreakdown: Array<{
        day: string
        earnings: number
        trips: number
    }>
    rides: Ride[]
}

export default function EarningsPage() {
    const [period, setPeriod] = useState('week')
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<EarningsData | null>(null)

    useEffect(() => {
        const fetchEarnings = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/driver/earnings?period=${period}`)
                if (response.ok) {
                    const earnings = await response.json()
                    setData(earnings)
                }
            } catch (error) {
                console.error('Failed to fetch earnings:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchEarnings()
    }, [period])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    const summary = data?.summary || {
        totalEarnings: 0,
        totalTrips: 0,
        todayEarnings: 0,
        todayTrips: 0,
        averagePerTrip: 0,
    }

    const maxEarnings = Math.max(...(data?.weeklyBreakdown.map((d) => d.earnings) || [1]))

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8 animate-slideUp">
                <div>
                    <h1 className="text-3xl font-bold mb-2 gradient-text">Earnings</h1>
                    <p className="text-dark-text-secondary">Track your revenue and financial performance.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="px-4 py-2 rounded-xl bg-dark-bg-tertiary border border-dark-border text-sm font-semibold"
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="all">All Time</option>
                    </select>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-dark-bg-tertiary border border-dark-border text-sm font-semibold hover:text-white transition-colors">
                        <FiDownload />
                        <span>Download</span>
                    </button>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slideIn">
                <div className="card-gradient p-6 rounded-2xl text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FiDollarSign className="w-24 h-24 transform -rotate-12" />
                    </div>
                    <p className="text-blue-100 font-medium mb-1">Total Earnings</p>
                    <h2 className="text-4xl font-bold">{formatCurrency(summary.totalEarnings)}</h2>
                    <div className="mt-4 flex items-center text-sm bg-white/20 w-fit px-2 py-1 rounded-lg backdrop-blur-md">
                        <FiTrendingUp className="mr-1" />
                        <span>{summary.totalTrips} trips</span>
                    </div>
                </div>

                <div className="card-glass p-6 rounded-2xl flex flex-col justify-center">
                    <p className="text-dark-text-secondary font-medium mb-1">Today's Earnings</p>
                    <h2 className="text-3xl font-bold text-white mb-2">{formatCurrency(summary.todayEarnings)}</h2>
                    <p className="text-xs text-success font-semibold">{summary.todayTrips} Trips Completed</p>
                </div>

                <div className="card-glass p-6 rounded-2xl flex flex-col justify-center">
                    <p className="text-dark-text-secondary font-medium mb-1">Average Per Trip</p>
                    <h2 className="text-3xl font-bold text-white mb-2">{formatCurrency(summary.averagePerTrip)}</h2>
                    <p className="text-xs text-dark-text-secondary">Across {summary.totalTrips} trips</p>
                </div>
            </div>

            {/* Weekly Breakdown Chart */}
            {data?.weeklyBreakdown && data.weeklyBreakdown.length > 0 && (
                <div className="card-glass p-6 mb-8 animate-slideIn" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-lg font-bold text-white mb-6">Weekly Breakdown</h3>
                    <div className="flex items-end justify-between h-48 gap-2">
                        {data.weeklyBreakdown.map((day) => (
                            <div key={day.day} className="flex flex-col items-center flex-1 group">
                                <div
                                    className="w-full max-w-[40px] bg-dark-bg-tertiary rounded-t-lg relative overflow-hidden transition-all duration-300 hover:bg-primary/50 group cursor-pointer"
                                    style={{ height: `${(day.earnings / maxEarnings) * 100}%` }}
                                    title={`${formatCurrency(day.earnings)} (${day.trips} trips)`}
                                >
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary to-secondary opacity-80 h-full"></div>
                                </div>
                                <span className="text-xs text-dark-text-secondary mt-2 font-medium">{day.day}</span>
                                <span className="text-xs text-success mt-1">{formatCurrency(day.earnings)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Individual Rides/Income Streams */}
            <div className="card-glass p-0 overflow-hidden animate-slideIn" style={{ animationDelay: '0.2s' }}>
                <div className="p-6 border-b border-dark-border/50">
                    <h3 className="text-lg font-bold text-white">Income Streams</h3>
                    <p className="text-sm text-dark-text-secondary">Detailed breakdown of each trip</p>
                </div>

                {data?.rides && data.rides.length > 0 ? (
                    <div className="divide-y divide-dark-border/30">
                        {data.rides.map((ride) => (
                            <div
                                key={ride.id}
                                className="p-6 hover:bg-dark-bg-tertiary/30 transition-colors group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded">
                                                {ride.rideType}
                                            </span>
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded ${ride.paymentStatus === 'COMPLETED'
                                                        ? 'bg-success/20 text-success'
                                                        : 'bg-warning/20 text-warning'
                                                    }`}
                                            >
                                                {ride.paymentStatus}
                                            </span>
                                        </div>
                                        <p className="text-white font-medium mb-1">Ride with {ride.riderName}</p>
                                        <div className="space-y-1 text-sm text-dark-text-secondary">
                                            <div className="flex items-center space-x-2">
                                                <FiMapPin className="w-4 h-4" />
                                                <span>{ride.pickup}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 ml-6">
                                                <span>→ {ride.destination}</span>
                                            </div>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <span>{ride.distance.toFixed(1)} km</span>
                                                <span>•</span>
                                                <div className="flex items-center space-x-1">
                                                    <FiClock className="w-3 h-3" />
                                                    <span>
                                                        {new Date(ride.completedAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-success">
                                            +{formatCurrency(ride.fare)}
                                        </p>
                                        <p className="text-xs text-dark-text-secondary mt-1">{ride.paymentMethod}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <FiDollarSign className="w-12 h-12 mx-auto text-dark-text-secondary mb-4" />
                        <p className="text-dark-text-secondary">No completed trips yet</p>
                        <p className="text-sm text-dark-text-secondary mt-2">
                            Your earnings will appear here after completing rides
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
