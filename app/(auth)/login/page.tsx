'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiMapPin, FiActivity, FiEye, FiEyeOff } from 'react-icons/fi'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Invalid email or password')
                setLoading(false)
                return
            }

            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            setError('An error occurred. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="relative flex min-h-screen w-full">
            <div className="flex flex-col w-full lg:flex-row">
                {/* Left Column - Image Panel with Gradient Overlay */}
                <div className="relative hidden lg:flex lg:w-1/2 h-screen items-center justify-center bg-black overflow-hidden">
                    <img
                        className="absolute inset-0 h-full w-full object-cover opacity-40"
                        alt="Riyom Rock Formation in Plateau State, Nigeria"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkQ8RN9GCVIegeJiVQoz7fibA8yiIAD_7N90-WSdtrZypjtUiyaAfReO2byRaWLKhZvR13ym-4kR-D-eU7PWoIu21tjYI3oMPtwNKy6fJMIjW5-Ri2dKmaLTOUs-gxp4FiruKDsD6a7y4LPgz0OZ7ldKnJkfzUZL-L1FQ7d32jtJXzz1FQ2G9M8s5BUjnU_S6sjQAUWfn6ONYuR5jLvyJyt6ygK18wlKpMC_D766RyazuTcEkRRMtQReGXK6bBl1bNylLR9g9clkI"
                    />
                    {/* Vibrant Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary/30 to-accent-cyan/20"></div>
                    <div className="relative z-10 p-12 text-white text-center animate-slideUp">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30 mx-auto mb-8 animate-float">
                            <FiMapPin className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold mb-6 tracking-tight">
                            Discover the Heart of <span className="gradient-text-accent">Nigeria</span>
                        </h1>
                        <p className="text-xl text-gray-200">
                            Your journey through the stunning landscapes of Plateau State starts here.
                            Reliable rides, right at your fingertips.
                        </p>
                    </div>
                </div>

                {/* Right Column - Form Panel with Glassmorphism */}
                <div className="flex flex-1 w-full lg:w-1/2 items-center justify-center p-6 sm:p-8 lg:p-12 glass-heavy">
                    <div className="w-full max-w-md space-y-8 animate-slideIn">
                        {/* Header with Gradient Logo */}
                        <header className="flex items-center justify-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 text-primary animate-glow">
                                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24  44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold gradient-text">
                                    Plateau Connect
                                </h2>
                            </div>
                        </header>

                        <div className="flex flex-col">
                            {/* Headline */}
                            <div className="text-center">
                                <h1 className="text-white tracking-tight text-4xl font-bold leading-tight mb-3">
                                    Welcome Back
                                </h1>
                                <p className="text-dark-text-secondary text-base font-normal leading-normal">
                                    Log in to Plateau Connect to continue.
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-6 glass border border-error/50 text-error px-4 py-3 rounded-xl text-sm animate-slideUp">
                                    {error}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                                            autoComplete="email"
                                            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#137fec]/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#137fec] h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 pl-10 pr-3 text-sm font-normal leading-normal transition-all"
                                            id="email"
                                            placeholder="Enter your email address"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <label
                                            className="text-gray-800 dark:text-white text-sm font-medium leading-normal"
                                            htmlFor="password"
                                        >
                                            Password
                                        </label>
                                        <Link
                                            className="text-sm font-medium text-[#137fec] hover:underline"
                                            href="/forgot-password"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <div className="relative flex w-full items-stretch rounded-lg">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl">
                                            🔒
                                        </span>
                                        <input
                                            autoComplete="current-password"
                                            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#137fec]/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#137fec] h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 pl-10 pr-12 text-sm font-normal leading-normal transition-all"
                                            id="password"
                                            placeholder="Enter your password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                        >
                                            {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Login Button */}
                                <button
                                    className="w-full flex items-center justify-center h-12 px-6 rounded-lg bg-[#137fec] text-white text-base font-semibold transition-colors hover:bg-[#137fec]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#137fec] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#101922] disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Login'}
                                </button>
                            </form>

                            {/* Sign Up Link */}
                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Don't have an account?{' '}
                                    <Link
                                        className="font-semibold text-[#137fec] hover:underline"
                                        href="/signup"
                                    >
                                        Create an Account
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <footer className="text-center text-xs text-gray-500 dark:text-gray-400 pt-8">
                            <Link className="hover:underline" href="#">
                                Terms of Service
                            </Link>
                            <span className="mx-2">·</span>
                            <Link className="hover:underline" href="#">
                                Privacy Policy
                            </Link>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    )
}
