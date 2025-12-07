'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminRegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        inviteCode: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('/api/auth/admin-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'An error occurred')
                setLoading(false)
                return
            }

            // Redirect to login after successful signup
            router.push('/login?registered=admin')
        } catch (error) {
            setError('An error occurred. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="relative flex min-h-screen w-full">
            <div className="flex flex-col w-full lg:flex-row">
                {/* Left Column - Image Panel */}
                <div className="relative hidden lg:flex lg:w-1/2 min-h-screen items-center justify-center bg-black">
                    <img
                        className="absolute inset-0 h-full w-full object-cover opacity-30"
                        alt="Riyom Rock Formation in Plateau State, Nigeria"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkQ8RN9GCVIegeJiVQoz7fibA8yiIAD_7N90-WSdtrZypjtUiyaAfReO2byRaWLKhZvR13ym-4kR-D-eU7PWoIu21tjYI3oMPtwNKy6fJMIjW5-Ri2dKmaLTOUs-gxp4FiruKDsD6a7y4LPgz0OZ7ldKnJkfzUZL-L1FQ7d32jtJXzz1FQ2G9M8s5BUjnU_S6sjQAUWfn6ONYuR5jLvyJyt6ygK18wlKpMC_D766RyazuTcEkRRMtQReGXK6bBl1bNylLR9g9clkI"
                    />
                    <div className="relative z-10 p-12 text-white text-center">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/20 rounded-full mb-4">
                                <span className="text-5xl">👑</span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-4 tracking-tight">
                            Admin Access
                        </h1>
                        <p className="text-lg text-gray-300">
                            Secure administrator registration for Plateau Connect.
                            An invite code is required to create an admin account.
                        </p>
                    </div>
                </div>

                {/* Right Column - Form Panel */}
                <div className="flex flex-1 w-full lg:w-1/2 items-center justify-center p-6 sm:p-8 lg:p-12 bg-white dark:bg-[#101922]">
                    <div className="w-full max-w-md space-y-8">
                        {/* Header */}
                        <header className="flex items-center justify-center">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 text-[#137fec]">
                                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-800 dark:text-white">
                                    Plateau Connect
                                </h2>
                            </div>
                        </header>

                        <div className="flex flex-col">
                            {/* Headline */}
                            <div className="text-center">
                                <h1 className="text-gray-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">
                                    Admin Registration
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal pt-2">
                                    Enter your invite code to create an admin account.
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                {/* Invite Code Field - First and Prominent */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className="text-gray-800 dark:text-white text-sm font-medium leading-normal"
                                        htmlFor="inviteCode"
                                    >
                                        Invite Code <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative flex w-full items-stretch rounded-lg">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl">
                                            🔑
                                        </span>
                                        <input
                                            id="inviteCode"
                                            type="text"
                                            value={formData.inviteCode}
                                            onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                                            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#137fec]/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#137fec] h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 pl-10 pr-3 text-sm font-normal leading-normal transition-all"
                                            placeholder="Enter your admin invite code"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Contact your system administrator to receive an invite code.
                                    </p>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4"></div>

                                {/* Name Field */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className="text-gray-800 dark:text-white text-sm font-medium leading-normal"
                                        htmlFor="name"
                                    >
                                        Full Name
                                    </label>
                                    <div className="relative flex w-full items-stretch rounded-lg">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl">
                                            👤
                                        </span>
                                        <input
                                            id="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#137fec]/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#137fec] h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 pl-10 pr-3 text-sm font-normal leading-normal transition-all"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className="text-gray-800 dark:text-white text-sm font-medium leading-normal"
                                        htmlFor="email"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative flex w-full items-stretch rounded-lg">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl">
                                            ✉️
                                        </span>
                                        <input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#137fec]/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#137fec] h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 pl-10 pr-3 text-sm font-normal leading-normal transition-all"
                                            placeholder="Enter your email address"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone Field */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className="text-gray-800 dark:text-white text-sm font-medium leading-normal"
                                        htmlFor="phone"
                                    >
                                        Phone Number
                                    </label>
                                    <div className="relative flex w-full items-stretch rounded-lg">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl">
                                            📱
                                        </span>
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#137fec]/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#137fec] h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 pl-10 pr-3 text-sm font-normal leading-normal transition-all"
                                            placeholder="+234 800 000 0000"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className="text-gray-800 dark:text-white text-sm font-medium leading-normal"
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    <div className="relative flex w-full items-stretch rounded-lg">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl">
                                            🔒
                                        </span>
                                        <input
                                            id="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#137fec]/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#137fec] h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 pl-10 pr-3 text-sm font-normal leading-normal transition-all"
                                            placeholder="Create a strong password"
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Must be at least 8 characters long
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    className="w-full flex items-center justify-center h-12 px-6 rounded-lg bg-[#137fec] text-white text-base font-semibold transition-colors hover:bg-[#137fec]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#137fec] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#101922] disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
                                </button>
                            </form>

                            {/* Login Link */}
                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Already have an account?{' '}
                                    <Link
                                        className="font-semibold text-[#137fec] hover:underline"
                                        href="/login"
                                    >
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex gap-3">
                                <span className="text-blue-500 text-xl flex-shrink-0">ℹ️</span>
                                <div className="text-sm text-blue-900 dark:text-blue-200">
                                    <p className="font-medium mb-1">Need an invite code?</p>
                                    <p className="text-blue-700 dark:text-blue-300">
                                        Admin invite codes are issued by existing administrators.
                                        Contact your organization's administrator to request access.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
