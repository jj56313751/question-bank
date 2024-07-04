'use server'
import { z } from 'zod'
import db from '../../db/index'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { QuestionList } from '@/app/lib/types'

const BankSchema = z.object({
  id: z.number(),
  name: z.string({
    required_error: 'name is required',
    invalid_type_error: 'name must be a string',
  }),
  description: z.string().optional(),
  isEnabled: z
    .union([z.literal(0), z.literal(1)])
    .refine((val) => val === 0 || val === 1, {
      message: 'isEnabled must be either 0 or 1',
    }),
  createdBy: z.number({
    required_error: 'createdBy is required',
    invalid_type_error: 'createdBy must be a number',
  }),
  updatedBy: z.number({
    required_error: 'updatedBy is required',
    invalid_type_error: 'updatedBy must be a number',
  }),
})
const CreateBank = BankSchema.omit({
  id: true,
  updatedBy: true,
})
const UpdateBank = BankSchema.omit({
  id: true,
  createdBy: true,
})

const QuestionSchema = z.object({
  id: z.number(),
  type: z.number({
    required_error: 'type is required',
    invalid_type_error: 'type must be a number',
  }),
  title: z.string({
    required_error: 'title is required',
    invalid_type_error: 'title must be a string',
  }),
  options: z.string({
    required_error: 'options is required',
    invalid_type_error: 'options must be a string',
  }),
  answer: z.string({
    required_error: 'answer is required',
    invalid_type_error: 'answer must be a string',
  }),
  analysis: z.string().optional(),
  bankId: z.number({
    required_error: 'bankId is required',
    invalid_type_error: 'bankId must be a number',
  }),
  createdBy: z.number({
    required_error: 'createdBy is required',
    invalid_type_error: 'createdBy must be a number',
  }),
  updatedBy: z.number({
    required_error: 'updatedBy is required',
    invalid_type_error: 'updatedBy must be a number',
  }),
  deletedBy: z.number({
    required_error: 'deletedBy is required',
    invalid_type_error: 'deletedBy must be a number',
  }),
})
const CreateQuestion = QuestionSchema.omit({
  id: true,
  updatedBy: true,
  deletedBy: true,
})
const UpdateQuestion = QuestionSchema.omit({
  id: true,
  bankId: true,
  createdBy: true,
  deletedBy: true,
})
const DeleteQuestion = QuestionSchema.pick({
  id: true,
  bankId: true,
  deletedBy: true,
})
const ImportQuestion = QuestionSchema.pick({
  bankId: true,
})

export async function createBank(formData: any) {
  // TODO Add logged in userid
  formData.createdBy = 1

  const validatedFields = CreateBank.safeParse(formData)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Bank.',
    }
  }
  const { name, description, isEnabled, createdBy } = validatedFields.data

  try {
    await db.query(
      `
        INSERT INTO banks (name, description, is_enabled, created_by)
        VALUES (?, ?, ?, ?)
      `,
      [name, description || null, isEnabled, createdBy],
    )
  } catch (error: any) {
    return {
      code: error.code || 0,
      errors: JSON.parse(JSON.stringify(error)),
      message: 'Database Error: Failed to Create Bank.',
    }
  }
  const redirectUrl = headers().get('x-request-url') || ''
  revalidatePath(redirectUrl)
  redirect(redirectUrl)
}

export async function updateBank(id: number, formData: any) {
  // TODO Add logged in userid
  formData.updatedBy = 1

  const validatedFields = UpdateBank.safeParse(formData)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Bank.',
    }
  }

  const { name, description, isEnabled, updatedBy } = validatedFields.data

  try {
    await db.query(
      `
        UPDATE banks
        SET name = ?, description = ?, is_enabled = ?, updated_by = ?
        WHERE id = ?;
      `,
      [name, description || null, isEnabled, updatedBy, id],
    )
  } catch (error: any) {
    return {
      code: error.code || 0,
      errors: JSON.parse(JSON.stringify(error)),
      message: 'Database Error: Failed to Update Bank.',
    }
  }
  const redirectUrl = headers().get('x-request-url') || ''
  revalidatePath(redirectUrl)
  redirect(redirectUrl)
}

