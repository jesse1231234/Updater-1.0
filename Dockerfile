# ---------- deps ----------
FROM node:20-alpine AS deps
# Prisma engines need OpenSSL on Alpine; pnpm via corepack
RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# Copy manifests + lockfile first (cache-friendly)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/

# IMPORTANT: copy Prisma schema BEFORE install so @prisma/client postinstall can run
COPY apps/api/prisma/ apps/api/prisma/

# Full install (scripts enabled so Prisma client generates)
RUN pnpm install --frozen-lockfile


# ---------- build ----------
FROM node:20-alpine AS build
RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Bring deps (root + per-workspace so .bin commands exist)
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

# Copy full source (includes Prisma schema)
COPY . .

# Build both apps (apps/api uses "nest build"; apps/web uses "next build")
RUN pnpm -r build


# ---------- runtime ----------
FROM node:20-alpine AS runner
# Global prisma CLI for runtime migrations
RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@9 --activate && npm i -g prisma@5.22.0
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEST_PORT=4000
ENV NEXT_TELEMETRY_DISABLED=1

# Bring deps and built artifacts
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/web/node_modules ./apps/web/node_modules

# Prisma schema needed at runtime for migrate
COPY --from=build /app/apps/api/prisma ./apps/api/prisma

# NestJS build output
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json

# Next.js build output + assets
COPY --from=build /app/apps/web/.next ./apps/web/.next
COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/apps/web/package.json ./apps/web/package.json

# Shared packages (types, etc.)
COPY --from=build /app/packages ./packages

EXPOSE 3000 4000

# 1) migrate DB (safe to re-run), 2) start Nest (bg) on 4000, 3) start Next on 3000
CMD ["/bin/sh","-lc", "prisma migrate deploy --schema=apps/api/prisma/schema.prisma || true; node apps/api/dist/main.js & pnpm -C apps/web start"]
