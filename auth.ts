import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { getUserByNameOrEmail, fetchUserRolesPermissions } from '@/app/lib/data'

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
  unstable_update,
} = NextAuth({
  // debug: true,
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          // .object({ email: z.string().email(), password: z.string().min(6) })
          .object({ name: z.string(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { name, password } = parsedCredentials.data
          try {
            const userRes: any = await getUserByNameOrEmail(name)
            if (!userRes || !userRes.length) return null
            const user = userRes[0]

            const passwordsMatch = await bcrypt.compare(password, user.password)
            if (passwordsMatch) {
              const { roles, permissions, permissionPaths, permissionNames } =
                await fetchUserRolesPermissions({ id: user.id })
              user.roles = roles
              user.permissions = permissions
              user.permissionPaths = permissionPaths
              user.permissionNames = permissionNames

              return user
            }

            console.log('Invalid credentials')
            return null
          } catch (error) {
            console.log('[error]-34', error)
            console.log(error)
          }
        }
      },
    }),
  ],
})
