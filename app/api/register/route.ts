import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, name, role, phone } = body

        // Validation
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists with this email' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                role: role || 'RIDER',
            },
        })

        return NextResponse.json(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Signup error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

        return NextResponse.json(
            { error: `Signup failed: ${errorMessage}` },
            { status: 500 }
        )
    }
}

export async function GET() {
    return NextResponse.json({ message: 'Register endpoint active' })
}
