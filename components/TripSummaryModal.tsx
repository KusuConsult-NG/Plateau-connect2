import { FiX, FiMapPin, FiClock, FiUser, FiTruck, FiStar, FiCalendar } from 'react-icons/fi'
import { formatCurrency, formatDateTime } from '@/lib/utils'

interface TripSummaryModalProps {
    ride: any
    onClose: () => void
}

export default function TripSummaryModal({ ride, onClose }: TripSummaryModalProps) {
    const driver = ride.driver
    const driverProfile = ride.driverProfile

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-dark-bg-secondary w-full max-w-2xl rounded-2xl border border-dark-border shadow-2xl overflow-hidden animate-slideIn my-8">

                {/* Header */}
                <div className="p-6 border-b border-dark-border bg-gradient-to-r from-primary/20 to-secondary/20">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Trip Summary</h2>
                            <p className="text-dark-text-secondary text-sm">Trip completed successfully! 🎉</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <FiX className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Completion Status */}
                    <div className="bg-success/10 border border-success/30 rounded-xl p-4 flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                            <span className="text-2xl">✓</span>
                        </div>
                        <div>
                            <p className="font-bold text-success">Trip Completed</p>
                            <p className="text-xs text-dark-text-secondary">
                                {formatDateTime(ride.completedAt)}
                            </p>
                        </div>
                    </div>

                    {/* Route Information */}
                    <div className="card-glass p-5">
                        <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
                            <FiMapPin className="text-primary" />
                            <span>Route Details</span>
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="mt-1">
                                    <div className="w-3 h-3 rounded-full bg-success border-2 border-white/20"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-dark-text-secondary">Pickup</p>
                                    <p className="font-semibold text-white">{ride.pickupLocation}</p>
                                </div>
                            </div>

                            <div className="ml-[6px] border-l-2 border-dashed border-dark-border h-4"></div>

                            <div className="flex items-start space-x-3">
                                <div className="mt-1">
                                    <div className="w-3 h-3 rounded-full bg-error border-2 border-white/20"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-dark-text-secondary">Destination</p>
                                    <p className="font-semibold text-white">{ride.destination}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-dark-border/50">
                                <div>
                                    <p className="text-xs text-dark-text-secondary">Distance</p>
                                    <p className="font-bold text-white">{ride.distance.toFixed(1)} km</p>
                                </div>
                                <div>
                                    <p className="text-xs text-dark-text-secondary">Ride Type</p>
                                    <p className="font-bold text-white">{ride.rideType}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Driver Information */}
                    {driver && (
                        <div className="card-glass p-5">
                            <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
                                <FiUser className="text-primary" />
                                <span>Driver Information</span>
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
                                        {driver.name ? driver.name.split(' ').map((n: string) => n[0]).join('') : 'DR'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-white text-lg">{driver.name || 'Driver'}</p>
                                        <p className="text-sm text-dark-text-secondary">{driver.phone || 'N/A'}</p>
                                        {driverProfile?.rating > 0 && (
                                            <div className="flex items-center space-x-1 mt-1">
                                                <FiStar className="w-4 h-4 text-warning fill-warning" />
                                                <span className="text-sm font-semibold text-white">
                                                    {driverProfile.rating.toFixed(1)}
                                                </span>
                                                <span className="text-xs text-dark-text-secondary">
                                                    ({driverProfile.totalTrips} trips)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Vehicle Information */}
                    {driverProfile && (
                        <div className="card-glass p-5">
                            <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
                                <FiTruck className="text-primary" />
                                <span>Vehicle Information</span>
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-dark-text-secondary mb-1">Make & Model</p>
                                    <p className="font-semibold text-white">
                                        {driverProfile.vehicleMake} {driverProfile.vehicleModel}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-dark-text-secondary mb-1">Year</p>
                                    <p className="font-semibold text-white">{driverProfile.vehicleYear}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-dark-text-secondary mb-1">Color</p>
                                    <p className="font-semibold text-white">{driverProfile.vehicleColor}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-dark-text-secondary mb-1">Registration</p>
                                    <p className="font-bold text-primary text-lg tracking-wider">
                                        {driverProfile.licensePlate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Fare Breakdown */}
                    <div className="card-gradient p-5 rounded-xl">
                        <h3 className="font-bold text-white mb-4">Fare Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-white/80">
                                <span>Base Fare</span>
                                <span>{formatCurrency(ride.actualFare || ride.estimatedFare)}</span>
                            </div>
                            <div className="pt-3 border-t border-white/20 flex justify-between items-center">
                                <span className="font-bold text-lg text-white">Total Paid</span>
                                <span className="font-bold text-2xl text-white">
                                    {formatCurrency(ride.actualFare || ride.estimatedFare)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    {ride.payment && (
                        <div className="card-glass p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-dark-text-secondary mb-1">Payment Method</p>
                                    <p className="font-semibold text-white">{ride.payment.paymentMethod || 'N/A'}</p>
                                </div>
                                <div className="px-4 py-2 rounded-lg bg-success/20 text-success font-bold text-sm">
                                    {ride.payment.status}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Trip Timeline */}
                    <div className="card-glass p-5">
                        <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
                            <FiClock className="text-primary" />
                            <span>Trip Timeline</span>
                        </h3>
                        <div className="space-y-3 text-sm">
                            {ride.acceptedAt && (
                                <div className="flex justify-between">
                                    <span className="text-dark-text-secondary">Accepted</span>
                                    <span className="text-white font-medium">{formatDateTime(ride.acceptedAt)}</span>
                                </div>
                            )}
                            {ride.startedAt && (
                                <div className="flex justify-between">
                                    <span className="text-dark-text-secondary">Started</span>
                                    <span className="text-white font-medium">{formatDateTime(ride.startedAt)}</span>
                                </div>
                            )}
                            {ride.completedAt && (
                                <div className="flex justify-between">
                                    <span className="text-dark-text-secondary">Completed</span>
                                    <span className="text-white font-medium">{formatDateTime(ride.completedAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-dark-border bg-dark-bg-tertiary/50">
                    <button
                        onClick={onClose}
                        className="btn-primary w-full py-3 font-bold"
                    >
                        Close Summary
                    </button>
                </div>
            </div>
        </div>
    )
}
