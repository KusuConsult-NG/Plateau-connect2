'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
    const { data: session, update, status } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    })

    useEffect(() => {
        if (session?.user) {
            setFormData({
                name: session.user.name || '',
                email: session.user.email || '',
                phone: (session.user as any)?.phone || '',
            })
        }
    }, [session])

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    if (status === 'loading' || status === 'unauthenticated') {
        return null
    }

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const response = await fetch('/api/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error('Failed to update profile')
            }

            setSuccess('Profile updated successfully!')
            // Refresh session to get updated data
            await update()
        } catch (err) {
            setError('Failed to update profile. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match')
            setLoading(false)
            return
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters')
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to change password')
            }

            setSuccess('Password changed successfully!')
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            })
        } catch (err: any) {
            setError(err.message || 'Failed to change password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn pb-12">
            <div className="mb-8 pl-1">
                <h1 className="text-3xl font-bold gradient-text mb-2">
                    Settings
                </h1>
                <p className="text-dark-text-secondary">
                    Manage your account settings and preferences
                </p>
            </div>

            {success && (
                <div className="glass border border-success/50 text-success px-6 py-4 rounded-xl mb-8 animate-slideIn flex items-center gap-3">
                    <span className="text-xl">✅</span>
                    <p className="font-medium">{success}</p>
                </div>
            )}

            {error && (
                <div className="glass border border-error/50 text-error px-6 py-4 rounded-xl mb-8 animate-slideIn flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <div className="space-y-8">
                {/* Profile Information */}
                <div className="card-glass group hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3 mb-6 border-b border-dark-border/50 pb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <span className="text-xl">👤</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            Profile Information
                        </h2>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-dark-text-secondary mb-2 ml-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-text-secondary mb-2 ml-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-text-secondary mb-2 ml-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="input-field max-w-md"
                                placeholder="+234 800 000 0000"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary min-w-[150px]"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Change Password */}
                <div className="card-glass group hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3 mb-6 border-b border-dark-border/50 pb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <span className="text-xl">🔒</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            Change Password
                        </h2>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-dark-text-secondary mb-2 ml-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="input-field"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-text-secondary mb-2 ml-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="input-field"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-text-secondary mb-2 ml-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="input-field"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-secondary"
                            >
                                {loading ? 'Changing Password...' : 'Change Password'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Account Information */}
                <div className="card-glass">
                    <div className="flex items-center gap-3 mb-6 border-b border-dark-border/50 pb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center shadow-lg">
                            <span className="text-xl">ℹ️</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            Account Information
                        </h2>
                    </div>

                    <div className="space-y-4 text-sm bg-dark-bg-tertiary/30 rounded-xl p-6">
                        <div className="flex justify-between items-center py-2 border-b border-dark-border/50 last:border-0 last:pb-0">
                            <span className="text-dark-text-secondary font-medium">Account Type</span>
                            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                                {session?.user?.role}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-dark-border/50">
                            <span className="text-dark-text-secondary font-medium">User ID</span>
                            <span className="font-mono text-xs text-gray-500 bg-dark-bg p-1.5 rounded border border-dark-border/50">
                                {session?.user?.id}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-dark-text-secondary font-medium">Account Status</span>
                            <span className="flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-full text-xs font-bold border border-success/20">
                                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
