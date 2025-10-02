# ---------- deps ----------
FROM node:20-alpine AS deps
RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# Copy manifests + lockfile first (cache-friendly)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/

# Prevent prisma postinstall from running before schema is present
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Install all deps without running postinstall scripts
RUN pnpm install --frozen-lockfile --ignore-scripts


# ---------- build ----------
FROM node:20-alpine AS build
RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Bring installed deps (root and per-workspace node_modules)
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy full source
COPY . .

# Now schema exists → generate Prisma client (use pnpm exec)
RUN pnpm -C apps/api exec prisma generate

# Build both apps (your root build handles api+web)
RUN pnpm -r build


# ---------- runtime ----------
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEST_PORT=4000
ENV NEXT_TELEMETRY_DISABLED=1

# Bring deps and built artifacts (root + per-workspace node_modules)
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=build /app/packages/shared/node_modules ./packages/shared/node_modules

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

# 1) migrate DB safely, 2) start Nest on :4000 (bg), 3) start Next on :3000
CMD ["/bin/sh","-lc", "pnpm -C apps/api exec prisma migrate deploy || true; node apps/api/dist/main.js & pnpm -C apps/web start"]
