// import { PrismaClient } from '@prisma/client'
const { PrismaClient } = require('@prisma/client')
const { users, banks, questions, roles } = require('../db/placeholder-data.js')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function seedUsers() {
  await Promise.all(
    users.map(async (user: any) => {
      const hashedPassword = await bcrypt.hash(user.password, 10)
      await prisma.users.upsert({
        where: { email: user.email }, // 根据 email 字段查找用户
        update: {}, // 如果用户存在，不更新任何字段
        create: {
          // 如果用户不存在，创建新用户
          name: user.name,
          email: user.email,
          password: hashedPassword,
          is_enabled: !!user.is_enabled,
        },
      })
    }),
  )
}

async function seedBanks() {
  await Promise.all(
    banks.map(
      async (bank: any) =>
        await prisma.banks.upsert({
          where: { name: bank.name },
          update: {}, // 如果存在，不更新任何字段
          create: {
            // 如果不存在，创建
            name: bank.name,
            description: bank.description,
            is_enabled: !!bank.is_enabled,
            created_by: bank.created_by,
          },
        }),
    ),
  )
}

async function seedQuestions() {
  await Promise.all(
    questions.map(
      async (question: any) =>
        await prisma.questions.upsert({
          where: {
            unique_question_title_bank_id: {
              title: question.title,
              bank_id: question.bank_id,
            },
          },
          update: {}, // 如果存在，不更新任何字段
          create: {
            // 如果不存在，创建
            type: question.type,
            title: question.title,
            options: question.options,
            analysis: question.analysis,
            bank_id: question.bank_id,
            created_by: question.created_by,
          },
        }),
    ),
  )
}

async function seedRoles() {
  await Promise.all(
    roles.map(
      async (role: any) =>
        await prisma.roles.upsert({
          where: { name: role.name },
          update: {}, // 如果存在，不更新任何字段
          create: {
            // 如果不存在，创建
            name: role.name,
            description: role.description,
            is_enabled: !!role.is_enabled,
          },
        }),
    ),
  )
}

async function main() {
  await seedUsers()
  await seedBanks()
  await seedQuestions()
  await seedRoles()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
