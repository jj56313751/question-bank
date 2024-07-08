import type { NextAuthConfig } from 'next-auth'
import { NextResponse } from 'next/server'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl, headers, url } }) {
      // console.log('[nextUrl]-9', nextUrl)
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      if (isOnDashboard) {
        if (isLoggedIn) {
          // add reqHeaders to request
          const reqHeaders = new Headers(headers)
          reqHeaders.set('x-request-url', url)
          return NextResponse.next({
            request: {
              headers: reqHeaders,
            },
          })
        }
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
