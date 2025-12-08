import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'DRIVER') {
            return NextResponse.json(
                { error: 'Unauthorized. Only drivers can create a profile.' },
                { status: 401 }
            )
        }

        // Check if profile already exists
        const existingProfile = await prisma.driverProfile.findUnique({
            where: { userId: session.user.id },
        })

        if (existingProfile) {
            return NextResponse.json(
                { error: 'Driver profile already exists' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const {
            firstName,
            lastName,
            email,
            phone,
            address,
            profilePicture,
            vehicleType,
            vehicleMake,
            vehicleModel,
            vehicleYear,
            vehicleColor,
            licensePlate,
            licenseNumber,
            licenseExpiry,
            licenseDocument,
            vehicleRegistration,
            insurance,
            bankName,
            accountNumber,
            accountName,
        } = body

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !address) {
            return NextResponse.json(
                { error: 'Missing required personal details' },
                { status: 400 }
            )
        }

        if (!vehicleType || !vehicleMake || !vehicleModel || !vehicleYear || !vehicleColor || !licensePlate) {
            return NextResponse.json(
                { error: 'Missing required vehicle information' },
                { status: 400 }
            )
        }

        if (!licenseNumber || !licenseExpiry) {
            return NextResponse.json(
                { error: 'Missing required license information' },
                { status: 400 }
            )
        }

        // Create driver profile
        const driverProfile = await prisma.driverProfile.create({
            data: {
                userId: session.user.id,
                firstName,
                lastName,
                email,
                phone,
                address,
                profilePicture,
                vehicleType,
                vehicleMake,
                vehicleModel,
                vehicleYear: parseInt(vehicleYear),
                vehicleColor,
                licensePlate,
                licenseNumber,
                licenseExpiry: new Date(licenseExpiry),
                licenseDocument,
                vehicleRegistration,
                insurance,
                bankName,
                accountNumber,
                accountName,
            },
        })

        // Update user's name to match driver profile
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: `${firstName} ${lastName}`,
                phone,
            },
        })

        return NextResponse.json(
            {
                success: true,
                profile: driverProfile,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Driver profile creation error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

        return NextResponse.json(
            { error: `Failed to create driver profile: ${errorMessage}` },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'DRIVER') {
            return NextResponse.json(
                { error: 'Unauthorized. Only drivers can view their profile.' },
                { status: 401 }
            )
        }

        const driverProfile = await prisma.driverProfile.findUnique({
            where: { userId: session.user.id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                        role: true,
                    },
                },
            },
        })

        if (!driverProfile) {
            return NextResponse.json(
                { error: 'Driver profile not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ profile: driverProfile })
    } catch (error) {
        console.error('Error fetching driver profile:', error)
        return NextResponse.json(
            { error: 'Failed to fetch driver profile' },
            { status: 500 }
        )
    }
}
