'use client'

import { useEffect, useState } from 'react'
import { FiUsers, FiTruck, FiActivity, FiDollarSign, FiSearch, FiBell, FiMoreVertical } from 'react-icons/fi'
import { formatCurrency } from '@/lib/utils'

interface Metrics {
    totalUsers: number
    userGrowth: number
    activeRides: number
    ridesGrowth: number
    tripsToday: number
    tripsGrowth: number
    totalRevenue: number
    revenueGrowth: number
}

interface RideRequest {
    id: string
    rideId: string
    rider: string
    driver: string | null
    destination: string
    status: string
    createdAt: string
    amount: number
}

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState<Metrics>({
        totalUsers: 1250,
        userGrowth: 1.5,
        activeRides: 15,
        ridesGrowth: 5,
        tripsToday: 230,
        tripsGrowth: 2.1,
        totalRevenue: 85500,
        revenueGrowth: -0.5,
    })

    const [rides, setRides] = useState<RideRequest[]>([
        {
            id: '1',
            rideId: '#RIDE-0123',
            rider: 'John Doe',
            driver: null,
            destination: 'Rayfield, Jos',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            amount: 1500,
        },
        {
            id: '2',
            rideId: '#RIDE-0122',
            rider: 'Jane Smith',
            driver: 'Musa Aliyu',
            destination: 'Terminus Market',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
            amount: 800,
        },
        {
            id: '3',
            rideId: '#RIDE-0121',
            rider: 'Bulus Mark',
            driver: 'Grace Audu',
            destination: 'University of Jos',
            status: 'COMPLETED',
            createdAt: new Date().toISOString(),
            amount: 1200,
        },
        {
            id: '4',
            rideId: '#RIDE-0120',
            rider: 'Amina Bello',
            driver: 'David King',
            destination: 'Yakubu Gowon Airport',
            status: 'CANCELLED',
            createdAt: new Date().toISOString(),
            amount: 5000,
        },
    ])

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header with Gradient */}
            <div className="mb-10 animate-slideUp">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            Dashboard <span className="gradient-text">Overview</span>
                        </h1>
                        <p className="text-dark-text-secondary text-lg">
                            Welcome back, Admin! Here's what's happening today.
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="input-field pl-10 w-full md:w-80 group-hover:border-primary/50 transition-colors"
                            />
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-secondary group-hover:text-primary transition-colors" />
                        </div>
                        <button className="p-3 bg-dark-bg-tertiary hover:bg-dark-bg-tertiary/80 rounded-xl transition-all relative group border border-dark-border hover:border-primary/30">
                            <FiBell className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-dark-bg-tertiary animate-pulse"></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <MetricCard
                    title="Total Users"
                    value={metrics.totalUsers.toLocaleString()}
                    growth={metrics.userGrowth}
                    icon={<FiUsers className="w-6 h-6 text-white" />}
                    gradient="from-blue-500 to-cyan-500"
                    delay="0s"
                />
                <MetricCard
                    title="Active Rides"
                    value={metrics.activeRides.toString()}
                    growth={metrics.ridesGrowth}
                    icon={<FiTruck className="w-6 h-6 text-white" />}
                    gradient="from-purple-500 to-pink-500"
                    delay="0.1s"
                />
                <MetricCard
                    title="Trips Today"
                    value={metrics.tripsToday.toString()}
                    growth={metrics.tripsGrowth}
                    icon={<FiActivity className="w-6 h-6 text-white" />}
                    gradient="from-orange-500 to-red-500"
                    delay="0.2s"
                />
                <MetricCard
                    title="Total Revenue"
                    value={formatCurrency(metrics.totalRevenue)}
                    growth={metrics.revenueGrowth}
                    icon={<FiDollarSign className="w-6 h-6 text-white" />}
                    gradient="from-green-500 to-emerald-500"
                    delay="0.3s"
                />
            </div>

            {/* Recent Ride Requests Table */}
            <div className="card-glass animate-slideIn" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold">Recent Ride Requests</h2>
                    <button className="text-sm gradient-text font-semibold hover:opacity-80 transition-opacity">
                        View All Requests
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-border/50 text-left">
                                <th className="pb-4 pl-4 font-semibold text-dark-text-secondary uppercase text-xs tracking-wider">Ride ID</th>
                                <th className="pb-4 font-semibold text-dark-text-secondary uppercase text-xs tracking-wider">Rider</th>
                                <th className="pb-4 font-semibold text-dark-text-secondary uppercase text-xs tracking-wider">Driver</th>
                                <th className="pb-4 font-semibold text-dark-text-secondary uppercase text-xs tracking-wider">Destination</th>
                                <th className="pb-4 font-semibold text-dark-text-secondary uppercase text-xs tracking-wider">Amount</th>
                                <th className="pb-4 font-semibold text-dark-text-secondary uppercase text-xs tracking-wider">Status</th>
                                <th className="pb-4 pr-4 text-right font-semibold text-dark-text-secondary uppercase text-xs tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border/30">
                            {rides.map((ride) => (
                                <tr key={ride.id} className="group hover:bg-dark-bg-tertiary/20 transition-colors">
                                    <td className="py-4 pl-4 font-medium text-white group-hover:text-primary transition-colors">
                                        {ride.rideId}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold text-white">
                                                {ride.rider.charAt(0)}
                                            </div>
                                            <span className="text-gray-200">{ride.rider}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        {ride.driver ? (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                                                    {ride.driver.charAt(0)}
                                                </div>
                                                <span className="text-gray-200">{ride.driver}</span>
                                            </div>
                                        ) : (
                                            <span className="text-dark-text-secondary italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="py-4 text-gray-300">{ride.destination}</td>
                                    <td className="py-4 font-semibold text-white">
                                        {formatCurrency(ride.amount)}
                                    </td>
                                    <td className="py-4">
                                        <StatusBadge status={ride.status} />
                                    </td>
                                    <td className="py-4 pr-4 text-right">
                                        {ride.status === 'PENDING' ? (
                                            <button className="btn-primary py-1.5 px-4 text-xs font-semibold shadow-lg shadow-blue-500/20">
                                                Assign Driver
                                            </button>
                                        ) : (
                                            <button className="p-2 hover:bg-dark-bg-tertiary rounded-lg text-gray-400 hover:text-white transition-colors">
                                                <FiMoreVertical className="w-5 h-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function MetricCard({
    title,
    value,
    growth,
    icon,
    gradient,
    delay,
}: {
    title: string
    value: string
    growth: number
    icon: React.ReactNode
    gradient: string
    delay: string
}) {
    const isPositive = growth >= 0

    return (
        <div className="card-glass animate-slideIn hover:scale-105 transition-transform duration-300 group" style={{ animationDelay: delay }}>
            <div className="flex items-start justify-between mb-5">
                <div className={`p-3.5 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl transition-shadow`}>
                    {icon}
                </div>
                <div className={`flex items-center space-x-1 text-xs font-bold py-1 px-2 rounded-lg ${isPositive
                        ? 'bg-success/10 text-success border border-success/20'
                        : 'bg-error/10 text-error border border-error/20'
                    }`}>
                    <span>{isPositive ? '↑' : '↓'}</span>
                    <span>{Math.abs(growth)}%</span>
                </div>
            </div>
            <div>
                <p className="text-dark-text-secondary text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    {value}
                </h3>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        IN_PROGRESS: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        COMPLETED: 'bg-success/10 text-success border-success/20',
        CANCELLED: 'bg-error/10 text-error border-error/20',
        ACCEPTED: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    }

    const labels: Record<string, string> = {
        PENDING: 'Pending',
        IN_PROGRESS: 'In Progress',
        COMPLETED: 'Completed',
        CANCELLED: 'Cancelled',
        ACCEPTED: 'Accepted',
    }

    return (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${styles[status] || styles.PENDING} uppercase tracking-wider`}>
            {labels[status] || status}
        </span>
    )
}

