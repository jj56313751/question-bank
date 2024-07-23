// import { PrismaClient } from '@prisma/client'
const { PrismaClient } = require('@prisma/client')
const {
  users,
  banks,
  questions,
  roles,
  permissions,
  userRoles,
  rolePermissions,
} = require('../db/placeholder-data.js')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function seedUsers() {
  const upsertOperations: any[] = []
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    upsertOperations.push(
      prisma.users.upsert({
        where: { email: user.email }, // 根据 email 字段查找用户
        update: {
          name: user.name,
          password: hashedPassword,
          isEnabled: user.is_enabled,
        },
        create: {
          // 如果不存在，创建
          name: user.name,
          email: user.email,
          password: hashedPassword,
          isEnabled: user.is_enabled,
        },
      }),
    )
  }
  await prisma.$transaction(upsertOperations)
}

async function seedBanks() {
  const upsertOperations: any[] = []
  for (const bank of banks) {
    upsertOperations.push(
      prisma.banks.upsert({
        where: { name: bank.name },
        update: {
          // 如果存在，更新字段
          description: bank.description,
          isEnabled: bank.is_enabled,
          createdBy: bank.created_by,
        },
        create: {
          // 如果不存在，创建
          name: bank.name,
          description: bank.description,
          isEnabled: bank.is_enabled,
          createdBy: bank.created_by,
        },
      }),
    )
  }
  await prisma.$transaction(upsertOperations)
}

async function seedQuestions() {
  const upsertOperations: any[] = []
  for (const question of questions) {
    upsertOperations.push(
      prisma.questions.upsert({
        where: {
          unique_question_title_bank_id: {
            title: question.title,
            bankId: question.bank_id,
          },
        },
        update: {
          // 如果存在，更新字段
          type: question.type,
          answer: question.answer,
          options: question.options,
          analysis: question.analysis,
          createdBy: question.created_by,
        },
        create: {
          // 如果不存在，创建
          type: question.type,
          title: question.title,
          answer: question.answer,
          options: question.options,
          analysis: question.analysis,
          bankId: question.bank_id,
          createdBy: question.created_by,
        },
      }),
    )
  }
  await prisma.$transaction(upsertOperations)
}

async function seedRoles() {
  const upsertOperations: any[] = []
  for (const role of roles) {
    upsertOperations.push(
      prisma.roles.upsert({
        where: { name: role.name },
        update: {
          // 如果存在，更新字段
          description: role.description,
          isEnabled: role.is_enabled,
        },
        create: {
          // 如果不存在，创建
          name: role.name,
          description: role.description,
          isEnabled: role.is_enabled,
        },
      }),
    )
  }
  await prisma.$transaction(upsertOperations)
}

async function seedPermissions() {
  const upsertOperations: any[] = []
  for (const permission of permissions) {
    upsertOperations.push(
      prisma.permissions.upsert({
        where: { permission: permission.permission },
        update: {
          // 如果存在，更新字段
          parentId: permission.parentId,
          type: permission.type,
          name: permission.name,
          path: permission.path,
          icon: permission.icon,
          sort: permission.sort,
        },
        create: {
          // 如果不存在，创建
          permission: permission.permission,
          parentId: permission.parentId,
          type: permission.type,
          name: permission.name,
          path: permission.path,
          icon: permission.icon,
          sort: permission.sort,
        },
      }),
    )
  }
  await prisma.$transaction(upsertOperations)
}

async function seedUserRoles() {
  const upsertOperations: any[] = []
  for (const userRole of userRoles) {
    upsertOperations.push(
      prisma.userRoles.upsert({
        where: {
          unique_user_role: {
            userId: userRole.user_id,
            roleId: userRole.role_id,
          },
        },
        update: {},
        create: {
          // 如果不存在，创建
          userId: userRole.user_id,
          roleId: userRole.role_id,
        },
      }),
    )
  }
  await prisma.$transaction(upsertOperations)
}

async function seedRolePermissions() {
  const upsertOperations: any[] = []
  for (const rolePermission of rolePermissions) {
    upsertOperations.push(
      prisma.rolePermissions.upsert({
        where: {
          unique_role_permission: {
            roleId: rolePermission.role_id,
            permissionId: rolePermission.permission_id,
          },
        },
        update: {},
        create: {
          // 如果不存在，创建
          roleId: rolePermission.role_id,
          permissionId: rolePermission.permission_id,
        },
      }),
    )
  }
  await prisma.$transaction(upsertOperations)
}

async function main() {
  await seedUsers()
  await seedBanks()
  await seedQuestions()
  await seedRoles()
  await seedPermissions()
  await seedUserRoles()
  await seedRolePermissions()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
