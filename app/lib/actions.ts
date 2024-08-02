'use server'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { signIn, signOut, auth } from '@/auth'
import { AuthError } from 'next-auth'
import { intPassword } from '@/app/lib/constant'
import prisma from '@/app/lib/prisma'

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
  description: z.string().nullable().optional(),
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
  analysis: z.string().nullable().optional(),
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
  title: true,
  createdBy: true,
})

const UserSchema = z.object({
  id: z.number(),
  name: z.string({
    required_error: 'name is required',
    invalid_type_error: 'name must be a string',
  }),
  email: z.string({
    required_error: 'email is required',
    invalid_type_error: 'email must be a string',
  }),
  password: z.string({
    required_error: 'password is required',
    invalid_type_error: 'password must be a string',
  }),
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

const RoleSchema = z.object({
  id: z.number(),
  name: z.string({
    required_error: 'name is required',
    invalid_type_error: 'name must be a string',
  }),
  description: z.string({
    required_error: 'description is required',
    invalid_type_error: 'description must be a string',
  }),
  isEnabled: z
    .union([z.literal(0), z.literal(1)])
    .refine((val) => val === 0 || val === 1, {
      message: 'isEnabled must be either 0 or 1',
    }),
})

const CreateRole = RoleSchema.omit({ id: true })

const UpdateRole = RoleSchema.omit({ id: true })

const PermissionSchema = z.object({
  id: z.number(),
  parentId: z.number().nullable().optional(),
  type: z.number(),
  isMenu: z
    .union([z.literal(0), z.literal(1)])
    .refine((val) => val === 0 || val === 1, {
      message: 'isEnabled must be either 0 or 1',
    }),
  name: z.string({
    required_error: 'name is required',
    invalid_type_error: 'name must be a string',
  }),
  permission: z.string({
    required_error: 'permission is required',
    invalid_type_error: 'permission must be a string',
  }),
  path: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  sort: z.number().nullable().optional(),
})

const CreatePermission = PermissionSchema.omit({ id: true })

const UpdatePermission = PermissionSchema.omit({ id: true })

const RolePermissionsSchema = z.object({
  id: z.number(),
  roleId: z.number(),
  permissionId: z.number(),
})

export async function createBank(formData: any) {
  const session = await auth()
  // Add logged in userid
  formData.createdBy = session && ((session.user as any).id as number)

  const validatedFields = CreateBank.safeParse(formData)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Bank.',
    }
  }
  const { name, description, isEnabled, createdBy } = validatedFields.data

  try {
    await prisma.banks.create({
      data: {
        name,
        description,
        isEnabled,
        createdBy,
      },
    })
  } catch (error: any) {
    return {
      code: error.code || -1,
      message: error.message || 'Database Error: Failed to Create Bank.',
    }
  }
  revalidateCurrentPath()
}

export async function updateBank(id: number, formData: any) {
  const session = await auth()
  // Add logged in userid
  formData.updatedBy = session && ((session.user as any).id as number)

  const validatedFields = UpdateBank.safeParse(formData)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Bank.',
    }
  }

  const { name, description, isEnabled, updatedBy } = validatedFields.data

  try {
    await prisma.banks.update({
      where: { id },
      data: {
        name,
        description,
        isEnabled,
        updatedBy,
      },
    })
  } catch (error: any) {
    return {
      code: error.code || -1,
      message: error.message || 'Database Error: Failed to Update Bank.',
    }
  }
  const redirectUrl = headers().get('x-request-url') || ''
  // console.log('[redirectUrl]-161', redirectUrl)
  revalidatePath(redirectUrl)
  redirect(redirectUrl)
}

export async function createQuestion(formData: any) {
  const session = await auth()
  // Add logged in userid
  formData.createdBy = session && ((session.user as any).id as number)

  const validatedFields = CreateQuestion.safeParse(formData)
  // console.log('[validatedFields]-207', validatedFields)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Question.',
    }
  }
  const { type, title, options, answer, analysis, bankId, createdBy } =
    validatedFields.data

  try {
    await prisma.questions.create({
      data: {
        type,
        title,
        options,
        answer,
        analysis,
        bankId,
        createdBy,
      },
    })
  } catch (error: any) {
    return {
      code: error.code || -1,
      message: error.message || 'Database Error: Failed to Create Question.',
    }
  }
  revalidateCurrentPath()
}

export async function updateQuestion(id: number, formData: any) {
  const session = await auth()
  // Add logged in userid
  formData.updatedBy = session && ((session.user as any).id as number)

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
    await prisma.questions.update({
      where: { id },
      data: {
        type,
        title,
        options,
        answer,
        analysis,
        updatedBy,
      },
    })
  } catch (error: any) {
    return {
      code: error.code || -1,
      message: error.message || 'Database Error: Failed to Update Question.',
    }
  }
  revalidateCurrentPath()
}

