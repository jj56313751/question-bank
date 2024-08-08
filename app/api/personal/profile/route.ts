import { createResponse } from '@/app/lib/response'
import type { ApiResponse } from '@/app/lib/definitions'
import codes from '@/app/lib/codes'
import messages from '@/app/lib/messages'
import { auth } from '@/auth'
import { fetchUserRolesPermissions } from '@/app/lib/data'

export async function GET(request: Request) {
  const session = await auth()
  const userId = session && ((session.user as any).id as number)
  if (userId) {
    try {
      const res = await fetchUserRolesPermissions({
        id: Number(userId),
      })
      const successRes: ApiResponse<typeof res> = createResponse(
        codes.OK,
        messages.SUCCESS,
        res,
      )
      return new Response(JSON.stringify(successRes), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      return new Response(JSON.stringify(error), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  }
}
