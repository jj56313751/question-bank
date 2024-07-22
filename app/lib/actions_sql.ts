'use server'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import db from '../../db/index'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { QuestionList } from '@/app/lib/types'
import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import { intPassword } from '@/app/lib/constant'

function revalidateCurrentPath() {
  const redirectUrl = headers().get('x-request-url') || ''
  revalidatePath(redirectUrl)
  redirect(redirectUrl)
}

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

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  isEnabled: z
    .union([z.literal(0), z.literal(1)])
    .refine((val) => val === 0 || val === 1, {
      message: 'isEnabled must be either 0 or 1',
    }),
})

const CreateUser = UserSchema.omit({
  id: true,
  password: true,
})

const UpdateUser = UserSchema.omit({
  id: true,
  name: true,
  email: true,
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
    console.log('[error]-162', error)
    return {
      code: error.code || -1,
      message: error.message || 'Database Error: Failed to Create Bank.',
    }
  }
  revalidateCurrentPath()
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
      code: error.errno || -1,
      message: error.message || 'Database Error: Failed to Update Bank.',
    }
  }
  const redirectUrl = headers().get('x-request-url') || ''
  // console.log('[redirectUrl]-161', redirectUrl)
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
      code: error.errno || -1,
      message: error.message || 'Database Error: Failed to Create Question.',
    }
  }
  revalidateCurrentPath()
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
      code: error.errno || -1,
      message: error.message || 'Database Error: Failed to Update Question.',
    }
  }
  revalidateCurrentPath()
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
    await db.query(
      `
        UPDATE questions
        SET deleted_at = NOW(), deleted_by = ?
        WHERE id = ? AND bank_id = ?;
      `,
      [deletedBy, id, bankId],
    )
  } catch (error: any) {
    return {
      code: error.errno || -1,
      message: error.message || 'Database Error: Failed to Delete Question.',
    }
  }
  revalidateCurrentPath()
}

export async function importQuestions(bankId: number, data: any[]) {
  // TODO Add logged in userid
  const createdBy = 1

  const values = data.map((question) => {
    const { type, title, options, answer, analysis } = question
    return [type, title, options, answer, analysis, bankId, createdBy]
  })

  const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(',')

  const sql = `
    INSERT INTO questions 
    (type, title, options, answer, analysis, bank_id, created_by) 
    VALUES ${placeholders}
    ON DUPLICATE KEY UPDATE updated_by = VALUES(created_by);
  `

  try {
    await db.query(sql, values.flat())
  } catch (error: any) {
    console.log('[error]-307', error)
    return {
      code: error.errno || -1,
      message: error.message || 'Database Error: Failed to Import Question.',
    }
  }
  revalidateCurrentPath()
}

export async function authenticate(params: any) {
  try {
    await signIn('credentials', params)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}

export async function signOutAction() {
  try {
    await signOut()
  } catch (error) {
    console.log('[error]-339', error)
    if (error instanceof AuthError) {
      console.log('[error.type]-339', error.type)
    }
    throw error
  }
}

export async function createUser(formData: any) {
  const validatedFields = CreateUser.safeParse(formData)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User.',
    }
  }
  const { name, email, isEnabled } = validatedFields.data

  const hashedPassword = await bcrypt.hash(intPassword, 10)

  try {
    await db.query(
      `
        INSERT INTO users (name, email, password, is_enabled)
        VALUES (?, ?, ?, ?)
      `,
      [name, email, hashedPassword, isEnabled],
    )
  } catch (error: any) {
    return {
      code: error.errno || -1,
      message: error.message || 'Database Error: Failed to Create User.',
    }
  }
  revalidateCurrentPath()
}

export async function resetUserPassowrd(id: number) {
  if (id === 1) {
    return {
      code: -1,
      message: 'Admin User Password Cannot be Reset.',
    }
  }
  const hashedPassword = await bcrypt.hash(intPassword, 10)
  try {
    await db.query(
      `
        UPDATE users
        SET password = ?
        WHERE id = ?;
      `,
      [hashedPassword, id],
    )
  } catch (error: any) {
    return {
      code: error.errno || -1,
      message:
        error.message || 'Database Error: Failed to Reset User Password.',
    }
  }
  revalidateCurrentPath()
}

export async function updateUserStatus(id: number, isEnabled: number) {
  try {
    await db.query(
      `
        UPDATE users
        SET is_enabled = ?
        WHERE id = ?;
      `,
      [isEnabled, id],
    )
  } catch (error: any) {
    return {
      code: error.errno || -1,
      message: error.message || 'Database Error: Failed to Update User Status.',
    }
  }
  revalidateCurrentPath()
}

export async function updateUser(id: number, formData: any) {
  const validatedFields = UpdateUser.safeParse(formData)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update User.',
    }
  }
  const { password, isEnabled } = validatedFields.data

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await db.query(
      `
        UPDATE users
        SET password = ?, is_enabled = ?
        WHERE id = ?;
      `,
      [hashedPassword, isEnabled, id],
    )
  } catch (error: any) {
    return {
      code: error.errno || -1,
      message: error.message || 'Database Error: Failed to Update User.',
    }
  }
  revalidateCurrentPath()
}
