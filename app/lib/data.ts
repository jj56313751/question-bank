import { toCamelCase } from './utils'
import db from '../../db/index'
import type { Page, BankList, QuestionList } from './types'

export async function fetchBanks({
  id,
  name,
  pageNumber = 1,
  pageSize = 999999,
}: { id?: number; name?: string } & Page): Promise<
  { total: number; list: BankList[] } | unknown
> {
  try {
    let sql = 'WHERE 1=1'

    if (id) {
      sql += ` AND bank.id = ${id}`
    }

    if (name) {
      sql += ` AND bank.name LIKE '%${name}%'`
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
  pageSize = 999999,
}: { bankId?: number; title?: string; type?: number } & Page): Promise<
  { total: number; list: QuestionList[] } | unknown
> {
  try {
    let sql = 'WHERE 1=1'

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

// export async function getUser(email: string) {
//   try {
//     const user = await sql`SELECT * FROM users WHERE email=${email}`
//     return user.rows[0] as User
//   } catch (error) {
//     console.error('Failed to fetch user:', error)
//     throw new Error('Failed to fetch user.')
//   }
// }
