# 🚀 Next.js Starter Template

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  <div>
    <img src="https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
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
   git clone https://github.com/yourusername/maxam-haustechnik.git
   cd maxam-haustechnik
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

This template supports two deployment methods: **manual deployment** (clone repo on server) and **automated deployment** via GitHub Actions CI/CD.

### Deployment Prerequisites

- **Docker** & **Docker Compose** installed on server
- **Domain name** configured (for SSL profile)
- **SSL certificates** (for SSL profile, e.g., via Let's Encrypt)

### 🎯 Deployment Profiles

The deployment script supports two NGINX profiles:

#### **`internal` Profile** - Behind Reverse Proxy
Use when you have a reverse proxy (Traefik, Caddy, Cloudflare Tunnel, etc.) handling SSL:
- ✅ HTTP only (proxied through external reverse proxy)
- ✅ No SSL configuration needed
- ✅ Ideal for microservices architecture

#### **`ssl` Profile** - Direct SSL Management
Use when NGINX directly manages SSL certificates:
- ✅ HTTPS with SSL/TLS (ports 80, 443)
- ✅ Automatic HTTP to HTTPS redirect
- ✅ Let's Encrypt ready
- ⚠️ Requires domain configuration (see [SSL Configuration](#-ssl-configuration))

### 🔐 SSL Configuration

When using the `ssl` profile, you must replace all `{{DOMAIN}}` placeholders in `nginx/nginx.ssl.conf` with your actual domain **before deploying**:

```bash
sed -i 's|{{DOMAIN}}|example.com|g' nginx/nginx.ssl.conf
```

Commit the change so it's available for both manual and automated deployments.

The deployment script validates that no unresolved `{{DOMAIN}}` placeholders remain and will abort if any are found.

**SSL certificates** must be obtained via Certbot before deployment. The NGINX configuration expects certificates at `/etc/letsencrypt/live/<domain>/`.

---

### Option 1: Manual Deployment (Clone Repo)

Clone the full repository on the server and run the deployment script locally.

**First time deployment:**

```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo
./scripts/deploy.sh
```

**The deployment script will:**
1. ✅ Verify Docker Compose installation
2. ✅ Initialize project (install packages, setup .env)
3. ✅ Configure database connection for Docker network
4. ✅ Prompt for NGINX profile selection
5. ✅ For SSL: Validate that domain is configured
6. ✅ Build and start all containers

#### Deployment Script Options

```bash
./scripts/deploy.sh [OPTIONS]

Options:
  --profile <internal|ssl>   Specify NGINX profile
  --rebuild                  Force rebuild of Docker images
  --init                     Force reinitialization of project
```

**Examples:**

```bash
# Interactive deployment (recommended for first time)
./scripts/deploy.sh

# Deploy with specific profile
./scripts/deploy.sh --profile internal
./scripts/deploy.sh --profile ssl

# Force rebuild after code changes
./scripts/deploy.sh --profile internal --rebuild

# Reinitialize and deploy
./scripts/deploy.sh --profile ssl --init --rebuild
```

#### Updating after code changes

```bash
git pull origin main
./scripts/deploy.sh --profile internal --rebuild
```

---

### Option 2: Automated Deployment (GitHub Actions)

The CI/CD pipeline automatically builds Docker images and can deploy them to your server via SSH.

#### Pipeline Overview

```
Push to main/tag → Code Analysis → Docker Build & Push to GHCR → Deploy to Server
```

- **On push to `main` or version tags (`v*`):** Runs code analysis, builds the Docker image, pushes it to GHCR, and **automatically deploys** using default settings
- **On manual trigger (`workflow_dispatch`):** Same pipeline, but with customizable profile, tag, and build options

Auto-deploy only runs when `DEPLOY_PATH` is configured as a repository variable. Remove it to disable automatic deployments.

The default deploy settings are defined at the top of `.github/workflows/cd.yml` and can be easily changed:

```yaml
env:
  DEFAULT_PROFILE: internal  # Change to 'ssl' if needed
  DEFAULT_TAG: latest
```

#### Required GitHub Configuration

**Repository Variables** (Settings → Variables → Actions):

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Full application URL (inlined at build time) | `https://example.com` |
| `DEPLOY_PATH` | Deployment directory on the server | `/opt/myapp` |

**Repository Secrets** (Settings → Secrets → Actions):

| Secret | Description |
|---|---|
| `DEPLOY_SSH_HOST` | Server IP or hostname |
| `DEPLOY_SSH_USER` | SSH username |
| `DEPLOY_SSH_KEY` | Private SSH key for server access |

> `GITHUB_TOKEN` is provided automatically by GitHub Actions.

#### Server Setup (One-Time)

Before the first automated deployment, prepare the server:

1. **Create the deployment directory** and place a configured `.env` file in it:
   ```bash
   mkdir -p /opt/myapp
   cp .env.sample /opt/myapp/.env
   # Edit .env with production values (POSTGRES_*, BETTER_AUTH_SECRET, RESEND_API_KEY)
   # Set POSTGRES_HOST=postgres (container hostname)
   ```

2. **Ensure Docker is installed** on the server

3. **Add the SSH public key** to the server's `~/.ssh/authorized_keys`

#### Manual Trigger Options

The workflow can also be triggered manually via GitHub UI (`Actions → Continuous delivery → Run workflow`) to override defaults:

| Input | Description | Default |
|---|---|---|
| `build` | Build a new image before deploying | `true` |
| `profile` | NGINX profile (`internal` or `ssl`) | required |
| `tag` | Image tag to deploy | `latest` |

**Deploy latest build with different profile:**
- Trigger workflow with `build: true`, select profile

**Deploy a specific version without rebuilding:**
- Trigger workflow with `build: false`, `tag: v1.0.0`

#### Image Tagging Strategy

Images pushed to GHCR are tagged automatically:

| Git Event | Image Tags |
|---|---|
| Push to `main` | `main`, `latest`, `sha-abc1234` |
| Tag `v1.2.3` | `1.2.3`, `1.2`, `1`, `sha-abc1234` |

---

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

### 🏗️ Production Architecture

**Internal Profile (with external reverse proxy):**
```
Internet → Reverse Proxy (SSL) → NGINX (HTTP) → Next.js (:3000)
                                                      ↓
                                                PostgreSQL (:5432)
```

**SSL Profile (direct SSL):**
```
Internet → NGINX (:80/:443 with SSL) → Next.js (:3000)
                                            ↓
                                      PostgreSQL (:5432)
```

## 🏗️ Project Structure

```
next-starter/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── api/auth/[...all]/      # Auth API route
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Homepage
│   ├── components/ui/              # Reusable UI components (shadcn/ui)
│   │   ├── alert.tsx               # Alert component
│   │   ├── button.tsx              # Button component
│   │   ├── card.tsx                # Card component
│   │   ├── checkbox.tsx            # Checkbox component
│   │   ├── field.tsx               # Field component
│   │   ├── input.tsx               # Input component
│   │   ├── input-group.tsx         # Input group component
│   │   ├── label.tsx               # Label component
│   │   ├── radio-group.tsx         # Radio group component
│   │   ├── select.tsx              # Select component
│   │   ├── separator.tsx           # Separator component
│   │   ├── spinner.tsx             # Spinner component
│   │   ├── switch.tsx              # Switch component
│   │   └── textarea.tsx            # Textarea component
│   ├── shared/form/                # Shared form system
│   │   ├── components/             # Form components
│   │   │   ├── fields/             # Form field components
│   │   │   ├── helpers/            # Form helper components
│   │   │   ├── error-alert.tsx     # Error alert component
│   │   │   ├── form-field.tsx      # Form field wrapper
│   │   │   └── submit-button.tsx   # Submit button component
│   │   ├── context/                # Form context provider
│   │   ├── hooks/                  # Form hooks (useAppForm, useFormField)
│   │   ├── lib/                    # Form factory, types, utilities
│   │   └── index.ts                # Public form API
│   ├── lib/                        # Core libraries
│   │   ├── auth/                   # Auth configuration
│   │   │   ├── auth-client.ts      # Client-side auth
│   │   │   └── auth.ts             # Server-side auth
│   │   ├── database/               # Database configuration
│   │   │   ├── schema/             # Drizzle schema definitions
│   │   │   └── index.ts            # DB connection
│   │   └── utils.ts                # Helper functions
│   └── env.ts                      # Environment variable validation
├── .github/                        # GitHub Actions
│   ├── actions/                    # Reusable composite actions
│   │   ├── code-analysis/          # Code analysis action
│   │   ├── deploy/                 # Deployment action
│   │   └── docker-build-push/      # Docker build & push action
│   └── workflows/                  # CI/CD workflows
│       ├── cd.yml                  # Continuous delivery
│       └── ci.yml                  # Continuous integration
├── scripts/                        # Automation scripts
│   ├── initialize.sh               # Local setup script
│   ├── deploy.sh                   # Production deployment script
│   └── stop.sh                     # Stop production containers
├── nginx/                          # NGINX configurations
│   ├── nginx.internal.conf         # Internal profile (behind proxy)
│   └── nginx.ssl.conf              # SSL profile (direct SSL)
├── drizzle/                        # Database migrations
├── .husky/                         # Git hooks
├── docker-compose.yml              # Development services
├── docker-compose.prod.yml         # Production services
├── drizzle.config.ts               # Drizzle ORM config
├── entrypoint.sh                   # Docker entrypoint script
├── migrate.mjs                     # Standalone migration runner
├── next.config.ts                  # Next.js config
├── next.Dockerfile                 # Next.js production image
└── components.json                 # shadcn/ui config
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

# Production Deployment (manual, full repo clone)
./scripts/deploy.sh                        # Interactive deployment
./scripts/deploy.sh --profile internal     # Deploy with internal profile
./scripts/deploy.sh --profile ssl          # Deploy with SSL profile
./scripts/deploy.sh --rebuild              # Force rebuild images
./scripts/deploy.sh --init                 # Force reinitialization

# Production Deployment (remote, used by CI/CD)
./scripts/deploy.sh --remote --profile internal --image ghcr.io/user/repo:latest

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

| Service | Port    | Profile | Description |
|---------|---------|---------|-------------|
| `nextjs` | 3000    | all | Next.js application (production) |
| `postgres` | 5432    | all | PostgreSQL database |
| `nginx-internal` | 6001    | internal | NGINX reverse proxy (HTTP only) |
| `nginx-ssl` | 80, 443 | ssl | NGINX reverse proxy (with SSL) |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.