export async function createQuestion(formData: any) {
  // TODO Add logged in userid
  formData.createdBy = 1

  const validatedFields = CreateQuestion.safeParse(formData)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Question.',
    }
  }
  const { type, title, options, answer, analysis, bankId, createdBy } =
    validatedFields.data

  try {
    await db.query(
      `
        INSERT INTO questions (
          type, 
          title, 
          options, 
          answer, 
          analysis, 
          bank_id, 
          created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [type, title, options, answer, analysis || null, bankId, createdBy],
    )
  } catch (error: any) {
    return {
      code: error.code || 0,
      errors: JSON.parse(JSON.stringify(error)),
      message: 'Database Error: Failed to Create Question.',
    }
  }
  const redirectUrl = headers().get('x-request-url') || ''
  revalidatePath(redirectUrl)
  redirect(redirectUrl)
}

export async function updateQuestion(id: number, formData: any) {
  // TODO Add logged in userid
  formData.updatedBy = 1

  const validatedFields = UpdateQuestion.safeParse(formData)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Question.',
    }
  }

  const { type, title, options, answer, analysis, updatedBy } =
    validatedFields.data

  try {
    await db.query(
      `
        UPDATE questions
        SET 
          type = ?, 
          title = ?, 
          options = ?, 
          answer = ?, 
          analysis = ?, 
          updated_by = ?
        WHERE id = ?;
      `,
      [type, title, options, answer, analysis || null, updatedBy, id],
    )
  } catch (error: any) {
    return {
      code: error.code || 0,
      errors: JSON.parse(JSON.stringify(error)),
      message: 'Database Error: Failed to Update Question.',
    }
  }
  const redirectUrl = headers().get('x-request-url') || ''
  revalidatePath(redirectUrl)
  redirect(redirectUrl)
}

export async function deleteQuestion(id: number, bankId: number) {
  // TODO Add logged in userid
  const deletedBy = 1

  const validatedFields = DeleteQuestion.safeParse({
    id,
    bankId,
    deletedBy,
  })
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Delete Question.',
    }
  }

  try {
    await db.query(`
      UPDATE questions
      SET deleted_at = NOW(), deleted_by = ${deletedBy}
      WHERE id = ${id} AND bank_id = ${bankId};
    `)
  } catch (error: any) {
    return {
      code: error.code || 0,
      errors: JSON.parse(JSON.stringify(error)),
      message: 'Database Error: Failed to Delete Question.',
    }
  }
  const redirectUrl = headers().get('x-request-url') || ''
  revalidatePath(redirectUrl)
  redirect(redirectUrl)
}

export async function importQuestions(bankId: number, data: any[]) {
  // TODO Add logged in userid
  const createdBy = 1

  let sql = `INSERT INTO questions 
              (type, title, options, answer, analysis, bank_id, created_by) 
              VALUES `

  data.forEach((question, index) => {
    const { type, title, options, answer, analysis } = question

    sql += `(${type}, ${title ? `'${title}'` : null}, ${options ? `'${options}'` : null}, ${answer ? `'${answer}'` : null}, ${analysis ? `'${analysis}'` : null}, ${bankId}, ${createdBy})`
    if (index < data.length - 1) {
      sql += ','
    }
  })

  sql += ` ON DUPLICATE KEY UPDATE updated_by = VALUES(created_by);`
  // console.log('sql', sql)

  try {
    await db.query(sql)
  } catch (error: any) {
    console.log('[error]-307', error)
    return {
      code: error.code || 0,
      errors: JSON.parse(JSON.stringify(error)),
      message: 'Database Error: Failed to Import Question.',
    }
  }
  const redirectUrl = headers().get('x-request-url') || ''
  revalidatePath(redirectUrl)
  redirect(redirectUrl)
}
