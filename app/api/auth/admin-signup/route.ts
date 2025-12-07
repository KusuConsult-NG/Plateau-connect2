import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Hardcoded invite codes for now - in production, store these in database
const VALID_INVITE_CODES = [
    'ADMIN-2024-PLATEAU',
    'SUPER-ADMIN-KEY',
    'PLATEAU-CONNECT-ADMIN',
]

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, name, phone, inviteCode } = body

        // Validation
        if (!email || !password || !name || !inviteCode) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate invite code
        if (!VALID_INVITE_CODES.includes(inviteCode)) {
            return NextResponse.json(
                { error: 'Invalid invite code. Please contact an administrator.' },
                { status: 403 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create admin user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                role: 'ADMIN', // Force ADMIN role
            },
        })

        // TODO: In production, mark the invite code as used in database

        return NextResponse.json(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                message: 'Admin account created successfully',
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Admin signup error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
