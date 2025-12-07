import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-dark-bg via-dark-bg-secondary to-dark-bg-tertiary">
            <div className="text-center space-y-8 px-4">
                {/* Logo/Brand */}
                <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                        <span className="text-6xl">🚗</span>
                        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                            RideJos
                        </h1>
                    </div>
                    <p className="text-xl text-dark-text-secondary max-w-2xl mx-auto">
                        Your trusted ride-hailing platform for Jos, Plateau State
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/login"
                        className="btn-primary w-full sm:w-auto px-8 py-4 text-lg"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="btn-secondary w-full sm:w-auto px-8 py-4 text-lg"
                    >
                        Create Account
                    </Link>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
                    <div className="card text-center space-y-2">
                        <div className="text-4xl mb-2">⚡</div>
                        <h3 className="text-lg font-semibold">Fast & Reliable</h3>
                        <p className="text-sm text-dark-text-secondary">
                            Get matched with nearby drivers in seconds
                        </p>
                    </div>

                    <div className="card text-center space-y-2">
                        <div className="text-4xl mb-2">💰</div>
                        <h3 className="text-lg font-semibold">Affordable Pricing</h3>
                        <p className="text-sm text-dark-text-secondary">
                            Transparent fares with multiple payment options
                        </p>
                    </div>

                    <div className="card text-center space-y-2">
                        <div className="text-4xl mb-2">🔒</div>
                        <h3 className="text-lg font-semibold">Safe & Secure</h3>
                        <p className="text-sm text-dark-text-secondary">
                            Verified drivers and secure payment processing
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
