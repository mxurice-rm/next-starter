# 🚀 Next.js Starter Template

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0.1-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/PostgreSQL-Latest-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</div>

<div align="center">
  <h3>A production-ready Next.js starter template with modern tech stack</h3>
  <p>Fully configured with authentication, database, Docker, and developer experience tools</p>
</div>

---

## ✨ Features

### 🎯 Core Technologies
- **[Next.js 16](https://nextjs.org/)** - The React framework for production
- **[React 19](https://react.dev/)** - Latest React with new features and performance optimizations
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and enhanced developer experience
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework

### 🔐 Authentication & Database
- **[Better Auth](https://better-auth.com/)** - Modern and secure authentication solution
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe SQL ORM for TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Robust and scalable database

### 🛠️ Development Tools
- **[Docker & Docker Compose](https://www.docker.com/)** - Containerized development environment
- **[ESLint](https://eslint.org/)** & **[Prettier](https://prettier.io/)** - Code quality and formatting
- **[Husky](https://typicode.github.io/husky/)** & **[Lint-staged](https://github.com/okonet/lint-staged)** - Git hooks for automatic code checking
- **[Commitlint](https://commitlint.js.org/)** - Conventional commit messages
- **[Adminer](https://www.adminer.org/)** - Database management UI

## 📦 Installation

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **pnpm** or **yarn**
- **Docker** & **Docker Compose**
- **Git**

### 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/next-starter.git
   cd next-starter
   ```

2. **Run automatic installation**
   ```bash
   chmod +x initialize.sh
   ./initialize.sh
   ```

   The script automatically performs these steps:
   - ✅ Installs all NPM packages
   - ✅ Creates `.env` file from template
   - ✅ Generates secure authentication secret
   - ✅ Starts PostgreSQL database in Docker
   - ✅ Initializes database schema

3. **Start development server**
   ```bash
   npm run dev
   ```

   The application is now available at:
   - 🌐 **Next.js App**: [http://localhost:3000](http://localhost:3000)
   - 🗄️ **Adminer (DB UI)**: [http://localhost:8080](http://localhost:8080)

### 🔧 Manual Installation

If you prefer manual installation:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.sample .env
   ```

   Generate a secure secret:
   ```bash
   openssl rand -base64 32
   ```

   Add the generated value to your `.env` file:
   ```env
   BETTER_AUTH_SECRET=your-generated-secret
   ```

3. **Start database**
   ```bash
   docker-compose up -d database
   ```

4. **Initialize database schema**
   ```bash
   npx drizzle-kit push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
next-starter/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes
│   │   │   └── auth/           # Auth endpoints
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── database/               # Database configuration
│   │   ├── schema/             # Drizzle schema definitions
│   │   │   ├── auth-schema.ts  # Auth tables
│   │   │   └── index.ts        # Schema exports
│   │   └── index.ts            # DB connection
│   └── lib/                    # Utility functions
│       ├── auth/               # Auth configuration
│       │   ├── auth-client.ts  # Client auth
│       │   └── auth.ts         # Server auth
│       └── utils.ts            # Helper functions
├── .husky/                     # Git hooks
├── docker-compose.yml          # Docker services
├── drizzle.config.ts          # Drizzle ORM config
├── next.config.ts             # Next.js config
├── components.json            # Component config
└── initialize.sh              # Setup script
```

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server

# Build & Production
npm run build           # Create production build
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # ESLint with auto-fix
npm run format:check    # Check Prettier formatting
npm run format:write    # Format code
npm run typecheck       # TypeScript type checking

# Database
npx drizzle-kit push    # Push schema to database
npx drizzle-kit studio  # Open Drizzle Studio
npx drizzle-kit generate # Generate migrations
```

## 🐳 Docker Services

The project uses Docker Compose for the development environment:

### Managing Services

```bash
# Start all services
docker-compose up -d

# Start database only
docker-compose up -d database

# Stop services
docker-compose down

# Remove services and volumes
docker-compose down -v

# View logs
docker-compose logs -f [service-name]

# Check container status
docker-compose ps
```

### Available Services

| Service | Port | Description |
|---------|------|-------------|
| `nextjs` | 3000 | Next.js application |
| `database` | 5432 | PostgreSQL database |
| `adminer` | 8080 | Database management UI |

## 🔐 Environment Variables

The `.env.sample` file contains all required environment variables:

```env
# Database configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=nextjs_db

# Authentication
BETTER_AUTH_SECRET=  # Will be generated by initialize.sh

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🛡️ Authentication

The project uses Better Auth for authentication:

### Features
- ✅ Session-based authentication
- ✅ Secure cookie management
- ✅ Type-safe auth hooks
- ✅ Server-side & client-side auth

### Usage

```typescript
// Client Component
import { authClient } from '@/lib/auth/auth-client'

// Sign in
await authClient.signIn.email({
  email: "user@example.com",
  password: "password"
})

// Sign out
await authClient.signOut()

// Get session
const session = await authClient.getSession()
```

```typescript
// Server Component
import { auth } from '@/lib/auth/auth'

// Get session in Server Components
const session = await auth.api.getSession({
  headers: await headers()
})
```

## 💾 Database

### Drizzle ORM

The project uses Drizzle ORM for type-safe database access:

```typescript
// Define schema
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow()
})

// Queries
import { db } from '@/database'
import { users } from '@/database/schema'

// Select
const allUsers = await db.select().from(users)

// Insert
await db.insert(users).values({
  id: 'user-1',
  email: 'user@example.com',
  name: 'John Doe'
})
```

### Migrations

```bash
# Generate new migration
npx drizzle-kit generate

# Run migrations
npx drizzle-kit migrate

# Push schema directly (development)
npx drizzle-kit push
```

## 📦 Deployment

### Production Build

```bash
# Create build
npm run build

# Start production server
npm run start
```

### Docker Deployment

```bash
# Build production image
docker build -f next.Dockerfile -t next-starter .

# Run container
docker run -p 3000:3000 --env-file .env next-starter
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.