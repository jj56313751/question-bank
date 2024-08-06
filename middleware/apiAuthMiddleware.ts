import { NextResponse } from 'next/server'

export default function authMiddleware({ auth }: { auth: any }) {
  if (!auth?.user) {
    return new NextResponse(
      JSON.stringify({ status: 'fail', message: 'You are not logged in' }),
      { status: 401 },
    )
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
