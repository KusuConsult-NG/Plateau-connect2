'use client'

import { useState } from 'react'
import { FiMapPin, FiCreditCard, FiClock, FiHome, FiBriefcase, FiShoppingBag } from 'react-icons/fi'
import { RIDE_TYPES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

export default function RiderDashboard() {
    const [pickupLocation, setPickupLocation] = useState('Rayfield, Jos')
    const [destination, setDestination] = useState('')
    const [selectedRideType, setSelectedRideType] = useState('STANDARD')

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Greeting */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Hello, David!</h1>
                <p className="text-dark-text-secondary">Where would you like to go today?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Booking Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Booking Form */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-6">Book a Ride</h2>

                        <div className="space-y-4">
                            {/* Pickup Location */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Pickup Location
                                </label>
                                <div className="relative">
                                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-success" />
                                    <input
                                        type="text"
                                        value={pickupLocation}
                                        onChange={(e) => setPickupLocation(e.target.value)}
                                        className="input-field pl-10"
                                        placeholder="Enter pickup location"
                                    />
                                </div>
                            </div>

                            {/* Destination */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Destination
                                </label>
                                <div className="relative">
                                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-error" />
                                    <input
                                        type="text"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        className="input-field pl-10"
                                        placeholder="Enter your destination"
                                    />
                                </div>
                            </div>

                            {/* Ride Type Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-3">
                                    Choose a ride
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {Object.entries(RIDE_TYPES).map(([key, type]) => (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedRideType(key)}
                                            className={`card-hover text-center py-4 ${selectedRideType === key ? 'border-primary bg-primary/5' : ''
                                                }`}
                                        >
                                            <div className="text-3xl mb-2">{type.icon}</div>
                                            <p className="font-medium text-sm">{type.name}</p>
                                            <p className="text-xs text-dark-text-secondary mt-1">
                                                {formatCurrency(type.basePrice)}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Request Ride Button */}
                            <button className="btn-success w-full py-4 text-lg font-semibold">
                                Request Ride
                            </button>
                        </div>
                    </div>

                    {/* Where to next? - Saved Locations */}
                    <div className="card">
                        <h3 className="text-lg font-bold mb-4">Where to next?</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <SavedLocationCard
                                icon={<FiHome className="w-5 h-5" />}
                                title="Home"
                                address="Your saved location"
                                iconBg="bg-yellow-500/10"
                                iconColor="text-yellow-500"
                            />
                            <SavedLocationCard
                                icon={<FiBriefcase className="w-5 h-5" />}
                                title="Office"
                                address="Your work address"
                                iconBg="bg-blue-500/10"
                                iconColor="text-blue-500"
                            />
                            <SavedLocationCard
                                icon={<FiShoppingBag className="w-5 h-5" />}
                                title="Jos Main Market"
                                address="Frequent destination"
                                iconBg="bg-error/10"
                                iconColor="text-error"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Recent Trips */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Recent Trips</h3>
                            <button className="text-sm text-primary hover:text-primary-light">
                                View All
                            </button>
                        </div>

                        <div className="space-y-3">
                            <TripCard
                                destination="Terminus Market"
                                time="Today, 10:30 AM"
                                amount={1500}
                                status="COMPLETED"
                            />
                            <TripCard
                                destination="Hill Station Hotel"
                                time="Yesterday"
                                amount={1200}
                                status="COMPLETED"
                            />
                            <TripCard
                                destination="Solomon Lar Amusement Park"
                                time="Yesterday"
                                amount={950}
                                status="CANCELLED"
                            />
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Payment Methods</h3>
                            <button className="text-sm text-primary hover:text-primary-light">
                                Add New
                            </button>
                        </div>

                        <div className="space-y-3">
                            <PaymentMethodCard
                                brand="Mastercard"
                                last4="1234"
                                icon="💳"
                            />
                            <PaymentMethodCard
                                brand="Visa"
                                last4="4242"
                                icon="💳"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SavedLocationCard({
    icon,
    title,
    address,
    iconBg,
    iconColor,
}: {
    icon: React.ReactNode
    title: string
    address: string
    iconBg: string
    iconColor: string
}) {
    return (
        <button className="card-hover text-left">
            <div className={`w-10 h-10 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <h4 className="font-medium mb-1">{title}</h4>
            <p className="text-xs text-dark-text-secondary">{address}</p>
            <button className="text-xs text-success mt-2 font-medium">Book Now</button>
        </button>
    )
}

function TripCard({
    destination,
    time,
    amount,
    status,
}: {
    destination: string
    time: string
    amount: number
    status: string
}) {
    return (
        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-dark-bg-tertiary transition-colors">
            <div className="w-8 h-8 bg-dark-bg-tertiary rounded-lg flex items-center justify-center flex-shrink-0">
                <FiMapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{destination}</p>
                <p className="text-xs text-dark-text-secondary">{time}</p>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="font-medium text-sm">{formatCurrency(amount)}</p>
                {status === 'CANCELLED' && (
                    <p className="text-xs text-error">Canceled</p>
                )}
            </div>
        </div>
    )
}

function PaymentMethodCard({
    brand,
    last4,
    icon,
}: {
    brand: string
    last4: string
    icon: string
}) {
    return (
        <div className="flex items-center space-x-3 p-3 bg-dark-bg-tertiary rounded-lg">
            <div className="w-10 h-10 bg-dark-bg rounded-lg flex items-center justify-center text-xl">
                {icon}
            </div>
            <div className="flex-1">
                <p className="font-medium text-sm">{brand}</p>
                <p className="text-xs text-dark-text-secondary">**** {last4}</p>
            </div>
            <button className="text-dark-text-secondary hover:text-white">
                <FiClock className="w-4 h-4" />
            </button>
        </div>
    )
}