export async function deleteQuestion(id: number, bankId: number) {
  const session = await auth()
  // Add logged in userid
  const deletedBy = session && ((session.user as any).id as number)

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
    await prisma.questions.update({
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
      where: { id, bankId },
    })
  } catch (error: any) {
    return {
      code: error.code || -1,
      message: error.message || 'Database Error: Failed to Delete Question.',
    }
  }
  revalidateCurrentPath()
}

export async function importQuestions(bankId: number, data: any[]) {
  const session = await auth()
  // Add logged in userid
  const createdBy: any = session && ((session.user as any).id as number)
  const upsertOperations: any[] = []

  data.forEach((question: any) => {
    const validatedFields = ImportQuestion.safeParse({
      ...question,
      bankId,
      createdBy,
    })
    if (validatedFields.success) {
      upsertOperations.push(
        prisma.questions.upsert({
          where: {
            unique_question_title_bank_id: {
              title: question.title,
              bankId: bankId,
            },
          },
          update: {
            updatedBy: createdBy,
            type: question.type,
            title: question.title,
            options: question.options,
            answer: question.answer,
            analysis: question.analysis,
          },
          create: {
            type: question.type,
            title: question.title,
            options: question.options,
            answer: question.answer,
            analysis: question.analysis,
            bankId: bankId,
            createdBy: createdBy,
          },
        }),
      )
    }
  })

  try {
    const res = await prisma.$transaction(upsertOperations)
    // await db.query(sql, values.flat())
  } catch (error: any) {
    console.log('[error]-307', error)
    return {
      code: error.code || -1,
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
    await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isEnabled,
      },
    })
  } catch (error: any) {
    return {
      code: error.code || -1,
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
    await prisma.users.update({
      where: { id },
      data: { password: hashedPassword },
    })
  } catch (error: any) {
    return {
      code: error.code || -1,
      message:
        error.message || 'Database Error: Failed to Reset User Password.',
    }
  }
  revalidateCurrentPath()
}

export async function createRole(formData: any) {
  const validatedFields = CreateRole.safeParse(formData)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Role.',
    }
  }
  const { name, description, isEnabled } = validatedFields.data

  try {
    await prisma.roles.create({
      data: {
        name,
        description,
        isEnabled,
      },
    })
  } catch (error: any) {
    return {
      code: error.code || -1,
      message: error.message || 'Database Error: Failed to Create Role.',
    }
  }
  revalidateCurrentPath()
}

export async function updateRole(id: number, formData: any) {
  const validatedFields = UpdateRole.safeParse(formData)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Role.',
    }
  }

  const { name, description, isEnabled } = validatedFields.data

  try {
    await prisma.roles.update({
      where: { id },
      data: {
        name,
        description,
        isEnabled,
      },
    })
  } catch (error: any) {
    return {
      code: error.code || -1,
      message: error.message || 'Database Error: Failed to Update Role.',
    }
  }
  revalidateCurrentPath()
}

export async function createPermission(formData: any) {
  const validatedFields = CreatePermission.safeParse(formData)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Permission.',
    }
  }
  const { parentId, type, isMenu, name, permission, path, icon, sort } =
    validatedFields.data

  try {
    await prisma.permissions.create({
      data: {
        parentId,
        type,
        isMenu,
        name,
        permission,
        path,
        icon,
        sort,
      },
    })
  } catch (error: any) {
    return {
      code: error.code || -1,
      message: error.message || 'Database Error: Failed to Create Permission.',
    }
  }
  revalidateCurrentPath()
}

export async function updatePermission(id: number, formData: any) {
  const validatedFields = UpdatePermission.safeParse(formData)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Permission.',
    }
  }

  const { parentId, type, isMenu, name, permission, path, icon, sort } =
    validatedFields.data

  try {
    await prisma.permissions.update({
      where: { id },
      data: {
        parentId,
        type,
        isMenu,
        name,
        permission,
        path,
        icon,
        sort,
      },
    })
  } catch (error: any) {
    return {
      code: error.code || -1,
      message: error.message || 'Database Error: Failed to Update Permission.',
    }
  }
  revalidateCurrentPath()
}

export async function updateRolePermissions(
  roleId: number,
  permissionIds: number[],
) {
  const operations: any[] = [
    prisma.rolePermissions.deleteMany({
      where: {
        roleId,
      },
    }),
  ]
  permissionIds.forEach((permissionId) => {
    operations.push(
      prisma.rolePermissions.create({
        data: {
          roleId,
          permissionId,
        },
      }),
    )
  })

  try {
    const res = await prisma.$transaction(operations)
  } catch (error: any) {
    return {
      code: error.code || -1,
      message:
        error.message || 'Database Error: Failed to Update Role Permissions.',
    }
  }
  revalidateCurrentPath()
}
