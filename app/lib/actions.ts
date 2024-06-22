'use server'
import { z } from 'zod'
import db from '../../db/index'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { minify } from 'next/dist/build/swc'

const BankSchema = z.object({
  id: z.number(),
  name: z.string({
    invalid_type_error: 'Please enter a name.',
  }),
  description: z.string().optional(),
  createdBy: z.number({
    invalid_type_error: 'Please add a create user.',
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  updatedBy: z.number({
    invalid_type_error: 'Please add a update user.',
  }),
})
const CreateBank = BankSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updatedBy: true,
})
const UpdateBank = BankSchema.omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
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
  const { name, description, createdBy } = validatedFields.data

  try {
    await db.query(
      `
        INSERT INTO banks (name, description, created_by)
        VALUES (?, ?, ?)
      `,
      [name, description || null, createdBy],
    )
  } catch (error: any) {
    return {
      code: error.code || 0,
      errors: JSON.parse(JSON.stringify(error)),
      message: 'Database Error: Failed to Create Bank.',
    }
  }
  revalidatePath('/dashboard/bank/list')
  redirect('/dashboard/bank/list')
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

  const { name, description, updatedBy } = validatedFields.data

  try {
    await db.query(
      `
        UPDATE banks
        SET name = ?, description = ?, updated_by = ?
        WHERE id = ?;
      `,
      [name, description || null, updatedBy, id],
    )
  } catch (error: any) {
    return {
      code: error.code || 0,
      errors: JSON.parse(JSON.stringify(error)),
      message: 'Database Error: Failed to Update Bank.',
    }
  }
  revalidatePath('/dashboard/bank/list')
  redirect('/dashboard/bank/list')
}
