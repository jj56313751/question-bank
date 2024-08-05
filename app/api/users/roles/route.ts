import prisma from '@/app/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return new Response('userId is required', { status: 400 })
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

    return new Response(JSON.stringify(userRoles), {
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
