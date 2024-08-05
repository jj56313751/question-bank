import type { NextAuthConfig } from 'next-auth'
import routeAuthMiddleware from '@/middleware/routeAuthMiddleware'
import reqHeadersMiddleware from '@/middleware/reqHeadersMiddleware'
import apiAuthMiddleware from '@/middleware/apiAuthMiddleware'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized(params) {
      const {
        auth,
        request: { nextUrl },
      } = params
      // console.log('[auth]-10', auth)
      // console.log('[params.request]-10', params.request)
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnLogin = nextUrl.pathname.startsWith('/login')
      const isApi = nextUrl.pathname.startsWith('/api')
      if (isApi) {
        const apiAuthRes = apiAuthMiddleware(params)
        if (apiAuthRes) return apiAuthRes
      }
      if (isOnDashboard) {
        if (isLoggedIn) {
          // verify page permission
          const routeAuthRes = routeAuthMiddleware(params)
          if (routeAuthRes) return routeAuthRes
          // add reqHeaders to request
          const reqHeadersRes = reqHeadersMiddleware(params)
          if (reqHeadersRes) return reqHeadersRes
        }
        return false // Redirect unauthenticated users to login page
      } else if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      // other pages can view directly
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        // console.log('[user]-33', user)
        token.id = user.id
        token.roles = (user as any).roles
        token.permissions = (user as any).permissions
        token.permissionPaths = (user as any).permissionPaths
        token.permissionNames = (user as any).permissionNames
      }
      return token
    },
    session({ session, token }) {
      ;(session.user as any).id = Number(token.id)
      ;(session.user as any).roles = token.roles
      ;(session.user as any).permissions = token.permissions
      ;(session.user as any).permissionPaths = token.permissionPaths
      ;(session.user as any).permissionNames = token.permissionNames
      return session
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
