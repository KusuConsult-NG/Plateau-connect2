'use client'

export default function HomePage() {
    // Middleware will redirect to /login
    // Client-side fallback
    if (typeof window !== 'undefined') {
        window.location.href = '/login'
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
            <p>Redirecting to Plateau Connect...</p>
        </div>
    )
}
