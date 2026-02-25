import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAME } from '@/lib/auth-constants'
import { verifyAuthTokenEdge } from '@/lib/auth-edge'

const APP_SURFACE = (process.env.APP_SURFACE ?? 'public').toLowerCase()

const ADMIN_API_PREFIXES = [
  '/api/admin-activity',
  '/api/users',
  '/api/projects',
  '/api/partenaires',
  '/api/prestations',
  '/api/productions',
  '/api/artistes',
  '/api/services',
]

const ADMIN_PUBLIC_PATHS = ['/admin', '/login']

function isAdminPath(pathname: string): boolean {
  return ADMIN_PUBLIC_PATHS.some((base) => pathname === base || pathname.startsWith(`${base}/`))
}

function isAdminApi(pathname: string): boolean {
  return ADMIN_API_PREFIXES.some((base) => pathname === base || pathname.startsWith(`${base}/`))
}

function redirectForSurface(request: NextRequest, surface: 'public' | 'admin') {
  const destination = surface === 'public' ? '/' : '/admin'
  return NextResponse.redirect(new URL(destination, request.url))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  const adminPath = isAdminPath(pathname)
  const adminApi = isAdminApi(pathname)
  const apiPath = pathname.startsWith('/api/')

  if (APP_SURFACE === 'public' && (adminPath || adminApi)) {
    return redirectForSurface(request, 'public')
  }

  if (APP_SURFACE === 'admin' && !adminPath && !apiPath) {
    return redirectForSurface(request, 'admin')
  }

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const user = await verifyAuthTokenEdge(token)

  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/admin/users') && user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/admin?error=forbidden', request.url))
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
