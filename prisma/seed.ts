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
    ),
  )
}

async function seedRoles() {
  await Promise.all(
    roles.map(
      async (role: any) =>
        await prisma.roles.upsert({
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
