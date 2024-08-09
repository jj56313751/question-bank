import { NextResponse } from 'next/server'
import { createResponse } from '@/app/lib/response'
import { checkRoutePermission } from '@/app/lib/checkPermission'
import codes from '@/app/lib/codes'
import messages from '@/app/lib/messages'

export default function apiAuthMiddleware(params: any) {
  const {
    auth,
    request: { nextUrl },
  } = params

  if (!auth?.user) {
    const unauthorizedRes = createResponse(
      codes.UNAUTHORIZED,
      messages.UNAUTHORIZED,
    )
    return new NextResponse(JSON.stringify(unauthorizedRes), { status: 401 })
  }

  if (auth.user.permissionNames) {
    const hasPermission = checkRoutePermission(
      nextUrl.pathname,
      auth.user.permissionNames,
    )
    // console.log('[hasPermission]-22', hasPermission)
    if (!hasPermission) {
      const forbiddenRes = createResponse(codes.FORBIDDEN, messages.FORBIDDEN)
      return new NextResponse(JSON.stringify(forbiddenRes), { status: 403 })
    }
  }

  const resp = NextResponse.next()
  resp.headers.append('Access-Control-Allow-Credentials', 'true')
  resp.headers.append('Access-Control-Allow-Origin', '*')
  resp.headers.append(
    'Access-Control-Allow-Methods',
    'GET,DELETE,PATCH,POST,PUT',
  )
  resp.headers.append('Access-Control-Allow-Headers', '*')
  return resp
}
