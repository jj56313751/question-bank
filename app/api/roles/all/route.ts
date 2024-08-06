import prisma from '@/app/lib/prisma'
import { createResponse } from '@/app/lib/response'
import type { ApiResponse } from '@/app/lib/definitions'
import codes from '@/app/lib/codes'
import messages from '@/app/lib/messages'

export async function GET(request: Request) {
  try {
    const roles = await prisma.roles.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    })
    const successRes: ApiResponse<typeof roles> = createResponse(
      codes.OK,
      messages.SUCCESS,
      roles,
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
