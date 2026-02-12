import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  server: {
    POSTGRES_HOST: z.string().default('localhost'),
    POSTGRES_PORT: z.coerce.number().default(5432),
    POSTGRES_DATABASE: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    BETTER_AUTH_SECRET: z.string().min(32),
    RESEND_API_KEY: z.string().startsWith('re_'),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.url(),
  },
  runtimeEnv: {
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})
