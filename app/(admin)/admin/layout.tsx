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
            {/* Sidebar with Glassmorphism */}
            <aside className="w-72 bg-dark-bg-secondary/50 backdrop-blur-xl border-r border-dark-border flex flex-col relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none"></div>

                {/* Brand */}
                <div className="p-8 border-b border-dark-border/50 relative z-10">
                    <Link href="/admin" className="flex items-center space-x-3 mb-1 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <div>
                            <span className="text-xl font-bold gradient-text block">Plateau Connect</span>
                            <span className="text-[10px] text-dark-text-secondary font-mono tracking-widest uppercase ml-0.5">Admin Portal</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-6 space-y-1.5 overflow-y-auto relative z-10">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center space-x-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 group',
                                    isActive
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25'
                                        : 'text-dark-text-secondary hover:bg-dark-bg-tertiary hover:text-white hover:pl-5'
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "group-hover:text-primary")} />
                                <span className={cn("font-medium", isActive ? "text-white" : "")}>{item.name}</span>
                                {item.name === 'Rides' && (
                                    <span className="ml-auto bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">NEW</span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Section */}
                <div className="p-6 border-t border-dark-border/50 space-y-4 relative z-10">
                    <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-dark-bg-tertiary/50 border border-dark-border hover:border-primary/30 transition-colors">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-sm font-bold text-white">AD</span>
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-dark-bg-tertiary"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Administrator</p>
                            <p className="text-xs text-dark-text-secondary truncate">admin@plateauconnect.ng</p>
                        </div>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center justify-center space-x-2 px-4 py-3 text-error hover:text-white hover:bg-error rounded-xl transition-all duration-300 w-full border border-error/20 hover:border-error group"
                    >
                        <FiLogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Logout Securely</span>
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

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ')
}
