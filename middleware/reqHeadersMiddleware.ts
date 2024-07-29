import { NextResponse } from 'next/server'

export default function reqHeadersMiddleware({
  auth,
  request,
}: {
  auth: any
  request: any
}) {
  const { headers, url } = request
  const reqHeaders = new Headers(headers)
  reqHeaders.set('x-request-url', url)
  return NextResponse.next({
    request: {
      headers: reqHeaders,
    },
  })
}
