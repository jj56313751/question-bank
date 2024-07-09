// import { toCamelCase } from './utils'
import db from '../../db/index'
import type { Page, BankList, QuestionList, UserList } from './types'

export async function fetchBanks({
  id,
  name,
  isEnabled,
  pageNumber = 1,
  pageSize = 10,
}: { id?: number; name?: string; isEnabled?: number } & Page): Promise<
  { total: number; list: BankList[] } | unknown
> {
  try {
    let sql = 'WHERE deleted_at IS NULL'

    if (id !== undefined) {
      sql += ` AND bank.id = ${id}`
    }

    if (name !== undefined) {
      sql += ` AND bank.name LIKE '%${name}%'`
    }

    if (isEnabled !== undefined) {
      sql += ` AND bank.is_enabled = ${isEnabled}`
    }

    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total_count FROM banks bank ${sql}`,
    )

    const offset = (pageNumber - 1) * pageSize
    const limit = pageSize

    const [rows] = await db.query(`
      SELECT 
        bank.id,
        bank.name,
        bank.description,
        bank.is_enabled isEnabled,
        bank.created_by createdBy,
        bank.created_at createdAt,
        bank.updated_at updatedAt,
        bank.updated_by updatedBy,
        IFNULL(question.questions_count, 0) AS total
      FROM 
        banks bank
      LEFT JOIN (
        SELECT 
          bank_id, 
          COUNT(*) AS questions_count
        FROM 
          questions
        WHERE deleted_at IS NULL
        GROUP BY 
          bank_id
      ) question ON bank.id = question.bank_id
      ${sql}
      ORDER BY 
        bank.id
      LIMIT ${limit} OFFSET ${offset}
    `)

    return {
      total: (countRows as any[])[0].total_count,
      list: rows as BankList[],
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch banks data.')
  }
}

export async function fetchQuestionsByBankId(
  id: number,
): Promise<QuestionList[] | unknown> {
  try {
    const [rows] = await db.query(`
      SELECT 
        id,
        type,
        title,
        options,
        answer,
        analysis,
        bank_id bankId,
        created_by createdBy,
        created_at createdAt,
        updated_at updatedAt,
        updated_by updatedBy
      FROM questions
      WHERE bank_id = ${id}
    `)
    return rows as QuestionList[]
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetchQuestionsByBankId.')
  }
}

export async function fetchQuestions({
  bankId,
  title,
  type,
  pageNumber = 1,
  pageSize = 10,
}: { bankId?: number; title?: string; type?: number } & Page): Promise<
  { total: number; list: QuestionList[] } | unknown
> {
  try {
    let sql = 'WHERE deleted_at IS NULL'

    if (bankId) {
      sql += ` AND bank_id = ${bankId}`
    }

    if (title) {
      sql += ` AND (title LIKE '%${title}%' OR options LIKE '%${title}%')`
    }

    if (type) {
      sql += ` AND type = ${type}`
    }

    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total_count FROM questions ${sql}`,
    )

    const offset = (pageNumber - 1) * pageSize
    const limit = pageSize
    const [rows] = await db.query(`
      SELECT 
        id,
        type,
        title,
        options,
        answer,
        analysis,
        bank_id bankId,
        created_by createdBy,
        created_at createdAt,
        updated_at updatedAt,
        updated_by updatedBy
      FROM questions
      ${sql}
      ORDER BY id
      LIMIT ${limit} OFFSET ${offset}
    `)
    return {
      total: (countRows as any)[0].total_count,
      list: rows as QuestionList[],
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetchQuestions.')
  }
}

export async function getUser(email: string): Promise<UserList[] | unknown> {
  try {
    const [rows] = await db.query(`
      SELECT 
        id,
        name,
        email,
        password
      FROM users WHERE email='${email}'`)
    return rows as UserList[]
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
}
