const db = require('../db/index.js')
// import db from '../db/index'

const { users, banks, questions, roles } = require('../db/placeholder-data.js')
// import { users, banks, questions } from '../app/lib/placeholder-data.js'
const bcrypt = require('bcrypt')
// import bcrypt from 'bcrypt'

async function seedUsers(client) {
  try {
    const [createTable] = await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_enabled BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL DEFAULT NULL,
        UNIQUE KEY unique_name (name),
        UNIQUE KEY unique_email (email)
      );
    `)

    console.log(`Created "users" table`)

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        // console.log('[hashedPassword]-30', hashedPassword)
        return client.query(
          `
            INSERT INTO users (id, name, email, password, is_enabled)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              name = VALUES(name),
              email = VALUES(email),
              password = VALUES(password);
          `,
          [user.id, user.name, user.email, hashedPassword, user.is_enabled],
        )
      }),
    )

    console.log(`Seeded ${insertedUsers.length} users`)

    return {
      createTable,
      users: insertedUsers,
    }
  } catch (error) {
    console.error('Error seeding users:', error)
    throw error
  }
}

async function seedBanks(client) {
  try {
    const [createTable] = await client.query(`
      CREATE TABLE IF NOT EXISTS banks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(255) NULL,
        is_enabled BOOLEAN NOT NULL,
        created_by INT NOT NULL,
        FOREIGN KEY (created_by) REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        updated_by INT NULL,
        FOREIGN KEY (updated_by) REFERENCES users(id),
        deleted_at TIMESTAMP NULL DEFAULT NULL,
        deleted_by INT NULL,
        FOREIGN KEY (deleted_by) REFERENCES users(id),
        UNIQUE KEY unique_name (name)
      );
    `)

    console.log(`Created "banks" table`)

    // Insert data into the "banks" table
    const insertedBanks = await Promise.all(
      banks.map(async (bank) => {
        return client.query(
          `
            INSERT INTO banks (id, name, description, is_enabled, created_by)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              name = VALUES(name),
              description = VALUES(description),
              created_by = VALUES(created_by);
          `,
          [
            bank.id,
            bank.name,
            bank.description,
            bank.is_enabled,
            bank.created_by,
          ],
        )
      }),
    )

    console.log(`Seeded ${insertedBanks.length} banks`)

    return {
      createTable,
      banks: insertedBanks,
    }
  } catch (error) {
    console.error('Error seeding banks:', error)
    throw error
  }
}

async function seedQuestions(client) {
  try {
    const [createTable] = await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type INT NULL,
        title TEXT NOT NULL,
        options TEXT NULL,
        answer TEXT NULL,
        analysis TEXT NULL,
        bank_id INT NOT NULL,
        FOREIGN KEY (bank_id) REFERENCES banks(id),
        created_by INT NOT NULL,
        FOREIGN KEY (created_by) REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        updated_by INT NULL,
        FOREIGN KEY (updated_by) REFERENCES users(id),
        deleted_at TIMESTAMP NULL DEFAULT NULL,
        deleted_by INT NULL,
        FOREIGN KEY (deleted_by) REFERENCES users(id),
        UNIQUE KEY unique_title_bank_id (title(255), bank_id)
      );
    `)

    console.log(`Created "questions" table`)

    // Insert data into the "questions" table
    const insertedQuestions = await Promise.all(
      questions.map(async (question) => {
        return client.query(
          `
            INSERT INTO questions (id, type, title, options, answer, analysis, bank_id, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              type = VALUES(type),
              title = VALUES(title),
              options = VALUES(options),
              answer = VALUES(answer),
              analysis = VALUES(analysis),
              bank_id = VALUES(bank_id),
              created_by = VALUES(created_by);
          `,
          [question.id, question.type, question.title, question.options, question.answer, question.analysis, question.bank_id, question.created_by],
        )
      }),
    )

    console.log(`Seeded ${insertedQuestions.length} banks`)

    return {
      createTable,
      banks: insertedQuestions,
    }
  } catch (error) {
    console.error('Error seeding questions:', error)
    throw error
  }
}

async function seedRoles(client) {
  try {
    const [createTable] = await client.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(255) NULL,
        is_enabled BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP DEFAULT NULL,
        UNIQUE KEY unique_name (name)
      );
    `)

    console.log(`Created "roles" table`)

    // Insert data into the "banks" table
    const insertedRoles = await Promise.all(
      roles.map(async (role) => {
        return client.query(
          `
            INSERT INTO roles (id, name, description, is_enabled)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              name = VALUES(name),
              description = VALUES(description);
          `,
          [role.id, role.name, role.description, role.is_enabled],
        )
      }),
    )

    console.log(`Seeded ${insertedRoles.length} roles`)

    return {
      createTable,
      banks: insertedRoles,
    }
  } catch (error) {
    console.error('Error seeding roles:', error)
    throw error
  }
}

async function main() {
  const client = await db.getConnection()

  await seedUsers(client)
  await seedBanks(client)
  await seedQuestions(client)
  await seedRoles(client)

  await client.release()
}

main().catch((err) => {
  console.error('An error occurred while attempting to seed the database:', err)
})
