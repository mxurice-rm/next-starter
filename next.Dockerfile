# ============================================
# Stage 1: Install dependencies
# ============================================

ARG NODE_VERSION=24.13.0-slim

FROM node:${NODE_VERSION} AS dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  corepack enable pnpm && pnpm install --frozen-lockfile

# ============================================
# Stage 2: Build Next.js application
# ============================================

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV SKIP_ENV_VALIDATION=true
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN corepack enable pnpm && pnpm build

# ============================================
# Stage 3: Run Next.js application
# ============================================

FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install postgresql-client (pg_isready) and curl (healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client curl \
  && rm -rf /var/lib/apt/lists/*

# Copy production assets
COPY --from=builder --chown=node:node /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next && chown node:node .next

# Copy standalone output and static files
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Copy migration dependencies
COPY --from=dependencies --chown=node:node /app/node_modules/drizzle-orm ./node_modules/drizzle-orm
COPY --from=dependencies --chown=node:node /app/node_modules/pg ./node_modules/pg

# Copy migration files and entrypoint
COPY --from=builder --chown=node:node /app/drizzle ./drizzle
COPY --from=builder --chown=node:node /app/migrate.mjs ./migrate.mjs
COPY --from=builder --chown=node:node /app/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Switch to non-root user
USER node

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]