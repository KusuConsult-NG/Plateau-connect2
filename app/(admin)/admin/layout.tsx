'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
    FiGrid,
    FiUsers,
    FiTruck,
    FiDollarSign,
    FiBarChart2,
    FiSettings,
    FiLogOut
} from 'react-icons/fi'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FiGrid },
    { name: 'Users', href: '/admin/users', icon: FiUsers },
    { name: 'Rides', href: '/admin/rides', icon: FiTruck },
    { name: 'Payments', href: '/admin/payments', icon: FiDollarSign },
    { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart2 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex h-screen bg-dark-bg">
            {/* Sidebar */}
            <aside className="w-64 bg-dark-bg-secondary border-r border-dark-border flex flex-col">
                {/* Brand */}
                <div className="p-6 border-b border-dark-border">
                    <Link href="/admin" className="flex items-center space-x-2">
                        <span className="text-2xl">🚗</span>
                        <span className="text-xl font-bold">Ride Hailing</span>
                    </Link>
                    <p className="text-xs text-dark-text-secondary mt-1">Admin Panel</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-primary text-white'
                                        : 'text-dark-text-secondary hover:bg-dark-bg-tertiary hover:text-white'
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-dark-border space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">AD</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">Admin Name</p>
                            <p className="text-xs text-dark-text-secondary">Administrator</p>
                        </div>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center space-x-3 px-4 py-2 text-dark-text-secondary hover:text-white hover:bg-dark-bg-tertiary rounded-lg transition-colors w-full"
                    >
                        <FiLogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ')
}
