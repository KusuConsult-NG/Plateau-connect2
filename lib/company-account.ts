// Company bank account details for direct ride payments
export const COMPANY_ACCOUNT = {
    bankName: 'First Bank of Nigeria',
    accountNumber: '1234567890',
    accountName: 'Plateau Connect Ltd',
}

// Generate unique reference code for ride payment tracking
export function generateRideReference(rideId: string): string {
    return `RIDE-${rideId.slice(0, 8).toUpperCase()}`
}

// Extract ride ID from reference code
export function extractRideIdFromReference(reference: string): string | null {
    const match = reference.match(/^RIDE-([A-Z0-9]{8})/)
    return match ? match[1].toLowerCase() : null
}
