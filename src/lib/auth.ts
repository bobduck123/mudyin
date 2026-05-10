import type { AuthOptions, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/db'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { adminProfile: true },
        })

        if (!user || !user.password) {
          throw new Error('No user found with this email')
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        if (user.adminProfile?.status === 'active') {
          await prisma.adminProfile.update({
            where: { id: user.adminProfile.id },
            data: { lastLoginAt: new Date() },
          })
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          adminRole: user.adminProfile?.status === 'active' ? user.adminProfile.role : null,
          adminStatus: user.adminProfile?.status ?? null,
          mustChangePassword: user.adminProfile?.status === 'active' ? user.adminProfile.mustChangePassword : false,
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
    newUser: '/auth/register',
  },
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT
      user?:
        | {
            id: string
            adminRole?: string | null
            adminStatus?: string | null
            mustChangePassword?: boolean | null
          }
        | null
    }) {
      if (user) {
        token.id = user.id
        token.adminRole = user.adminRole
        token.adminStatus = user.adminStatus
        token.mustChangePassword = user.mustChangePassword
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        const sessionUser = session.user as {
          id?: string
          adminRole?: string | null
          adminStatus?: string | null
          mustChangePassword?: boolean | null
        }
        sessionUser.id = token.id as string
        sessionUser.adminRole = token.adminRole as string | null
        sessionUser.adminStatus = token.adminStatus as string | null
        sessionUser.mustChangePassword = token.mustChangePassword as boolean | null
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}
