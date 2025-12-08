'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { FiGrid, FiDollarSign, FiClock, FiSettings, FiHelpCircle, FiMapPin } from 'react-icons/fi'

const navigation = [
    { name: 'Dashboard', href: '/driver', icon: FiGrid },
    { name: 'Earnings', href: '/driver/earnings', icon: FiDollarSign },
    { name: 'Ride History', href: '/driver/history', icon: FiClock },
]

export default function DriverLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { data: session } = useSession()

    // Get user initials from name
    const getInitials = (name: string | undefined | null) => {
        if (!name) return 'DR'
        const parts = name.split(' ')
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        }
        return name.substring(0, 2).toUpperCase()
    }

    return (
        <div className="min-h-screen bg-dark-bg flex">
            {/* Sidebar with Glassmorphism */}
            <aside className="w-72 bg-dark-bg-secondary/50 backdrop-blur-xl border-r border-dark-border flex flex-col relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none"></div>

                {/* Brand & Profile */}
                <div className="p-6 border-b border-dark-border/50 relative z-10">
                    <Link href="/driver" className="flex items-center space-x-3 mb-8 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                            <FiMapPin className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">Plateau Connect</span>
                    </Link>

                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-dark-bg-tertiary/50 border border-dark-border hover:border-primary/30 transition-colors">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                                <span className="text-sm font-bold text-white">{getInitials(session?.user?.name)}</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-dark-bg-tertiary"></div>
                        </div>
                        <div>
                            <p className="font-bold text-white">{session?.user?.name || 'Driver'}</p>
                            <div className="flex items-center space-x-1.5">
                                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                                <p className="text-xs text-success font-medium">Online</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1.5 relative z-10">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25'
                                    : 'text-dark-text-secondary hover:bg-dark-bg-tertiary hover:text-white hover:pl-5'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-primary transition-colors'}`} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-dark-border/50 space-y-2 relative z-10">
                    <Link
                        href="/driver/settings"
                        className="flex items-center space-x-3 px-4 py-3 text-dark-text-secondary hover:text-white hover:bg-dark-bg-tertiary rounded-xl transition-colors"
                    >
                        <FiSettings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </Link>
                    <Link
                        href="/driver/help"
                        className="flex items-center space-x-3 px-4 py-3 text-dark-text-secondary hover:text-white hover:bg-dark-bg-tertiary rounded-xl transition-colors"
                    >
                        <FiHelpCircle className="w-5 h-5" />
                        <span className="font-medium">Help</span>
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full mt-4 py-3 rounded-xl border border-error/30 text-error hover:bg-error hover:text-white transition-all duration-300 font-medium flex items-center justify-center space-x-2"
                    >
                        <span>Go Offline</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-dark-bg to-dark-bg">
                {children}
            </main>
        </div>
    )
}
