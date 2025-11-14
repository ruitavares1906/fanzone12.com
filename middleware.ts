import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Segurança
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')

  // Cache seletivo — evita problemas de cache em iOS
  if (request.nextUrl.pathname.startsWith('/_next/static')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  }

  // DNS prefetch (opcional)
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
