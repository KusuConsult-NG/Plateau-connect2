'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function SupportPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        category: 'general',
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    if (status === 'unauthenticated') {
        router.push('/login')
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            // For now, we'll just simulate sending the message
            // In production, you would send this to your support API/email service
            await new Promise(resolve => setTimeout(resolve, 1000))

            setSuccess(true)
            setFormData({ subject: '', message: '', category: 'general' })
        } catch (err) {
            setError('Failed to send message. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const faqs = [
        {
            question: 'How do I book a ride?',
            answer: 'Simply enter your pickup and destination locations on the dashboard, select your preferred ride type, and confirm your booking.'
        },
        {
            question: 'What payment methods are accepted?',
            answer: 'We accept payments via Paystack, including card payments and bank transfers.'
        },
        {
            question: 'Can I cancel a ride?',
            answer: 'Yes, you can cancel a ride before a driver accepts it. Once accepted, cancellation fees may apply.'
        },
        {
            question: 'How do I become a driver?',
            answer: 'Sign up with a driver account and complete the onboarding process including submitting your vehicle and license documents.'
        },
        {
            question: 'What areas do you serve?',
            answer: 'We currently serve Plateau State, Nigeria, with a focus on Jos and surrounding areas.'
        },
    ]

    return (
        <div className="container mx-auto px-4 py-8 animate-fadeIn">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold gradient-text mb-2">
                        Support Center
                    </h1>
                    <p className="text-dark-text-secondary">
                        Get help or contact our support team
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Form with Glassmorphism */}
                    <div className="card-glass">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <span className="text-2xl">✉️</span>
                            </div>
                            <h2 className="text-xl font-bold text-white">
                                Contact Us
                            </h2>
                        </div>

                        {success && (
                            <div className="glass border border-success/50 text-success px-4 py-3 rounded-xl mb-4 animate-slideIn flex items-center gap-2">
                                <span className="text-lg">✅</span>
                                <div>
                                    <p className="font-bold">Message sent!</p>
                                    <p className="text-sm">We'll get back to you soon.</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="glass border border-error/50 text-error px-4 py-3 rounded-xl mb-4 animate-slideIn">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="general">General Inquiry</option>
                                    <option value="booking">Booking Issue</option>
                                    <option value="payment">Payment Problem</option>
                                    <option value="driver">Driver Issue</option>
                                    <option value="technical">Technical Support</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="input-field"
                                    placeholder="Brief description of your issue"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                                    Message
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="input-field min-h-[120px]"
                                    rows={5}
                                    placeholder="Describe your issue in detail"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3 font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-dark-border/50">
                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-success"></span>
                                Other Ways to Reach Us
                            </h3>
                            <div className="space-y-4 text-sm text-dark-text-secondary">
                                <a href="mailto:support@plateauconnect.ng" className="flex items-center gap-3 p-3 rounded-xl bg-dark-bg-tertiary/50 hover:bg-dark-bg-tertiary transition-colors group">
                                    <span className="text-xl group-hover:scale-110 transition-transform">📧</span>
                                    <span className="group-hover:text-primary transition-colors">support@plateauconnect.ng</span>
                                </a>
                                <a href="tel:+2348000000000" className="flex items-center gap-3 p-3 rounded-xl bg-dark-bg-tertiary/50 hover:bg-dark-bg-tertiary transition-colors group">
                                    <span className="text-xl group-hover:scale-110 transition-transform">📱</span>
                                    <span className="group-hover:text-primary transition-colors">+234 800 000 0000</span>
                                </a>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-bg-tertiary/50">
                                    <span className="text-xl text-primary animate-pulse">🕐</span>
                                    <span className="text-gray-300">24/7 Support Available</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQs */}
                    <div className="space-y-6">
                        <div className="card-glass">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                    <span className="text-xl font-bold text-white">?</span>
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    Frequently Asked Questions
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="group border-b border-dark-border/50 pb-4 last:border-0 hover:bg-white/5 p-4 rounded-xl transition-colors cursor-default">
                                        <h3 className="font-semibold text-white mb-2 group-hover:text-primary transition-colors flex items-center justify-between">
                                            {faq.question}
                                            <span className="text-gray-500 group-hover:text-primary transition-colors">↓</span>
                                        </h3>
                                        <p className="text-sm text-dark-text-secondary leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors"></div>
                            <div className="relative z-10">
                                <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                                    <span className="text-xl">💡</span> Quick Tip
                                </h3>
                                <p className="text-sm text-blue-200/80 leading-relaxed">
                                    Most booking issues can be resolved by refreshing your dashboard or checking your internet connection. If the problem persists, our 24/7 support team is here to help!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
