import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'DRIVER') {
            return NextResponse.json(
                { error: 'Unauthorized. Only drivers can view earnings.' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const period = searchParams.get('period') || 'week' // week, month, all

        // Calculate date range
        const now = new Date()
        let startDate: Date

        switch (period) {
            case 'today':
                startDate = new Date(now.setHours(0, 0, 0, 0))
                break
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7))
                break
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1))
                break
            default:
                startDate = new Date(0) // All time
        }

        // Fetch completed rides for this driver
        const rides = await prisma.ride.findMany({
            where: {
                driverId: session.user.id,
                status: 'COMPLETED',
                completedAt: {
                    gte: startDate,
                },
            },
            include: {
                rider: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                payment: {
                    select: {
                        amount: true,
                        status: true,
                        paymentMethod: true,
                    },
                },
            },
            orderBy: {
                completedAt: 'desc',
            },
        })

        // Calculate earnings summary
        const totalEarnings = rides.reduce((sum, ride) => sum + (ride.actualFare || 0), 0)
        const todayRides = rides.filter((ride) => {
            const rideDate = new Date(ride.completedAt!)
            return rideDate.toDateString() === new Date().toDateString()
        })
        const todayEarnings = todayRides.reduce((sum, ride) => sum + (ride.actualFare || 0), 0)

        // Calculate weekly breakdown (last 7 days)
        const weeklyBreakdown = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            date.setHours(0, 0, 0, 0)

            const dayRides = rides.filter((ride) => {
                const rideDate = new Date(ride.completedAt!)
                return rideDate.toDateString() === date.toDateString()
            })

            return {
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                date: date.toISOString(),
                earnings: dayRides.reduce((sum, ride) => sum + (ride.actualFare || 0), 0),
                trips: dayRides.length,
            }
        })

        return NextResponse.json({
            summary: {
                totalEarnings,
                totalTrips: rides.length,
                todayEarnings,
                todayTrips: todayRides.length,
                averagePerTrip: rides.length > 0 ? totalEarnings / rides.length : 0,
            },
            weeklyBreakdown,
            rides: rides.map((ride) => ({
                id: ride.id,
                riderName: ride.rider.name,
                pickup: ride.pickupLocation,
                destination: ride.destination,
                distance: ride.distance,
                fare: ride.actualFare,
                rideType: ride.rideType,
                completedAt: ride.completedAt,
                paymentStatus: ride.payment?.status || 'PENDING',
                paymentMethod: ride.payment?.paymentMethod || 'N/A',
            })),
        })
    } catch (error) {
        console.error('Error fetching driver earnings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch earnings' },
            { status: 500 }
        )
    }
}
