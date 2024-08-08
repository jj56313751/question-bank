import type { Page } from './types'
import { Prisma } from '@prisma/client'
import prisma from '@/app/lib/prisma'
import type { PermissionItem, PermissionTrees } from '@/app/lib/definitions'
import {
  getAllPathsFromPermissions,
  buildNestedPermissions,
} from '@/app/lib/utils'

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

export async function fetchAllBanks({
  id,
  name,
  isEnabled,
}: {
  id?: number
  name?: string
  isEnabled?: number
}) {
  try {
    const where: Prisma.BanksWhereInput = {
      deletedAt: null,
    }
    if (id !== undefined) where.id = Number(id)
    if (name !== undefined) where.name = name
    if (isEnabled !== undefined) where.isEnabled = Number(isEnabled)

    return await prisma.banks.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        isEnabled: true,
      },
    })
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch banks list data.')
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

    const permissions: PermissionTrees[] = buildNestedPermissions([
      ...permissionsMap.values(),
    ])
    // console.log('permissions', permissions)

    const permissionPaths: string[] = ([] = getAllPathsFromPermissions(
      permissions,
      '/dashboard',
    )) // set root path /dashboard
    // console.log('permissionPaths', permissionPaths)

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

export async function fetchRoleNestedPermissions({
  roleId,
}: {
  roleId: number
}) {
  try {
    const res = await prisma.rolePermissions.findMany({
      where: {
        roleId,
      },
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
    })
    // console.log('res', res)
    let permissions: PermissionItem[] = []
    res.forEach(({ Permissions }) => {
      permissions.push(Permissions)
    })

    return buildNestedPermissions(permissions)
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch RoleNestedPermissions.')
  }
}

export async function fetchRolePermissions({ roleId }: { roleId: number }) {
  try {
    const res = await prisma.rolePermissions.findMany({
      where: {
        roleId,
      },
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
    })
    // console.log('res', res)
    let permissions: PermissionItem[] = []
    res.forEach(({ Permissions }) => {
      permissions.push(Permissions)
    })

    return permissions
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch RolePermissions.')
  }
}

export async function fetchAllPermissions() {
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
    const where: Prisma.RolesWhereInput = {}
    if (id) {
      where.id = id
    }
    if (description) {
      where.description = { contains: description }
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

export async function fetchAllRoles({
  id,
  description,
}: {
  id?: number
  description?: string
}) {
  try {
    const where: Prisma.RolesWhereInput = {}
    if (id) {
      where.id = id
    }
    if (description) {
      where.description = { contains: description }
    }

    const rows = await prisma.roles.findMany({
      where,
      select: {
        id: true,
        description: true,
        isEnabled: true,
      },
    })

    return rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch Roles.')
  }
}
