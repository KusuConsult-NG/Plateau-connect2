'use client'

import { useEffect, useState } from 'react'
import { FiUsers, FiTruck, FiActivity, FiDollarSign, FiSearch, FiBell } from 'react-icons/fi'
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
        },
        {
            id: '2',
            rideId: '#RIDE-0122',
            rider: 'Jane Smith',
            driver: 'Musa Aliyu',
            destination: 'Terminus Market',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
        },
        {
            id: '3',
            rideId: '#RIDE-0121',
            rider: 'Bulus Mark',
            driver: 'Grace Audu',
            destination: 'University of Jos',
            status: 'COMPLETED',
            createdAt: new Date().toISOString(),
        },
        {
            id: '4',
            rideId: '#RIDE-0120',
            rider: 'Amina Bello',
            driver: 'David King',
            destination: 'Yakubu Gowon Airport',
            status: 'CANCELLED',
            createdAt: new Date().toISOString(),
        },
    ])

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                        <p className="text-dark-text-secondary">
                            Welcome back, Admin! Here's what's happening today.
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search"
                                className="input-field pl-10 w-64"
                            />
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-secondary" />
                        </div>
                        <button className="p-2 hover:bg-dark-bg-tertiary rounded-lg transition-colors relative">
                            <FiBell className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Total Users"
                    value={metrics.totalUsers.toLocaleString()}
                    growth={metrics.userGrowth}
                    icon={<FiUsers className="w-6 h-6" />}
                />
                <MetricCard
                    title="Active Rides"
                    value={metrics.activeRides.toString()}
                    growth={metrics.ridesGrowth}
                    icon={<FiTruck className="w-6 h-6" />}
                    iconBg="bg-blue-500/10"
                    iconColor="text-blue-500"
                />
                <MetricCard
                    title="Trips Today"
                    value={metrics.tripsToday.toString()}
                    growth={metrics.tripsGrowth}
                    icon={<FiActivity className="w-6 h-6" />}
                    iconBg="bg-green-500/10"
                    iconColor="text-green-500"
                />
                <MetricCard
                    title="Total Revenue"
                    value={formatCurrency(metrics.totalRevenue)}
                    growth={metrics.revenueGrowth}
                    icon={<FiDollarSign className="w-6 h-6" />}
                    iconBg="bg-yellow-500/10"
                    iconColor="text-yellow-500"
                />
            </div>

            {/* Recent Ride Requests */}
            <div className="card">
                <h2 className="text-xl font-bold mb-6">Recent Ride Requests</h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-border text-left">
                                <th className="pb-3 font-medium text-dark-text-secondary">Ride ID</th>
                                <th className="pb-3 font-medium text-dark-text-secondary">Rider</th>
                                <th className="pb-3 font-medium text-dark-text-secondary">Driver</th>
                                <th className="pb-3 font-medium text-dark-text-secondary">Destination</th>
                                <th className="pb-3 font-medium text-dark-text-secondary">Status</th>
                                <th className="pb-3 font-medium text-dark-text-secondary">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rides.map((ride) => (
                                <tr key={ride.id} className="border-b border-dark-border last:border-0">
                                    <td className="py-4 font-medium">{ride.rideId}</td>
                                    <td className="py-4">{ride.rider}</td>
                                    <td className="py-4">
                                        {ride.driver || (
                                            <span className="text-dark-text-secondary">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="py-4">{ride.destination}</td>
                                    <td className="py-4">
                                        <StatusBadge status={ride.status} />
                                    </td>
                                    <td className="py-4">
                                        {ride.status === 'PENDING' ? (
                                            <button className="btn-primary py-1.5 px-4 text-sm">
                                                Assign Driver
                                            </button>
                                        ) : (
                                            <button className="btn-secondary py-1.5 px-4 text-sm">
                                                View Details
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
    iconBg = 'bg-primary/10',
    iconColor = 'text-primary',
}: {
    title: string
    value: string
    growth: number
    icon: React.ReactNode
    iconBg?: string
    iconColor?: string
}) {
    const isPositive = growth > 0

    return (
        <div className="card">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${iconBg} ${iconColor}`}>
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-dark-text-secondary text-sm mb-1">{title}</p>
                <p className="text-3xl font-bold mb-2">{value}</p>
                <div className="flex items-center space-x-1">
                    <span className={isPositive ? 'text-success' : 'text-error'}>
                        {isPositive ? '↑' : '↓'} {Math.abs(growth)}%
                    </span>
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const badges: Record<string, string> = {
        PENDING: 'badge-pending',
        IN_PROGRESS: 'badge-in-progress',
        COMPLETED: 'badge-completed',
        CANCELLED: 'badge-cancelled',
        ACCEPTED: 'badge-accepted',
    }

    const labels: Record<string, string> = {
        PENDING: 'Pending',
        IN_PROGRESS: 'In Progress',
        COMPLETED: 'Completed',
        CANCELLED: 'Cancelled',
        ACCEPTED: 'Accepted',
    }

    return (
        <span className={badges[status] || 'badge-pending'}>
            {labels[status] || status}
        </span>
    )
}
