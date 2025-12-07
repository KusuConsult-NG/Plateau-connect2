import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Redirect root path to login
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Protect authenticated routes
    if (
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/driver')
    ) {
        const token = await getToken({ req: request })

        if (!token) {
            const url = new URL('/login', request.url)
            url.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/dashboard/:path*', '/admin/:path*', '/driver/:path*'],
}
