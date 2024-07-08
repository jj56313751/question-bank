import NextAuth from 'next-auth'
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { getUser } from '@/app/lib/data'

export const { handlers, signIn, signOut, auth } = NextAuth({
  // debug: true,
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          try {
            const userRes: any = await getUser(email)
            if (!userRes || !userRes.length) return null
            const user = userRes[0]

            const passwordsMatch = await bcrypt.compare(password, user.password)
            if (passwordsMatch) return user

            console.log('Invalid credentials')
            return null
          } catch(error) {
            console.log('[error]-34', error)
            console.log(error)
          }
        }
      },
    }),
  ],
})
