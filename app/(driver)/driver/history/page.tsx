'use client'

import { FiMapPin, FiCalendar, FiClock, FiUser } from 'react-icons/fi'
import { formatCurrency } from '@/lib/utils'

const HISTORY = [
    {
        id: 1,
        passenger: 'Alice M.',
        pickup: 'Terminus',
        destination: 'Rayfield',
        amount: 2500,
        date: 'Today, 10:30 AM',
        status: 'COMPLETED',
    },
    {
        id: 2,
        passenger: 'Bob D.',
        pickup: 'Unijos',
        destination: 'Secretariat Junction',
        amount: 1200,
        date: 'Yesterday, 4:15 PM',
        status: 'COMPLETED',
    },
    {
        id: 3,
        passenger: 'Charlie',
        pickup: 'Bukuru',
        destination: 'Old Airport',
        amount: 1800,
        date: 'Yesterday, 1:00 PM',
        status: 'CANCELLED',
    },
]

export default function DriverHistoryPage() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-8 gradient-text animate-slideUp">Ride History</h1>

            <div className="space-y-4 animate-slideIn">
                {HISTORY.map((ride) => (
                    <div key={ride.id} className="card-glass p-5 rounded-xl border border-dark-border/50 hover:border-primary/40 transition-all group">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-dark-bg-tertiary flex items-center justify-center text-white shrink-0">
                                    <FiUser className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{ride.passenger}</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center text-sm text-dark-text-secondary mt-1 gap-1 sm:gap-4">
                                        <span className="flex items-center"><FiMapPin className="mr-1 text-primary" /> {ride.pickup}</span>
                                        <span className="hidden sm:inline">→</span>
                                        <span className="flex items-center"><FiMapPin className="mr-1 text-secondary" /> {ride.destination}</span>
                                    </div>
                                    <p className="text-xs text-dark-text-secondary mt-2 flex items-center">
                                        <FiCalendar className="mr-1" /> {ride.date}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pl-16 md:pl-0">
                                <p className="text-xl font-bold text-white">{formatCurrency(ride.amount)}</p>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full mt-1 ${ride.status === 'COMPLETED' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                                    }`}>
                                    {ride.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
