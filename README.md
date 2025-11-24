# 🚀 Next.js Starter Template

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0.1-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  <div>
    <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/Docker-336791?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  </div>
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

## 📦 Local Development Setup

### Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 10.0.0
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
   ./scripts/initialize.sh
   ```

   The script automatically performs these steps:
   - ✅ Installs all packages with pnpm
   - ✅ Creates `.env` file from template
   - ✅ Generates secure authentication secret
   - ✅ Starts PostgreSQL database in Docker
   - ✅ Generates and applies database migrations

3. **Start development server**
   ```bash
   pnpm run dev
   ```

   The application is now available at:
   - 🌐 **Next.js App**: [http://localhost:3000](http://localhost:3000)
   - 🗄️ **Adminer (DB UI)**: [http://localhost:8080](http://localhost:8080)

### 🔧 Manual Installation

If you prefer manual installation:

1. **Install dependencies**
   ```bash
   pnpm install
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
   docker compose up -d postgres
   ```

4. **Generate and apply migrations**
   ```bash
   pnpm run db:generate
   pnpm run db:migrate
   ```

5. **Start development server**
   ```bash
   pnpm run dev
   ```

## 🚢 Production Deployment

This template includes automated deployment scripts for production environments with full Docker containerization.

### Deployment Prerequisites

- **Docker** & **Docker Compose** installed on server
- **Domain name** configured (for SSL profile)
- **SSL certificates** (for SSL profile, e.g., via Let's Encrypt)

### 🎯 Deployment Profiles

The deployment script supports two NGINX profiles:

#### **`internal` Profile** - Behind Reverse Proxy
Use when you have a reverse proxy (Traefik, Caddy, Cloudflare Tunnel, etc.) handling SSL:
- ✅ HTTP only (port 80)
- ✅ No SSL configuration needed
- ✅ Ideal for microservices architecture

#### **`ssl` Profile** - Direct SSL Management
Use when NGINX directly manages SSL certificates:
- ✅ HTTPS with SSL/TLS (ports 80, 443)
- ✅ Automatic HTTP to HTTPS redirect
- ✅ Let's Encrypt ready
- ⚠️ Requires domain configuration

### 🚀 Quick Production Deployment

**First time deployment:**

```bash
# Interactive mode (recommended for first deployment)
./scripts/deploy.sh

# Or with parameters
./scripts/deploy.sh --profile internal
./scripts/deploy.sh --profile ssl
```

**The deployment script will:**
1. ✅ Verify Docker Compose installation
2. ✅ Initialize project (install packages, setup .env)
3. ✅ Configure database connection for Docker network
4. ✅ Prompt for profile selection (internal or ssl)
5. ✅ For SSL: Prompt for domain configuration
6. ✅ Build and start all containers

### 📝 Deployment Script Options

```bash
./scripts/deploy.sh [OPTIONS]

Options:
  --profile <internal|ssl>   Specify NGINX profile
  --rebuild                  Force rebuild of Docker images
  --init                     Force reinitialization of project
```

**Examples:**

```bash
# Deploy with internal profile (behind reverse proxy)
./scripts/deploy.sh --profile internal

# Deploy with SSL profile (direct SSL management)
./scripts/deploy.sh --profile ssl

# Force rebuild after code changes
./scripts/deploy.sh --profile internal --rebuild

# Reinitialize and deploy
./scripts/deploy.sh --profile ssl --init --rebuild
```

### 🔐 SSL Configuration

When using the `ssl` profile for the first time, the script will:

1. **Detect placeholder `{{DOMAIN}}`** in nginx configuration
2. **Prompt for domain** (e.g., `example.com`)
3. **Automatically replace** all placeholders with your domain

**⚠️ Important:** When using the SSL profile, you must obtain SSL certificates using Certbot before deployment. The NGINX configuration expects certificates to be available at `/etc/letsencrypt/live/{{DOMAIN}}/`.

### 🛑 Managing Production Containers

**Stop production deployment:**

```bash
# Interactive mode
./scripts/stop.sh

