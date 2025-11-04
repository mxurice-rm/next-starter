FROM node:20-alpine AS base
RUN corepack enable pnpm

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache postgresql-client

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/node_modules ./node_modules

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/src/database ./src/database
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
COPY --from=builder /app/package.json ./package.json

RUN chown nextjs:nodejs ./entrypoint.sh && chmod +x ./entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
ENTRYPOINT ["./entrypoint.sh"]