'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiLock, FiCheckCircle, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token')
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reset password')
            }

            setSuccess(true)
            setTimeout(() => router.push('/login'), 3000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 glass-heavy">
                <div className="w-full max-w-md space-y-8 animate-slideIn text-center">
                    <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle className="w-10 h-10 text-success" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">Password Reset Successful!</h1>
                    <p className="text-dark-text-secondary mb-6">
                        Your password has been successfully reset. Redirecting to login...
                    </p>
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        )
    }

    if (error && !token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 glass-heavy">
                <div className="w-full max-w-md space-y-8 animate-slideIn text-center">
                    <div className="w-20 h-20 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-6">
                        <FiAlertCircle className="w-10 h-10 text-error" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">Invalid Link</h1>
                    <p className="text-dark-text-secondary mb-6">{error}</p>
                    <Link href="/forgot-password" className="btn-primary inline-block">
                        Request New Link
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 glass-heavy">
            <div className="w-full max-w-md space-y-8 animate-slideIn">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                        <FiLock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">Reset Your Password</h1>
                    <p className="text-dark-text-secondary">Enter your new password below</p>
                </div>

                {error && (
                    <div className="glass border border-error/50 text-error px-4 py-3 rounded-xl text-sm animate-slideUp">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-white text-sm font-medium" htmlFor="password">
                            New Password
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                🔒
                            </span>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-10 pr-12"
                                placeholder="Enter new password"
                                minLength={6}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-dark-text-secondary">Must be at least 6 characters</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-white text-sm font-medium" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                🔒
                            </span>
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field pl-10 pr-12"
                                placeholder="Confirm new password"
                                minLength={6}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-sm text-dark-text-secondary hover:text-white transition-colors"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center glass-heavy">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    )
}
