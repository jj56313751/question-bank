import { NextResponse } from 'next/server'

export default function routeAuthMiddleware({
  auth,
  request,
}: {
  auth: any
  request: any
}) {
  const { nextUrl } = request
  const { permissionPaths } = auth?.user

  const permissionRoutes: string[] = [
    '/dashboard',
    '/dashboard/unauthorized',
    ...permissionPaths,
  ]

  if (!permissionRoutes.includes(nextUrl.pathname))
    return NextResponse.redirect(
      new URL('/dashboard/unauthorized', request.url),
    )
}
