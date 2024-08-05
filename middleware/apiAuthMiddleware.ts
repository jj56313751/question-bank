import { NextResponse } from 'next/server'

export default function authMiddleware({ auth }: { auth: any }) {

  if (!auth?.user) {
    return new NextResponse(
      JSON.stringify({ status: 'fail', message: 'You are not logged in' }),
      { status: 401 },
    )
  }
}