# Or with profile parameter
./scripts/stop.sh --profile internal
./scripts/stop.sh --profile ssl
```

**View running containers:**

```bash
docker compose -f docker-compose.prod.yml ps
```

**View logs:**

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f nextjs
docker compose -f docker-compose.prod.yml logs -f nginx-internal
```

### 🔄 Updating Production

After code changes:

```bash
# Pull latest changes
git pull origin main

# Redeploy with rebuild
./scripts/deploy.sh --profile internal --rebuild
```

### 🏗️ Production Architecture

**Internal Profile (with external reverse proxy):**
```
Internet → Reverse Proxy (SSL) → NGINX (Port 80) → Next.js (Port 3000)
                                       ↓
                                 PostgreSQL (Port 5432)
```

**SSL Profile (direct SSL):**
```
Internet → NGINX (Ports 80/443 with SSL) → Next.js (Port 3000)
                        ↓
                  PostgreSQL (Port 5432)
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
├── scripts/                    # Automation scripts
│   ├── initialize.sh           # Local setup script
│   ├── deploy.sh               # Production deployment script
│   └── stop.sh                 # Stop production containers
├── nginx/                      # NGINX configurations
│   ├── nginx.internal.conf     # Internal profile (behind proxy)
│   └── nginx.ssl.conf          # SSL profile (direct SSL)
├── drizzle/                    # Database migrations
├── .husky/                     # Git hooks
├── docker-compose.yml          # Development services
├── docker-compose.prod.yml     # Production services
├── drizzle.config.ts           # Drizzle ORM config
├── next.config.ts              # Next.js config
├── next.Dockerfile             # Next.js production image
└── components.json             # Component config
```

## 📝 Available Scripts

### Development Scripts

```bash
# Development Server
pnpm run dev              # Start development server

# Code Quality
pnpm run lint            # Run ESLint
pnpm run lint:fix        # ESLint with auto-fix
pnpm run format:check    # Check Prettier formatting
pnpm run format:write    # Format code
pnpm run typecheck       # TypeScript type checking

# Database
pnpm run db:push         # Push schema to database (development)
pnpm run db:generate     # Generate migrations
pnpm run db:migrate      # Apply migrations
pnpm exec drizzle-kit studio  # Open Drizzle Studio
```

### Deployment Scripts

```bash
# Local Setup
./scripts/initialize.sh                    # Full setup with database
./scripts/initialize.sh --skip-db          # Setup without database

# Production Deployment
./scripts/deploy.sh                        # Interactive deployment
./scripts/deploy.sh --profile internal     # Deploy with internal profile
./scripts/deploy.sh --profile ssl          # Deploy with SSL profile
./scripts/deploy.sh --rebuild              # Force rebuild images
./scripts/deploy.sh --init                 # Force reinitialization

# Stop Production
./scripts/stop.sh                          # Interactive stop
./scripts/stop.sh --profile internal       # Stop internal profile
./scripts/stop.sh --profile ssl            # Stop SSL profile
```

## 🐳 Docker Services

### Development Services (`docker-compose.yml`)

The project uses Docker Compose for the development environment:

```bash
# Start all services
docker compose up -d

# Start database only
docker compose up -d postgres

# Stop services
docker compose down

# Remove services and volumes
docker compose down -v

# View logs
docker compose logs -f [service-name]

# Check container status
docker compose ps
```

**Available Services:**

| Service | Port | Description |
|---------|------|-------------|
| `nextjs` | 3000 | Next.js application (development) |
| `postgres` | 5432 | PostgreSQL database |
| `adminer` | 8080 | Database management UI |

### Production Services (`docker-compose.prod.yml`)

Managed via deployment scripts (see [Production Deployment](#-production-deployment))

**Available Services:**

| Service | Port | Profile | Description |
|---------|------|---------|-------------|
| `nextjs` | 3000 | all | Next.js application (production) |
| `postgres` | 5432 | all | PostgreSQL database |
| `nginx-internal` | 80 | internal | NGINX reverse proxy (HTTP only) |
| `nginx-ssl` | 80, 443 | ssl | NGINX reverse proxy (with SSL) |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.