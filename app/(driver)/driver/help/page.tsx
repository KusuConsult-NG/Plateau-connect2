'use client'

import { FiHelpCircle, FiMessageCircle, FiPhone } from 'react-icons/fi'

export default function HelpPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-2 gradient-text animate-slideUp">Help & Support</h1>
            <p className="text-dark-text-secondary mb-8 animate-slideUp">How can we assist you today?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-slideIn">
                <div className="card-glass p-6 rounded-2xl border border-dark-border hover:border-primary/50 transition-colors cursor-pointer group text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FiMessageCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Live Chat</h3>
                    <p className="text-sm text-dark-text-secondary">Chat with our support team in real-time.</p>
                </div>

                <div className="card-glass p-6 rounded-2xl border border-dark-border hover:border-secondary/50 transition-colors cursor-pointer group text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FiPhone className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Call Support</h3>
                    <p className="text-sm text-dark-text-secondary">Speak directly with an agent.</p>
                </div>
            </div>

            <div className="card-glass p-6 animate-slideIn" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {['How do I change my vehicle details?', 'When will I receive my payout?', 'How is my rating calculated?'].map((q, i) => (
                        <div key={i} className="p-4 rounded-xl bg-dark-bg-tertiary/30 hover:bg-dark-bg-tertiary transition-colors cursor-pointer flex justify-between items-center group">
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white">{q}</span>
                            <FiHelpCircle className="text-dark-text-secondary group-hover:text-primary transition-colors" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
