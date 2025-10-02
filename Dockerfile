# ---------- deps ----------
FROM node:20-alpine AS deps
# OpenSSL for Prisma engines; pnpm via corepack
RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# Copy workspace manifests + lockfile first (cache-friendly)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/

# Avoid prisma generate during install (schema not copied yet)
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Install all deps without running postinstall scripts
RUN pnpm install --frozen-lockfile --ignore-scripts


# ---------- build ----------
FROM node:20-alpine AS build
RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# ⬇️ critical: prevent prisma CLI from trying `pnpm add` in CI
ENV PRISMA_SKIP_AUTOINSTALL=1

# Bring installed deps
COPY --from=deps /app/node_modules ./node_modules

# Copy full source
COPY . .

# Generate Prisma client (ephemeral CLI; no writes to your lockfile)
RUN npx -y prisma@5.22.0 generate --schema=apps/api/prisma/schema.prisma

# Build both apps (root "build" runs api+web builds)
RUN pnpm -r build


# ---------- runtime ----------
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEST_PORT=4000
ENV NEXT_TELEMETRY_DISABLED=1
# ⬇️ also skip autoinstall at runtime (for migrate)
ENV PRISMA_SKIP_AUTOINSTALL=1

# Bring deps and built artifacts
COPY --from=build /app/node_modules ./node_modules

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

# 1) run DB migrations (ephemeral CLI), 2) start Nest (bg) on 4000, 3) start Next on 3000
CMD ["/bin/sh","-lc", "npx -y prisma@5.22.0 migrate deploy --schema=apps/api/prisma/schema.prisma || true; node apps/api/dist/main.js & pnpm -C apps/web start"]
