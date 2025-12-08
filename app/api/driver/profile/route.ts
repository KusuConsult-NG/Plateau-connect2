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
            licenseFrontImage,
            licenseBackImage,
            vehicleRegistration,
            insurance,
            nationalIdType,
            nationalIdNumber,
            nationalIdDocument,
            proofOfAddress,
            bvn,
            bankName,
            accountNumber,
            accountName,
        } = body

        // Validate required personal details
        if (!firstName || !lastName || !email || !phone || !address) {
            return NextResponse.json(
                { error: 'Missing required personal details' },
                { status: 400 }
            )
        }

        // Validate mandatory profile picture
        if (!profilePicture) {
            return NextResponse.json(
                { error: 'Profile/passport photograph is required for KYC verification' },
                { status: 400 }
            )
        }

        // Validate vehicle information
        if (!vehicleType || !vehicleMake || !vehicleModel || !vehicleYear || !vehicleColor || !licensePlate) {
            return NextResponse.json(
                { error: 'Missing required vehicle information' },
                { status: 400 }
            )
        }

        // Validate driver's license details
        if (!licenseNumber || !licenseExpiry) {
            return NextResponse.json(
                { error: 'Missing required license information' },
                { status: 400 }
            )
        }

        // Validate license expiry date
        const expiryDate = new Date(licenseExpiry)
        const today = new Date()
        const maxDate = new Date()
        maxDate.setFullYear(maxDate.getFullYear() + 10)

        if (isNaN(expiryDate.getTime())) {
            return NextResponse.json(
                { error: 'Invalid license expiry date format' },
                { status: 400 }
            )
        }

        if (expiryDate < today) {
            return NextResponse.json(
                { error: 'License has already expired. Please renew your license before registering.' },
                { status: 400 }
            )
        }

        if (expiryDate > maxDate) {
            return NextResponse.json(
                { error: 'License expiry date cannot be more than 10 years in the future' },
                { status: 400 }
            )
        }

        // Validate mandatory document uploads
        if (!licenseFrontImage || !licenseBackImage) {
            return NextResponse.json(
                { error: 'Driver\'s license front and back images are required' },
                { status: 400 }
            )
        }

        if (!vehicleRegistration) {
            return NextResponse.json(
                { error: 'Vehicle registration document is required' },
                { status: 400 }
            )
        }

        if (!insurance) {
            return NextResponse.json(
                { error: 'Vehicle insurance certificate is required' },
                { status: 400 }
            )
        }

        // Validate National ID (KYC requirement for Nigeria)
        if (!nationalIdType || !nationalIdNumber || !nationalIdDocument) {
            return NextResponse.json(
                { error: 'National ID information and document are required for KYC verification' },
                { status: 400 }
            )
        }

        // Create driver profile with all KYC documents
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
                licenseFrontImage,
                licenseBackImage,
                vehicleRegistration,
                insurance,
                nationalIdType,
                nationalIdNumber,
                nationalIdDocument,
                proofOfAddress: proofOfAddress || null,
                bvn: bvn || null,
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

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'DRIVER') {
            return NextResponse.json(
                { error: 'Unauthorized. Only drivers can update their profile.' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const {
            firstName,
            lastName,
            phone,
            address,
            vehicleMake,
            vehicleModel,
            vehicleYear,
            vehicleColor,
            licensePlate,
            bankName,
            accountNumber,
            accountName,
        } = body

        // Check if profile exists
        const existingProfile = await prisma.driverProfile.findUnique({
            where: { userId: session.user.id },
        })

        if (!existingProfile) {
            return NextResponse.json(
                { error: 'Driver profile not found' },
                { status: 404 }
            )
        }

        // Update profile with provided fields
        const updatedProfile = await prisma.driverProfile.update({
            where: { userId: session.user.id },
            data: {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(phone && { phone }),
                ...(address && { address }),
                ...(vehicleMake && { vehicleMake }),
                ...(vehicleModel && { vehicleModel }),
                ...(vehicleYear && { vehicleYear: parseInt(vehicleYear) }),
                ...(vehicleColor && { vehicleColor }),
                ...(licensePlate && { licensePlate }),
                ...(bankName && { bankName }),
                ...(accountNumber && { accountNumber }),
                ...(accountName && { accountName }),
            },
        })

        // Update user's name if firstName or lastName changed
        if (firstName || lastName) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    name: `${firstName || existingProfile.firstName} ${lastName || existingProfile.lastName}`,
                    ...(phone && { phone }),
                },
            })
        }

        return NextResponse.json({
            success: true,
            profile: updatedProfile,
        })
    } catch (error) {
        console.error('Driver profile update error:', error)
        return NextResponse.json(
            { error: 'Failed to update driver profile' },
            { status: 500 }
        )
    }
}
