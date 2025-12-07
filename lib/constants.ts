export const RIDE_TYPES = {
    STANDARD: {
        id: 'standard',
        name: 'Standard',
        basePrice: 2500,
        pricePerKm: 250,
        icon: '🚗',
        description: 'Affordable rides for everyday travel',
    },
    PREMIUM: {
        id: 'premium',
        name: 'Premium',
        basePrice: 4000,
        pricePerKm: 400,
        icon: '🚙',
        description: 'Comfortable rides in premium vehicles',
    },
    KEKE: {
        id: 'keke',
        name: 'Keke',
        basePrice: 1200,
        pricePerKm: 150,
        icon: '🛺',
        description: 'Quick and economical tricycle rides',
    },
    ECONOMY: {
        id: 'economy',
        name: 'Economy',
        basePrice: 2000,
        pricePerKm: 200,
        icon: '🚕',
        description: 'Budget-friendly transportation',
    },
} as const

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

export function calculateFare(rideType: keyof typeof RIDE_TYPES, distance: number): number {
    const type = RIDE_TYPES[rideType]
    return type.basePrice + (type.pricePerKm * distance)
}
