'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import useSWR from 'swr'
import PaymentButton from '@/components/PaymentButton'
import { FiCreditCard, FiPlus, FiDollarSign, FiActivity, FiMapPin, FiTrendingUp, FiTrendingDown, FiCopy } from 'react-icons/fi'
import { formatCurrency, formatDateTime } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function WalletPage() {
    const { data: session } = useSession()
    const [depositAmount, setDepositAmount] = useState(5000)
    const [fundingMethod, setFundingMethod] = useState<'card' | 'transfer'>('card')
    const { data: walletData, error, mutate } = useSWR('/api/wallet', fetcher, {
        refreshInterval: 10000,
    })
    const { data: virtualAccount, error: vaError } = useSWR('/api/wallet/virtual-account', fetcher)

    const loading = !walletData && !error

    const handleDepositSuccess = async (reference: string) => {
        try {
            const response = await fetch('/api/wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reference,
                    amount: depositAmount,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                alert(`Deposit successful! New balance: ${formatCurrency(data.balance)}`)
                mutate()
            } else {
                alert(data.error || 'Deposit failed')
            }
        } catch (error) {
            console.error('Deposit error:', error)
            alert('Failed to process deposit')
        }
    }

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'DEPOSIT':
                return <FiTrendingUp className="text-success" />
            case 'WITHDRAWAL':
                return <FiTrendingDown className="text-error" />
            case 'RIDE_PAYMENT':
                return <FiMapPin className="text-primary" />
            default:
                return <FiActivity />
        }
    }

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'DEPOSIT':
                return 'text-success'
            case 'WITHDRAWAL':
            case 'RIDE_PAYMENT':
                return 'text-error'
            default:
                return 'text-white'
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert('Copied to clipboard!')
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8 animate-slideUp">
                <h1 className="text-3xl font-bold mb-2 gradient-text">Wallet & Payments</h1>
                <p className="text-dark-text-secondary">Manage your wallet balance and view transaction history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Balance Card */}
                <div className="card-gradient p-6 rounded-2xl relative overflow-hidden text-white shadow-lg animate-slideIn">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FiDollarSign className="w-32 h-32 transform rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-blue-100 font-medium mb-1">Wallet Balance</p>
                        {loading ? (
                            <div className="h-10 w-32 bg-white/20 rounded animate-pulse mb-6"></div>
                        ) : error ? (
                            <div className="mb-6">
                                <h2 className="text-4xl font-bold text-error mb-2">Error</h2>
                                <p className="text-xs text-white/70">Database tables not created. Run migration in Supabase.</p>
                            </div>
                        ) : (
                            <h2 className="text-4xl font-bold mb-6">{formatCurrency(walletData?.balance || 0)}</h2>
                        )}

                        {/* Funding Method Tabs */}
                        <div className="flex space-x-2 mb-4">
                            <button
                                onClick={() => setFundingMethod('card')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${fundingMethod === 'card'
                                    ? 'bg-white/30 text-white'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                    }`}
                            >
                                💳 Card/Paystack
                            </button>
                            <button
                                onClick={() => setFundingMethod('transfer')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${fundingMethod === 'transfer'
                                    ? 'bg-white/30 text-white'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                    }`}
                            >
                                🏦 Bank Transfer
                            </button>
                        </div>


                        {fundingMethod === 'card' ? (
                            <div className="flex space-x-3">
                                <PaymentButton
                                    email={session?.user?.email || 'user@example.com'}
                                    amount={depositAmount}
                                    text="Add Funds"
                                    onSuccess={handleDepositSuccess}
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2"
                                />
                                <select
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                                    className="bg-white/20 backdrop-blur-md px-3 py-2 rounded-lg text-sm font-semibold"
                                >
                                    <option value={1000}>₦1,000</option>
                                    <option value={2000}>₦2,000</option>
                                    <option value={5000}>₦5,000</option>
                                    <option value={10000}>₦10,000</option>
                                    <option value={20000}>₦20,000</option>
                                </select>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {virtualAccount && !vaError ? (
                                    <div className="bg-white/10 rounded-lg p-4 space-y-2">
                                        <p className="text-xs text-white/70">Transfer to your dedicated account:</p>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-white">{virtualAccount.bankName}</p>
                                                <p className="text-sm text-white/90">{virtualAccount.accountNumber}</p>
                                                <p className="text-xs text-white/70">{virtualAccount.accountName}</p>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(virtualAccount.accountNumber)}
                                                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                            >
                                                <FiCopy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white/10 rounded-lg p-4">
                                        <p className="text-sm text-white/70">Loading your account details...</p>
                                    </div>
                                )}
                                <div className="bg-success/10 border border-success/30 rounded-lg p-3">
                                    <p className="text-xs text-success">✨ Transfer the amount into the account above to confirm your trip</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Info */}
                <div className="card-glass flex flex-col justify-between animate-slideIn" style={{ animationDelay: '0.1s' }}>
                    <h3 className="font-bold text-white mb-4">How it Works</h3>
                    <div className="space-y-3 text-sm text-dark-text-secondary">
                        <p>💰 Add funds to your wallet using Paystack</p>
                        <p>🚗 Ride payments are deducted automatically</p>
                        <p>📊 Track all transactions in real-time</p>
                        <p>✅ Secure and instant balance updates</p>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card-glass animate-slideIn" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <FiActivity className="mr-2 text-primary" /> Recent Transactions
                    </h3>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-dark-bg-tertiary/50 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-dark-text-secondary">
                        Failed to load transactions
                    </div>
                ) : walletData?.transactions?.length === 0 ? (
                    <div className="text-center py-8 text-dark-text-secondary">
                        No transactions yet. Add funds to get started!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {walletData?.transactions?.map((tx: any) => (
                            <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-dark-bg-tertiary/30 transition-colors border-b border-dark-border/30 last:border-0">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-dark-bg-tertiary flex items-center justify-center">
                                        {getTransactionIcon(tx.type)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{tx.description}</p>
                                        <p className="text-xs text-dark-text-secondary">{formatDateTime(tx.createdAt)}</p>
                                    </div>
                                </div>
                                <span className={`font-bold ${getTransactionColor(tx.type)}`}>
                                    {tx.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    )
}
