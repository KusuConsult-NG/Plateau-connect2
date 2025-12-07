export const VEHICLE_TYPES = {
    FOUR_SEATER: {
        id: '4_seater',
        name: '4 Seater',
        capacity: 4,
        basePrice: 3000,
        pricePerKm: 250,
        icon: '🚗',
        description: 'Standard sedan for small groups',
    },
    FIVE_SEATER: {
        id: '5_seater',
        name: '5 Seater',
        capacity: 5,
        basePrice: 3500,
        pricePerKm: 280,
        icon: '🚙',
        description: 'Spacious car for extra comfort',
    },
    BUS_12_SEATER: {
        id: '12_seater',
        name: '12 Seater Bus',
        capacity: 12,
        basePrice: 8000,
        pricePerKm: 500,
        icon: '🚌',
        description: 'Bus for larger groups or shared rides',
    },
} as const

export const TERMINALS = [
    { id: 'jos_main', name: 'Jos Main Terminal (Terminus)', region: 'Jos North', lat: 9.9304, lng: 8.8851 },
    { id: 'jos_bukuru', name: 'Bukuru Terminal', region: 'Jos South', lat: 9.7963, lng: 8.8643 },
    { id: 'barkin_ladi', name: 'Barkin Ladi Terminal', region: 'Barkin Ladi', lat: 9.5414, lng: 8.8972 },
    { id: 'bassa', name: 'Bassa Terminal', region: 'Bassa', lat: 9.9329, lng: 8.7366 },
    { id: 'bokkos', name: 'Bokkos Terminal', region: 'Bokkos', lat: 9.2974, lng: 8.9959 },
    { id: 'jos_east', name: 'Jos East Terminal', region: 'Jos East', lat: 9.9167, lng: 9.1667 },
    { id: 'kanam', name: 'Kanam Terminal', region: 'Kanam', lat: 9.8333, lng: 10.0000 },
    { id: 'kanke', name: 'Kanke Terminal', region: 'Kanke', lat: 9.9667, lng: 9.5500 },
    { id: 'langtang_north', name: 'Langtang North Terminal', region: 'Langtang North', lat: 9.1333, lng: 9.7833 },
    { id: 'langtang_south', name: 'Langtang South Terminal', region: 'Langtang South', lat: 8.6500, lng: 9.8500 },
    { id: 'mangu', name: 'Mangu Terminal', region: 'Mangu', lat: 9.5167, lng: 9.1000 },
    { id: 'mikang', name: 'Mikang Terminal', region: 'Mikang', lat: 8.8167, lng: 9.6167 },
    { id: 'pankshin', name: 'Pankshin Terminal', region: 'Pankshin', lat: 9.3333, lng: 9.4333 },
    { id: 'quaan_pan', name: 'Qua\'an Pan Terminal', region: 'Qua\'an Pan', lat: 8.9000, lng: 9.2000 },
    { id: 'riyom', name: 'Riyom Terminal', region: 'Riyom', lat: 9.6333, lng: 8.7667 },
    { id: 'shendam', name: 'Shendam Terminal', region: 'Shendam', lat: 8.8833, lng: 9.5000 },
    { id: 'wase', name: 'Wase Terminal', region: 'Wase', lat: 9.9667, lng: 10.0167 },
] as const

export const DEPARTURE_TIMES = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM'
] as const

export const RIDE_STATUSES = {
    PENDING: {
        label: 'Pending',
        color: 'bg-yellow-500',
        textColor: 'text-yellow-500',
    },
    ACCEPTED: {
        label: 'Accepted',
        color: 'bg-blue-500',
        textColor: 'text-blue-500',
    },
    IN_PROGRESS: {
        label: 'In Progress',
        color: 'bg-blue-600',
        textColor: 'text-blue-600',
    },
    COMPLETED: {
        label: 'Completed',
        color: 'bg-green-500',
        textColor: 'text-green-500',
    },
    CANCELLED: {
        label: 'Cancelled',
        color: 'bg-red-500',
        textColor: 'text-red-500',
    },
} as const

export const PAYMENT_METHODS = {
    CARD: {
        label: 'Pay with Card',
        icon: '💳',
    },
    BANK_TRANSFER: {
        label: 'Bank Transfer',
        icon: '🏦',
    },
} as const

export const USER_ROLES = {
    ADMIN: 'ADMIN',
    DRIVER: 'DRIVER',
    RIDER: 'RIDER',
} as const

export function calculateFare(vehicleType: keyof typeof VEHICLE_TYPES, distance: number): number {
    const type = VEHICLE_TYPES[vehicleType]
    return type.basePrice + (type.pricePerKm * distance)
}
