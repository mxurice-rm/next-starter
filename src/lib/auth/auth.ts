import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { admin, openAPI } from 'better-auth/plugins'

import { env } from '@/env'
import { database } from '@/lib/database'
import { account, session, user, verification } from '@/lib/database/schema'

const allowedHosts = [
  'localhost:3000',
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_APP_URL
    : undefined,
].filter((host): host is string => Boolean(host))

export const auth = betterAuth({
  baseURL: {
    allowedHosts,
    fallback: env.NEXT_PUBLIC_APP_URL,
    protocol: process.env.NODE_ENV === 'development' ? 'http' : 'https',
  },
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
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
  plugins: [
    nextCookies(),
    admin(),
    ...(process.env.NODE_ENV !== 'production' ? [openAPI()] : []),
  ],
})
