export interface Location {
    address: string
    latitude: number
    longitude: number
}

export interface RideRequest {
    pickupLocation: Location
    destination: Location
    rideType: string
    estimatedFare: number
    distance: number
}

export interface DriverStats {
    acceptanceRate: number
    rating: number
    tripsThisWeek: number
}

export interface DashboardMetrics {
    totalUsers: number
    userGrowth: number
    activeRides: number
    ridesGrowth: number
    tripsToday: number
    tripsGrowth: number
    totalRevenue: number
    revenueGrowth: number
}
