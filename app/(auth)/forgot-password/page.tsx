'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiArrowLeft, FiMail, FiCheckCircle } from 'react-icons/fi'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send reset email')
            }

            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 glass-heavy">
                <div className="w-full max-w-md space-y-8 animate-slideIn">
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                            <FiCheckCircle className="w-10 h-10 text-success" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-3">Check Your Email</h1>
                        <p className="text-dark-text-secondary mb-6">
                            We've sent password reset instructions to <span className="text-white font-semibold">{email}</span>
                        </p>
                        <p className="text-sm text-dark-text-secondary mb-8">
                            Didn't receive the email? Check your spam folder or{' '}
                            <button onClick={() => setSuccess(false)} className="text-primary hover:underline">
                                try again
                            </button>
                        </p>
                        <Link href="/login" className="btn-primary inline-flex items-center space-x-2">
                            <FiArrowLeft />
                            <span>Back to Login</span>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 glass-heavy">
            <div className="w-full max-w-md space-y-8 animate-slideIn">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                        <FiMail className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">Forgot Password?</h1>
                    <p className="text-dark-text-secondary">
                        No worries! Enter your email and we'll send you reset instructions.
                    </p>
                </div>

                {error && (
                    <div className="glass border border-error/50 text-error px-4 py-3 rounded-xl text-sm animate-slideUp">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-white text-sm font-medium" htmlFor="email">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                ✉️
                            </span>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-10"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center space-x-2 text-sm text-dark-text-secondary hover:text-white transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Back to Login</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
