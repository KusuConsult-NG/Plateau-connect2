'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiUser, FiTruck, FiDollarSign, FiSave } from 'react-icons/fi'

export default function SettingsPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: '',
        vehicleColor: '',
        licensePlate: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
    })

    // Fetch current profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/driver/profile')
                if (response.ok) {
                    const data = await response.json()
                    const profile = data.profile
                    setFormData({
                        firstName: profile.firstName || '',
                        lastName: profile.lastName || '',
                        phone: profile.phone || '',
                        address: profile.address || '',
                        vehicleMake: profile.vehicleMake || '',
                        vehicleModel: profile.vehicleModel || '',
                        vehicleYear: profile.vehicleYear || '',
                        vehicleColor: profile.vehicleColor || '',
                        licensePlate: profile.licensePlate || '',
                        bankName: profile.bankName || '',
                        accountNumber: profile.accountNumber || '',
                        accountName: profile.accountName || '',
                    })
                }
            } catch (err) {
                console.error('Failed to fetch profile:', err)
                setError('Failed to load profile')
            } finally {
                setLoading(false)
            }
        }

        if (session?.user) {
            fetchProfile()
        }
    }, [session])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setSuccess('')

        try {
            const response = await fetch('/api/driver/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile')
            }

            setSuccess('Profile updated successfully!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-8 gradient-text animate-slideUp">Settings</h1>

            {error && (
                <div className="mb-6 p-4 bg-error/20 border border-error rounded-lg text-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-success/20 border border-success rounded-lg text-success">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 animate-slideIn">
                {/* Personal Information */}
                <div className="card-glass p-0 overflow-hidden">
                    <div className="p-6 border-b border-dark-border/50 flex items-center space-x-3">
                        <FiUser className="text-primary w-5 h-5" />
                        <div>
                            <h2 className="text-xl font-bold text-white">Personal Information</h2>
                            <p className="text-sm text-dark-text-secondary">Update your personal details</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Address</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>

                {/* Vehicle Information */}
                <div className="card-glass p-0 overflow-hidden">
                    <div className="p-6 border-b border-dark-border/50 flex items-center space-x-3">
                        <FiTruck className="text-primary w-5 h-5" />
                        <div>
                            <h2 className="text-xl font-bold text-white">Vehicle Information</h2>
                            <p className="text-sm text-dark-text-secondary">Update your vehicle details</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Make</label>
                                <input
                                    type="text"
                                    value={formData.vehicleMake}
                                    onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Model</label>
                                <input
                                    type="text"
                                    value={formData.vehicleModel}
                                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Year</label>
                                <input
                                    type="number"
                                    value={formData.vehicleYear}
                                    onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Color</label>
                                <input
                                    type="text"
                                    value={formData.vehicleColor}
                                    onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">License Plate</label>
                                <input
                                    type="text"
                                    value={formData.licensePlate}
                                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bank Details */}
                <div className="card-glass p-0 overflow-hidden">
                    <div className="p-6 border-b border-dark-border/50 flex items-center space-x-3">
                        <FiDollarSign className="text-primary w-5 h-5" />
                        <div>
                            <h2 className="text-xl font-bold text-white">Bank Details</h2>
                            <p className="text-sm text-dark-text-secondary">Update payout information</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Bank Name</label>
                            <input
                                type="text"
                                value={formData.bankName}
                                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Account Number</label>
                                <input
                                    type="text"
                                    value={formData.accountNumber}
                                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                    className="input-field"
                                    maxLength={10}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Account Name</label>
                                <input
                                    type="text"
                                    value={formData.accountName}
                                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                    >
                        <FiSave />
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </form>
        </div>
    )
}
