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
      // console.log('[nextUrl.pathname]-10', nextUrl.pathname)
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnLogin = nextUrl.pathname.startsWith('/login')
      const isApi = nextUrl.pathname.startsWith('/api')
      if (isApi) {
        const apiAuthRes = apiAuthMiddleware(params)
        // console.log('[apiAuthRes]-24', apiAuthRes)
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // User is available during sign-in
        // console.log('[user]-33', user)
        token.id = user.id
        token.roles = (user as any).roles
        token.permissions = (user as any).permissions
        token.permissionPaths = (user as any).permissionPaths
        token.permissionNames = (user as any).permissionNames
      }
      if (trigger === 'update') {
        token.roles = session.roles
        token.permissions = session.permissions
        token.permissionPaths = session.permissionPaths
        token.permissionNames = session.permissionNames
      }
      return token
    },
    session({ session, token, trigger, newSession }) {
      // console.log('[newSession]-63', newSession)
      // console.log('[trigger]-63', trigger)
      // console.log('[trigger, newSession]-60', trigger, newSession)
      ;(session.user as any).id = Number(token.id)
      ;(session.user as any).roles = token.roles
      ;(session.user as any).permissions = token.permissions
      ;(session.user as any).permissionPaths = token.permissionPaths
      ;(session.user as any).permissionNames = token.permissionNames
      if (trigger === 'update' && newSession) {
        ;(session.user as any).roles = newSession.roles
        ;(session.user as any).permissions = newSession.permissions
        ;(session.user as any).permissionPaths = newSession.permissionPaths
        ;(session.user as any).permissionNames = newSession.permissionNames
      }
      return session
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
