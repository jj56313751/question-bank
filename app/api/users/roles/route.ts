import prisma from '@/app/lib/prisma'
import { createResponse } from '@/app/lib/response'
import type { ApiResponse } from '@/app/lib/definitions'
import codes from '@/app/lib/codes'
import messages from '@/app/lib/messages'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  // console.log('[userId]-6', userId)

  if (!userId) {
    const error = createResponse(codes.BAD_REQUEST, 'userId is required')
    return new Response(JSON.stringify(error), { status: 400 })
  }

  try {
    const userRolesRes = await prisma.userRoles.findMany({
      where: {
        userId: Number(userId),
      },
      select: {
        Roles: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    })
    const userRoles = userRolesRes.map((userRole) => userRole.Roles)

    const successRes: ApiResponse<typeof userRoles> = createResponse(
      codes.OK,
      messages.SUCCESS,
      userRoles,
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
