'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { FiGrid, FiClock, FiHelpCircle, FiSettings, FiLogOut, FiCreditCard, FiMapPin } from 'react-icons/fi'

export const dynamic = 'force-dynamic'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiGrid },
    { name: 'Ride History', href: '/dashboard/trips', icon: FiClock },
    { name: 'Wallet', href: '/wallet', icon: FiCreditCard },
    { name: 'Saved Places', href: '/saved-places', icon: FiMapPin },
    { name: 'Support', href: '/support', icon: FiHelpCircle },
    { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
]

export default function RiderLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { data: session } = useSession()

    // Get user initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="min-h-screen">
            {/* Top Navigation with Glassmorphism */}
            <nav className="glass-heavy sticky top-0 z-50 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Brand with Gradient */}
                        <Link href="/dashboard" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                                <FiMapPin className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold gradient-text group-hover:scale-105 transition-transform">
                                Plateau Connect
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-2">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${isActive
                                            ? 'bg-gradient-primary text-white shadow-purple'
                                            : 'text-dark-text-secondary hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* User Menu with Gradient Border */}
                        <div className="flex items-center space-x-4">
                            {session?.user && (
                                <div className="flex items-center space-x-3 group">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-primary rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                        <div className="relative w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center ring-2 ring-white/20 group-hover:ring-white/40 transition-all">
                                            <span className="text-sm font-bold text-white">
                                                {getInitials(session.user.name || 'User')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-semibold text-white">
                                            {session.user.name}
                                        </p>
                                        <p className="text-xs text-dark-text-secondary">
                                            {session.user.role || 'Rider'}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 text-dark-text-secondary hover:text-error group"
                                title="Logout"
                            >
                                <FiLogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation with Gradient Indicators */}
            <div className="md:hidden glass-heavy border-b border-white/10 sticky top-16 z-40">
                <div className="flex overflow-x-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center space-y-1.5 px-6 py-3 min-w-fit transition-all duration-300 ${isActive
                                    ? 'text-white border-b-2 border-primary'
                                    : 'text-dark-text-secondary hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'animate-pulse-glow' : ''}`} />
                                <span className="text-xs font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Main Content */}
            <main className="animate-fadeIn">{children}</main>
        </div>
    )
}
