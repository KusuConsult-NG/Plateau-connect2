'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { FiGrid, FiDollarSign, FiClock, FiSettings, FiHelpCircle } from 'react-icons/fi'

const navigation = [
    { name: 'Dashboard', href: '/driver', icon: FiGrid },
    { name: 'Earnings', href: '/driver/earnings', icon: FiDollarSign },
    { name: 'Ride History', href: '/driver/history', icon: FiClock },
]

export default function DriverLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-dark-bg flex">
            {/* Sidebar */}
            <aside className="w-64 bg-dark-bg-secondary border-r border-dark-border flex flex-col">
                {/* Brand & Profile */}
                <div className="p-6 border-b border-dark-border">
                    <Link href="/driver" className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl">🚗</span>
                        <span className="text-xl font-bold">JosRide</span>
                    </Link>

                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">JD</span>
                        </div>
                        <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-xs text-success">Online</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary text-white'
                                        : 'text-dark-text-secondary hover:bg-dark-bg-tertiary hover:text-white'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-dark-border space-y-2">
                    <Link
                        href="/driver/settings"
                        className="flex items-center space-x-3 px-4 py-2 text-dark-text-secondary hover:text-white hover:bg-dark-bg-tertiary rounded-lg transition-colors"
                    >
                        <FiSettings className="w-5 h-5" />
                        <span>Settings</span>
                    </Link>
                    <Link
                        href="/driver/help"
                        className="flex items-center space-x-3 px-4 py-2 text-dark-text-secondary hover:text-white hover:bg-dark-bg-tertiary rounded-lg transition-colors"
                    >
                        <FiHelpCircle className="w-5 h-5" />
                        <span>Help</span>
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="btn-danger w-full"
                    >
                        Go Offline
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    )
}
