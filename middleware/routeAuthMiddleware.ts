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
  ]
  
  if (permissionPaths) {
    permissionPaths.forEach((path: string) => {
      permissionRoutes.push(path)
    })
  }

  if (!permissionRoutes.includes(nextUrl.pathname))
    return NextResponse.redirect(
      new URL('/dashboard/unauthorized', request.url),
    )
}
