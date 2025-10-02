# Single-container build for API + Web
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# ⬇️ COPY THE LOCKFILE IN BEFORE INSTALL
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm -r build

EXPOSE 3000 4000
CMD ["pnpm", "start"]
