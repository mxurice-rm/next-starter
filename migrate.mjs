import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import pg from 'pg'

const pool = new pg.Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
})

try {
  const db = drizzle(pool)
  await migrate(db, { migrationsFolder: './drizzle' })
  console.log('Migrations completed successfully')
} catch (error) {
  console.error('Migration failed:', error)
  process.exit(1)
} finally {
  await pool.end()
}
