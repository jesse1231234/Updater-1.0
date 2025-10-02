# Single-container build for API + Web
FROM node:20-alpine AS base
# OpenSSL helps prisma engines; corepack for pnpm
RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# Copy manifests + lockfile first (cache-friendly)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/

# Skip prisma generate during install (schema not copied yet)
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Install deps without running any postinstall scripts
RUN pnpm install --frozen-lockfile --ignore-scripts

# Now copy the full source
COPY . .

# Generate Prisma client now that schema exists
RUN pnpm -C apps/api prisma generate --schema apps/api/prisma/schema.prisma

# Build both apps (prebuild will also generate if needed)
RUN pnpm -r build

EXPOSE 3000 4000
CMD ["pnpm", "start"]
