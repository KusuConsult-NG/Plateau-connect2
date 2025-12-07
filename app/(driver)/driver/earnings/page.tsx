'use client'

import { FiDollarSign, FiTrendingUp, FiCalendar, FiDownload } from 'react-icons/fi'
import { formatCurrency } from '@/lib/utils'

export default function EarningsPage() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8 animate-slideUp">
                <div>
                    <h1 className="text-3xl font-bold mb-2 gradient-text">Earnings</h1>
                    <p className="text-dark-text-secondary">Track your revenue and financial performance.</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-dark-bg-tertiary border border-dark-border text-sm font-semibold hover:text-white transition-colors">
                    <FiDownload />
                    <span>Download Report</span>
                </button>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slideIn">
                <div className="card-gradient p-6 rounded-2xl text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FiDollarSign className="w-24 h-24 transform -rotate-12" />
                    </div>
                    <p className="text-blue-100 font-medium mb-1">Total Earnings (This Week)</p>
                    <h2 className="text-4xl font-bold">{formatCurrency(45000)}</h2>
                    <div className="mt-4 flex items-center text-sm bg-white/20 w-fit px-2 py-1 rounded-lg backdrop-blur-md">
                        <FiTrendingUp className="mr-1" />
                        <span>+15% vs last week</span>
                    </div>
                </div>

                <div className="card-glass p-6 rounded-2xl flex flex-col justify-center">
                    <p className="text-dark-text-secondary font-medium mb-1">Today's Earnings</p>
                    <h2 className="text-3xl font-bold text-white mb-2">{formatCurrency(8500)}</h2>
                    <p className="text-xs text-success font-semibold">5 Trips Completed</p>
                </div>

                <div className="card-glass p-6 rounded-2xl flex flex-col justify-center">
                    <p className="text-dark-text-secondary font-medium mb-1">Pending Payout</p>
                    <h2 className="text-3xl font-bold text-white mb-2">{formatCurrency(12000)}</h2>
                    <p className="text-xs text-dark-text-secondary">Next payout: Mon, Dec 12</p>
                </div>
            </div>

            {/* Weekly Breakdown Chart Placeholder (Using CSS bars for simplicity) */}
            <div className="card-glass p-6 mb-8 animate-slideIn" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-bold text-white mb-6">Weekly Breakdown</h3>
                <div className="flex items-end justify-between h-48 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                        <div key={day} className="flex flex-col items-center flex-1 group">
                            <div className="w-full max-w-[40px] bg-dark-bg-tertiary rounded-t-lg relative overflow-hidden transition-all duration-300 hover:bg-primary/50"
                                style={{ height: `${[40, 65, 30, 85, 55, 90, 45][i]}%` }}>
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary to-secondary opacity-80 h-full"></div>
                            </div>
                            <span className="text-xs text-dark-text-secondary mt-2 font-medium">{day}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
