'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiMapPin, FiCreditCard, FiClock, FiHome, FiBriefcase, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { VEHICLE_TYPES, TERMINALS, DEPARTURE_TIMES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default function RiderDashboard() {
    const [pickupLocation, setPickupLocation] = useState('')
    const [destination, setDestination] = useState('')
    const [departureTime, setDepartureTime] = useState('')
    const [selectedRideType, setSelectedRideType] = useState('FOUR_SEATER')

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Greeting with Gradient */}
            <div className="mb-8 animate-slideUp">
                <h1 className="text-5xl font-bold mb-3">
                    Hello, <span className="gradient-text">David!</span>
                </h1>
                <p className="text-dark-text-secondary text-lg">✨ Where would you like to go today?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Booking Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Booking Form with Glassmorphism */}
                    <div className="card-glass animate-slideIn">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                                <FiMapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Book a Ride</h2>
                                <p className="text-sm text-dark-text-secondary">Scheduled departures from designated terminals</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Departure Terminal */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2.5 text-white">
                                        Departure Terminal
                                    </label>
                                    <div className="relative group">
                                        <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-success w-5 h-5 z-10 pointer-events-none" />
                                        <select
                                            value={pickupLocation}
                                            onChange={(e) => setPickupLocation(e.target.value)}
                                            className="input-field pl-12 appearance-none cursor-pointer group-hover:border-success/50 transition-all"
                                        >
                                            <option value="">Select Departure Terminal</option>
                                            {TERMINALS.map((terminal) => (
                                                <option key={terminal.id} value={terminal.name}>
                                                    {terminal.name} ({terminal.region})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Destination Terminal */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2.5 text-white">
                                        Destination Terminal
                                    </label>
                                    <div className="relative group">
                                        <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-error w-5 h-5 z-10 pointer-events-none" />
                                        <select
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            className="input-field pl-12 appearance-none cursor-pointer group-hover:border-error/50 transition-all"
                                        >
                                            <option value="">Select Destination Terminal</option>
                                            {TERMINALS.map((terminal) => (
                                                <option key={terminal.id} value={terminal.name}>
                                                    {terminal.name} ({terminal.region})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Departure Time */}
                            <div>
                                <label className="block text-sm font-semibold mb-2.5 text-white">
                                    Departure Time
                                </label>
                                <div className="relative group">
                                    <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5 z-10 pointer-events-none" />
                                    <select
                                        value={departureTime}
                                        onChange={(e) => setDepartureTime(e.target.value)}
                                        className="input-field pl-12 appearance-none cursor-pointer group-hover:border-primary/50 transition-all"
                                    >
                                        <option value="">Select Departure Time</option>
                                        {DEPARTURE_TIMES.map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <p className="text-xs text-dark-text-secondary mt-1.5 ml-1">
                                    * Rides depart promptly at selected times between 6AM and 7PM.
                                </p>
                            </div>

                            {/* Vehicle Type Selection */}
                            <div>
                                <label className="block text-sm font-semibold mb-4 text-white">
                                    Choose Vehicle Capacity
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {Object.entries(VEHICLE_TYPES).map(([key, type]) => (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedRideType(key)}
                                            className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 text-left group ${selectedRideType === key
                                                ? 'card-gradient scale-[1.02] shadow-purple ring-2 ring-primary/50'
                                                : 'bg-dark-bg-tertiary/50 hover:bg-dark-bg-tertiary border border-dark-border hover:border-primary/30'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="text-3xl animate-float">{type.icon}</div>
                                                {selectedRideType === key && (
                                                    <div className="w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="font-bold text-lg mb-1">{type.name}</p>
                                            <p className={`text-xs mb-2 ${selectedRideType === key ? 'text-white/90' : 'text-dark-text-secondary'}`}>
                                                {type.description}
                                            </p>
                                            <p className="font-bold text-sm gradient-text">
                                                {formatCurrency(type.basePrice)} <span className="text-xs font-normal opacity-70">est.</span>
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Request Ride Button with Gradient */}
                            <button className="btn-success w-full py-4 text-lg font-bold group flex items-center justify-center space-x-2 mt-6">
                                <span>Book Scheduled Ride</span>
                                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Saved Locations with Modern Cards */}
                    <div className="card-glass animate-slideIn" style={{ animationDelay: '0.1s' }}>
                        <h3 className="text-xl font-bold mb-5 flex items-center">
                            <span className="gradient-text">Where to next?</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SavedLocationCard
                                icon={<FiHome className="w-6 h-6" />}
                                title="Home"
                                address="Your saved location"
                                gradient="from-yellow-500 to-orange-500"
                            />
                            <SavedLocationCard
                                icon={<FiBriefcase className="w-6 h-6" />}
                                title="Office"
                                address="Your work address"
                                gradient="from-blue-500 to-cyan-500"
                            />
                            <SavedLocationCard
                                icon={<FiShoppingBag className="w-6 h-6" />}
                                title="Jos Main Market"
                                address="Frequent destination"
                                gradient="from-pink-500 to-rose-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar with Premium Cards */}
                <div className="space-y-6">
                    {/* Recent Trips */}
                    <div className="card-glass animate-slideIn" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold">Recent Trips</h3>
                            <button className="text-sm gradient-text font-semibold hover:opacity-80 transition-opacity">
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
                    <div className="card-glass animate-slideIn" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold">Payment Methods</h3>
                            <button className="text-sm gradient-text font-semibold hover:opacity-80 transition-opacity">
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
    gradient,
}: {
    icon: React.ReactNode
    title: string
    address: string
    gradient: string
}) {
    return (
        <button className="group relative overflow-hidden bg-dark-bg-tertiary/50 hover:bg-dark-bg-tertiary border border-dark-border hover:border-primary/40 rounded-2xl p-5 text-left transition-all duration-300 hover:scale-105 hover:shadow-purple">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h4 className="font-bold mb-1.5 text-white">{title}</h4>
            <p className="text-xs text-dark-text-secondary mb-3">{address}</p>
            <div className="flex items-center text-sm gradient-text font-semibold group-hover:translate-x-1 transition-transform">
                Book Now <FiArrowRight className="ml-1 w-4 h-4" />
            </div>
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
        <div className="group flex items-start space-x-3 p-3.5 rounded-xl hover:bg-dark-bg-tertiary/50 transition-all border border-transparent hover:border-dark-border">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FiMapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-white">{destination}</p>
                <p className="text-xs text-dark-text-secondary mt-0.5">{time}</p>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="font-bold text-sm gradient-text">{formatCurrency(amount)}</p>
                {status === 'CANCELLED' && (
                    <p className="text-xs text-error mt-0.5">Canceled</p>
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
        <div className="group flex items-center space-x-3 p-4 bg-dark-bg-tertiary/50 hover:bg-dark-bg-tertiary rounded-xl transition-all border border-dark-border hover:border-primary/30">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className="flex-1">
                <p className="font-semibold text-sm text-white">{brand}</p>
                <p className="text-xs text-dark-text-secondary">**** {last4}</p>
            </div>
            <button className="text-dark-text-secondary hover:text-white transition-colors">
                <FiCreditCard className="w-5 h-5" />
            </button>
        </div>
    )
}

