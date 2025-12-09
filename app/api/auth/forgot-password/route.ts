import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: Request) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        })

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                success: true,
                message: 'If an account exists with that email, you will receive reset instructions.',
            })
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

        // Store token in database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        })

        // In production, you would send an email here
        // For now, we'll log the reset link (you should implement email sending)
        const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

        console.log('=== PASSWORD RESET LINK ===')
        console.log(`User: ${user.email}`)
        console.log(`Reset Link: ${resetLink}`)
        console.log(`Token expires in 1 hour`)
        console.log('===========================')

        // TODO: Send email using a service like:
        // - SendGrid
        // - AWS SES
        // - Resend
        // - Nodemailer

        // Example email content:
        // Subject: Reset your Plateau Connect password
        // Body: Click this link to reset your password: ${resetLink}
        // The link expires in 1 hour.

        return NextResponse.json({
            success: true,
            message: 'If an account exists with that email, you will receive reset instructions.',
            // For development only - remove in production:
            ...(process.env.NODE_ENV === 'development' && { resetLink }),
        })
    } catch (error) {
        console.error('Forgot password error:', error)
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        )
    }
}
