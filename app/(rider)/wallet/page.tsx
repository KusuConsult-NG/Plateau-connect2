'use client'

import { useSession } from 'next-auth/react'
import PaymentButton from '@/components/PaymentButton'
import { FiCreditCard, FiPlus, FiDollarSign, FiActivity, FiMapPin } from 'react-icons/fi'
import { formatCurrency } from '@/lib/utils'

export default function WalletPage() {
    const { data: session } = useSession()
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8 animate-slideUp">
                <h1 className="text-3xl font-bold mb-2 gradient-text">Wallet & Payments</h1>
                <p className="text-dark-text-secondary">Manage your payment methods and view transaction history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Balance Card */}
                <div className="card-gradient p-6 rounded-2xl relative overflow-hidden text-white shadow-lg animate-slideIn">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FiDollarSign className="w-32 h-32 transform rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-blue-100 font-medium mb-1">Total Balance</p>
                        <h2 className="text-4xl font-bold mb-6">{formatCurrency(4500)}</h2>
                        <div className="flex space-x-3">
                            {/* Integrated Paystack Button */}
                            <PaymentButton
                                email={session?.user?.email || 'user@example.com'}
                                amount={5000}
                                onSuccess={(reference) => alert(`Payment successful! Ref: ${reference}`)}
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center"
                            />
                            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                Withdraw
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card-glass flex flex-col justify-between animate-slideIn" style={{ animationDelay: '0.1s' }}>
                    <h3 className="font-bold text-white mb-4">Payment Methods</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-dark-bg-tertiary/50 border border-dark-border/50">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-[#1A1F2C] flex items-center justify-center text-xl">💳</div>
                                <div>
                                    <p className="font-semibold text-white text-sm">Mastercard **** 4242</p>
                                    <p className="text-xs text-dark-text-secondary">Expires 12/25</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded">Primary</span>
                        </div>
                        <button className="w-full py-3 rounded-xl border border-dashed border-dark-border text-dark-text-secondary hover:text-white hover:border-primary/50 transition-all flex items-center justify-center space-x-2 text-sm">
                            <FiPlus />
                            <span>Add New Card</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card-glass animate-slideIn" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <FiActivity className="mr-2 text-primary" /> Recent Transactions
                    </h3>
                    <button className="text-sm gradient-text font-semibold">View All</button>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-dark-bg-tertiary/30 transition-colors border-b border-dark-border/30 last:border-0">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-dark-bg-tertiary flex items-center justify-center text-primary">
                                    <FiMapPin />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Ride to Terminus Market</p>
                                    <p className="text-xs text-dark-text-secondary">Today, 10:30 AM</p>
                                </div>
                            </div>
                            <span className="font-bold text-white">-{formatCurrency(1500)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
