'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiMapPin, FiCreditCard, FiClock, FiHome, FiBriefcase, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { VEHICLE_TYPES, TERMINALS, DEPARTURE_TIMES, calculateFare } from '@/lib/constants'
import { formatCurrency, calculateDistance, formatDuration } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default function RiderDashboard() {
    const { data: session } = useSession()
    const router = useRouter()
    const [pickupLocationId, setPickupLocationId] = useState('')
    const [destinationId, setDestinationId] = useState('')
    const [departureTime, setDepartureTime] = useState('')
    const [selectedRideType, setSelectedRideType] = useState('FOUR_SEATER')
    const [loading, setLoading] = useState(false)

    // Trip calculation states
    const [tripDistance, setTripDistance] = useState<number>(0)
    const [estimatedFare, setEstimatedFare] = useState<number>(0)
    const [estimatedDuration, setEstimatedDuration] = useState<number>(0)

    // Calculate trip details when terminals or vehicle type change
    useEffect(() => {
        if (!pickupLocationId || !destinationId) {
            setTripDistance(0)
            setEstimatedFare(0)
            setEstimatedDuration(0)
            return
        }

        const pickup = TERMINALS.find(t => t.id === pickupLocationId)
        const destination = TERMINALS.find(t => t.id === destinationId)

        if (!pickup || !destination) return

        // Calculate distance
        const distance = calculateDistance(
            pickup.lat,
            pickup.lng,
            destination.lat,
            destination.lng
        )

        // Calculate fare
        const fare = calculateFare(selectedRideType as keyof typeof VEHICLE_TYPES, distance)

        // Calculate duration (distance / 100 KM/HR * 60 minutes)
        const duration = (distance / 100) * 60

        setTripDistance(distance)
        setEstimatedFare(fare)
        setEstimatedDuration(duration)
    }, [pickupLocationId, destinationId, selectedRideType])

    const handleBookRide = async () => {
        if (!pickupLocationId || !destinationId || !departureTime) {
            alert('Please fill in all fields')
            return
        }

        const pickupTerminal = TERMINALS.find(t => t.id === pickupLocationId)
        const destinationTerminal = TERMINALS.find(t => t.id === destinationId)

        if (!pickupTerminal || !destinationTerminal) return

        setLoading(true)
        try {
            const response = await fetch('/api/rides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pickupLocation: pickupTerminal.name,
                    pickupLatitude: pickupTerminal.lat,
                    pickupLongitude: pickupTerminal.lng,
                    destination: destinationTerminal.name,
                    destinationLatitude: destinationTerminal.lat,
                    destinationLongitude: destinationTerminal.lng,
                    rideType: selectedRideType,
                    metadata: { departureTime }
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to book ride')
            }

            const data = await response.json()
            alert('Ride booked successfully!')
            router.push('/dashboard/trips')
        } catch (error) {
            console.error('Booking error:', error)
            alert(error instanceof Error ? error.message : 'Failed to book ride')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Greeting with Gradient */}
            <div className="mb-8 animate-slideUp">
                <h1 className="text-5xl font-bold mb-3">
                    Hello, <span className="gradient-text">{session?.user?.name?.split(' ')[0] || 'Rider'}!</span>
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
                                            value={pickupLocationId}
                                            onChange={(e) => setPickupLocationId(e.target.value)}
                                            className="input-field !pl-12 appearance-none cursor-pointer group-hover:border-success/50 transition-all"
                                        >
                                            <option value="">Select Departure Terminal</option>
                                            {TERMINALS.map((terminal) => (
                                                <option key={terminal.id} value={terminal.id}>
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
                                            value={destinationId}
                                            onChange={(e) => setDestinationId(e.target.value)}
                                            className="input-field !pl-12 appearance-none cursor-pointer group-hover:border-error/50 transition-all"
                                        >
                                            <option value="">Select Destination Terminal</option>
                                            {TERMINALS.map((terminal) => (
                                                <option key={terminal.id} value={terminal.id}>
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
                                        className="input-field !pl-12 appearance-none cursor-pointer group-hover:border-primary/50 transition-all"
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

                            {/* Trip Summary Preview */}
                            {pickupLocationId && destinationId && tripDistance > 0 && (
                                <div className="card-gradient p-5 rounded-2xl space-y-3 animate-slideIn">
                                    <h3 className="font-bold text-lg mb-3">Trip Summary</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-3">
                                            <FiMapPin className="w-5 h-5 text-success" />
                                            <div>
                                                <p className="text-xs text-white/70">Distance</p>
                                                <p className="font-bold">{tripDistance.toFixed(1)} KM</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-3">
                                            <FiClock className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-xs text-white/70">Est. Duration</p>
                                                <p className="font-bold">{formatDuration(estimatedDuration)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-3">
                                            <FiCreditCard className="w-5 h-5 text-warning" />
                                            <div>
                                                <p className="text-xs text-white/70">Total Fare</p>
                                                <p className="font-bold gradient-text">{formatCurrency(estimatedFare)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-white/10">
                                        <p className="text-xs text-white/70 mb-2">Fare Breakdown:</p>
                                        <div className="flex justify-between text-sm">
                                            <span>Base Price ({VEHICLE_TYPES[selectedRideType as keyof typeof VEHICLE_TYPES].name}):</span>
                                            <span>{formatCurrency(VEHICLE_TYPES[selectedRideType as keyof typeof VEHICLE_TYPES].basePrice)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mt-1">
                                            <span>Distance ({tripDistance.toFixed(1)} KM × {formatCurrency(VEHICLE_TYPES[selectedRideType as keyof typeof VEHICLE_TYPES].pricePerKm)}):</span>
                                            <span>{formatCurrency(VEHICLE_TYPES[selectedRideType as keyof typeof VEHICLE_TYPES].pricePerKm * tripDistance)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Request Ride Button with Gradient */}
                            <button
                                onClick={handleBookRide}
                                disabled={loading}
                                className="btn-success w-full py-4 text-lg font-bold group flex items-center justify-center space-x-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="shimmer-loader w-6 h-6 rounded-full block"></span>
                                ) : (
                                    <>
                                        <span>Book Scheduled Ride</span>
                                        <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
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
                            <button
                                onClick={() => router.push('/dashboard/trips')}
                                className="text-sm gradient-text font-semibold hover:opacity-80 transition-opacity"
                            >
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

