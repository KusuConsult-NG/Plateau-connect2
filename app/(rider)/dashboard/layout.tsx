'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { FiGrid, FiClock, FiHelpCircle, FiSettings, FiLogOut } from 'react-icons/fi'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiGrid },
    { name: 'Ride History', href: '/dashboard/history', icon: FiClock },
    { name: 'Support', href: '/dashboard/support', icon: FiHelpCircle },
]

export default function RiderLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Top Navigation */}
            <nav className="bg-dark-bg-secondary border-b border-dark-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Brand */}
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <span className="text-2xl">🚗</span>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">
                                PlateauRide
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${isActive
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-dark-text-secondary hover:text-white hover:bg-dark-bg-tertiary'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium">DV</span>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium">David O.</p>
                                    <p className="text-xs text-dark-text-secondary">Rider</p>
                                </div>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="p-2 hover:bg-dark-bg-tertiary rounded-lg transition-colors"
                                title="Logout"
                            >
                                <FiLogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>{children}</main>
        </div>
    )
}
