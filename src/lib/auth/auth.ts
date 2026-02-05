import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { database } from '@/lib/database'
import { account, session, user, verification } from '@/lib/database/schema'
import { nextCookies } from 'better-auth/next-js'
import { admin, openAPI } from 'better-auth/plugins'

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  database: drizzleAdapter(database, {
    provider: 'pg',
    schema: {
      session,
      user,
      account,
      verification,
    },
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: false,
    },
  },
  advanced: {
    cookiePrefix: 'next',
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies(), openAPI(), admin()],
})
