FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV SKIP_ENV_VALIDATION=true
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN corepack enable pnpm && pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache postgresql-client

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Ensure full drizzle-orm package is available for migrations
COPY --from=deps /app/node_modules/drizzle-orm ./node_modules/drizzle-orm

COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/migrate.mjs ./migrate.mjs

COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
RUN chown nextjs:nodejs ./entrypoint.sh && chmod +x ./entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENTRYPOINT ["./entrypoint.sh"]
