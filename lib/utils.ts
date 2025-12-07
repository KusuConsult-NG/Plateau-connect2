export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ')
}

export function formatCurrency(amount: number, currency: string = 'NGN'): string {
    if (currency === 'NGN') {
        return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount)
}

export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export function formatDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function formatPhoneNumber(phone: string): string {
    // Format Nigerian phone numbers
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('234')) {
        return `+${cleaned}`
    }
    if (cleaned.startsWith('0')) {
        return `+234${cleaned.slice(1)}`
    }
    return `+234${cleaned}`
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    // Haversine formula for distance calculation
    const R = 6371 // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180)
}
