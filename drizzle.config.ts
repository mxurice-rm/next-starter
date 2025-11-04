import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    host: process.env.POSTGRES_HOST || 'next-database',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    database: process.env.PG_DATABASE || 'next',
    user: process.env.POSTGRES_USER || 'next',
    password: process.env.POSTGRES_PASSWORD || 'next',
    ssl: false,
  },
})
