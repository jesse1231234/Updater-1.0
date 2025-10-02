# Single-container build for API + Web
FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app


COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile


COPY . .
RUN pnpm -r build


EXPOSE 3000 4000
CMD ["pnpm", "start"]
