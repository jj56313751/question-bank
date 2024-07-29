import type { Page } from './types'
import { Prisma } from '@prisma/client'
import prisma from '@/app/lib/prisma'
import type { PermissionItem } from '@/app/lib/definitions'
import { getAllPathsFromPermissions } from '@/app/lib/utils'

export async function fetchBanks({
  id,
  name,
  isEnabled,
  pageNumber = 1,
  pageSize = 10,
}: { id?: number; name?: string; isEnabled?: number } & Page): Promise<
  { total: number; list: Prisma.BanksSelect[] } | unknown
> {
  try {
    const where: Prisma.BanksWhereInput = {
      deletedAt: null,
    }
    if (id !== undefined) where.id = Number(id)
    if (name !== undefined) where.name = name
    if (isEnabled !== undefined) where.isEnabled = Number(isEnabled)

    const offset = (pageNumber - 1) * Number(pageSize)
    const limit = Number(pageSize)

    const total = await prisma.banks.count({
      where,
    })

    const rows = await prisma.banks.findMany({
      skip: offset,
      take: limit,
      where,
      select: {
        id: true,
        name: true,
        description: true,
        isEnabled: true,
        createdAt: true,
        createdBy: true,
        updatedAt: true,
        updatedBy: true,
      },
      orderBy: {
        id: 'asc',
      },
    })

    const list = await Promise.all(
      rows.map(async (item) => {
        const questionCount = await prisma.questions.count({
          where: {
            bankId: item.id,
            deletedAt: null,
          },
        })

        return {
          ...item,
          total: questionCount,
        }
      }),
    )

    return {
      total,
      list,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch banks data.')
  }
}

export async function fetchQuestions({
  bankId,
  title,
  type,
  pageNumber = 1,
  pageSize = 10,
}: { bankId?: number; title?: string; type?: number } & Page): Promise<
  { total: number; list: Prisma.QuestionsSelect[] } | unknown
> {
  try {
    const where: Prisma.QuestionsWhereInput = {
      AND: [
        {
          deletedAt: null,
        },
        bankId ? { bankId: Number(bankId) } : {},
        title
          ? {
              OR: [
                { title: { contains: title } },
                { options: { contains: title } },
              ],
            }
          : {},
        type ? { type: Number(type) } : {},
      ],
    }

    const offset = (pageNumber - 1) * Number(pageSize)
    const limit = Number(pageSize)

    const total = await prisma.questions.count({
      where,
    })

    const rows = await prisma.questions.findMany({
      skip: offset,
      take: limit,
      where,
      select: {
        id: true,
        type: true,
        title: true,
        options: true,
        answer: true,
        analysis: true,
        bankId: true,
        createdAt: true,
        createdBy: true,
        updatedAt: true,
        updatedBy: true,
      },
      orderBy: {
        id: 'asc',
      },
    })

    return {
      total,
      list: rows,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetchQuestions.')
  }
}

export async function getUserByNameOrEmail(
  name: string,
): Promise<Prisma.UsersSelect[] | unknown> {
  try {
    const rows = await prisma.users.findMany({
      where: {
        OR: [{ name }, { email: name }],
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    })

    return rows
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
}

export async function fetchUsers({
  id,
  name,
  email,
  isEnabled,
  pageNumber = 1,
  pageSize = 10,
}: {
  id?: number
  name?: string
  email?: string
  isEnabled?: number
} & Page): Promise<{ total: number; list: Prisma.UsersSelect[] } | unknown> {
  try {
    const where: Prisma.UsersWhereInput = {
      deletedAt: null,
      AND: [
        id ? { id: Number(id) } : {},
        name ? { name: { contains: name } } : {},
        email ? { email: { contains: email } } : {},
        isEnabled !== undefined ? { isEnabled: Number(isEnabled) } : {},
      ],
    }

    const offset = (pageNumber - 1) * Number(pageSize)
    const limit = Number(pageSize)

    const total = await prisma.users.count({
      where,
    })

    const rows = await prisma.users.findMany({
      skip: offset,
      take: limit,
      where,
      select: {
        id: true,
        name: true,
        email: true,
        isEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        id: 'asc',
      },
    })

    return {
      total,
      list: rows,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch Users.')
  }
}

function buildNestedPermissions(
  permissions: PermissionItem[],
  parentId = null,
): Array<PermissionItem & { children: PermissionItem[] }> {
  return permissions
    .filter((permission: any) => permission.parentId === parentId)
    .map((permission: any) => ({
      ...permission,
      children: buildNestedPermissions(permissions, permission.id),
    }))
}

export async function fetchUserRolesPermissions({ id }: { id: number }) {
  try {
    const res = await prisma.userRoles.findMany({
      where: { userId: id },
      select: {
        Roles: {
          select: {
            id: true,
            name: true,
            description: true,
            RolePermissions: {
              select: {
                Permissions: {
                  select: {
                    id: true,
                    parentId: true,
                    type: true,
                    name: true,
                    permission: true,
                    path: true,
                    icon: true,
                    sort: true,
                    isMenu: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    const roles: any = []

    const permissionNames: string[] = []
    const permissionsMap: Map<number, PermissionItem> = new Map()

    res.forEach((item) => {
      roles.push({
        id: item.Roles.id,
        name: item.Roles.name,
        description: item.Roles.description,
      })
      item.Roles.RolePermissions.forEach((rolePermission) => {
        if (!permissionsMap.has(rolePermission.Permissions.id)) {
          permissionsMap.set(
            rolePermission.Permissions.id,
            rolePermission.Permissions,
          )
        }
      })
    })

    for (const [id, permission] of permissionsMap) {
      permissionNames.push(permission.permission)
    }

    const permissions: any[] = buildNestedPermissions([
      ...permissionsMap.values(),
    ])

    const permissionPaths: string[] = ([] = getAllPathsFromPermissions(
      permissions,
      '/dashboard',
    )) // set root path /dashboard

    return {
      roles,
      permissions,
      permissionPaths,
      permissionNames,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch UserRolesPermissions.')
  }
}

export async function fetchAllNestedPermissions() {
  try {
    const permissions = await prisma.permissions.findMany({
      select: {
        id: true,
        parentId: true,
        type: true,
        name: true,
        permission: true,
        path: true,
        icon: true,
        sort: true,
        isMenu: true,
      },
    })

    return buildNestedPermissions(permissions)
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch AllNestedPermissions.')
  }
}

export async function fetchPermissions() {
  try {
    const permissions = await prisma.permissions.findMany({
      select: {
        id: true,
        parentId: true,
        type: true,
        name: true,
        permission: true,
        path: true,
        icon: true,
        sort: true,
      },
    })

    return permissions
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch AllPermisions.')
  }
}

export async function fetchRoles({
  id,
  description,
  pageNumber = 1,
  pageSize = 10,
}: {
  id?: number
  description?: string
} & Page): Promise<{ total: number; list: Prisma.RolesSelect[] } | unknown> {
  try {
    const where: any = {}
    if (id) {
      where.id = id
    }
    if (description) {
      where.description = description
    }

    const offset = (pageNumber - 1) * Number(pageSize)
    const limit = Number(pageSize)

    const total = await prisma.roles.count({
      where,
    })

    const rows = await prisma.roles.findMany({
      skip: offset,
      take: limit,
      where,
    })

    return {
      total,
      list: rows,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch Roles.')
  }
}
