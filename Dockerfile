# ---------- deps ----------
FROM node:20-alpine AS deps
RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# Copy EVERYTHING (simpler than partial copies when your workspace is changing)
COPY . .

# Install with no freeze so pnpm can update the lockfile in the image
RUN pnpm install --no-frozen-lockfile

# ---------- build ----------
FROM node:20-alpine AS build
RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app /app

RUN pnpm -r build

# ---------- runtime ----------
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@9 --activate && npm i -g prisma@5.22.0
WORKDIR /app

ENV NODE_ENV=production PORT=3000 NEST_PORT=4000 NEXT_TELEMETRY_DISABLED=1

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/web/.next ./apps/web/.next
COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/apps/web/package.json ./apps/web/package.json
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/packages ./packages

EXPOSE 3000 4000
CMD ["/bin/sh","-lc", "prisma migrate deploy --schema=apps/api/prisma/schema.prisma || true; node apps/api/dist/main.js & pnpm -C apps/web start"]
