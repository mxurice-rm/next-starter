import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    host: process.env.PG_HOST || 'next-database',
    port: parseInt(process.env.PG_PORT || '5432', 10),
    database: process.env.PG_DATABASE || 'next',
    user: process.env.PG_USER || 'next',
    password: process.env.PG_PASSWORD || 'next',
    ssl: false,
  },
})
