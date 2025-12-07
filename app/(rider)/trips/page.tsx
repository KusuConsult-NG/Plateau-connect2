'use client'

import { FiClock, FiMapPin, FiCalendar, FiArrowRight } from 'react-icons/fi'
import { formatCurrency } from '@/lib/utils'

const TRIPS = [
    {
        id: 1,
        destination: 'Terminus Market',
        pickup: 'Rayfield, Jos',
        date: 'Today, 10:30 AM',
        amount: 1500,
        status: 'COMPLETED',
    },
    {
        id: 2,
        destination: 'Hill Station Hotel',
        pickup: 'Unijos Main Gate',
        date: 'Yesterday, 2:15 PM',
        amount: 1200,
        status: 'COMPLETED',
    },
    {
        id: 3,
        destination: 'Solomon Lar Amusement Park',
        pickup: 'British America Junction',
        date: 'Yesterday, 9:00 AM',
        amount: 950,
        status: 'CANCELLED',
    },
    {
        id: 4,
        destination: 'Ten Commandments',
        pickup: 'Rayfield',
        date: 'Dec 5, 4:30 PM',
        amount: 2500,
        status: 'COMPLETED',
    },
]

export default function TripsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8 animate-slideUp">
                <h1 className="text-3xl font-bold mb-2 gradient-text">Your Trips</h1>
                <p className="text-dark-text-secondary">Track your journey history with Plateau Connect.</p>
            </div>

            <div className="card-glass space-y-4 animate-slideIn">
                {TRIPS.map((trip) => (
                    <div
                        key={trip.id}
                        className="group p-4 rounded-xl bg-dark-bg-tertiary/30 hover:bg-dark-bg-tertiary transition-all border border-transparent hover:border-dark-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                        <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${trip.status === 'COMPLETED' ? 'bg-gradient-to-br from-primary/20 to-secondary/20 text-primary' : 'bg-error/10 text-error'
                                }`}>
                                <FiMapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{trip.destination}</h3>
                                <p className="text-sm text-dark-text-secondary flex items-center mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-dark-border mr-2"></span>
                                    From: {trip.pickup}
                                </p>
                                <p className="text-xs text-dark-text-secondary flex items-center mt-1">
                                    <FiCalendar className="w-3 h-3 mr-1" /> {trip.date}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-row sm:flex-col items-center sm:items-end w-full sm:w-auto justify-between sm:justify-center pl-16 sm:pl-0">
                            <p className="text-xl font-bold gradient-text">{formatCurrency(trip.amount)}</p>
                            <div className="flex items-center mt-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trip.status === 'COMPLETED' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                                    }`}>
                                    {trip.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="w-full py-4 mt-4 rounded-xl border border-dashed border-dark-border text-dark-text-secondary hover:text-white hover:border-primary/50 transition-all flex items-center justify-center space-x-2 group">
                    <span>Load More History</span>
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    )
}
