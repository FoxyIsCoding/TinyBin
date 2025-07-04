# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .


# Build
RUN pnpm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install pnpm and netcat
RUN apk add --no-cache netcat-openbsd && \
    npm install -g pnpm

# Copy build output and package files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.js ./
COPY --from=builder /app/src/db ./src/db
COPY package.json pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --prod

# Create start script
RUN printf '%s\n' \
  '#!/bin/sh' \
  'echo "Waiting for database..."' \
  'while ! nc -z $DB_HOST $DB_PORT; do' \
  '  sleep 1' \
  'done' \
  'echo "Database is ready!"' \
  'cd /app && pnpm run db:push && node dist/index.js' \
  > /app/start.sh && chmod +x /app/start.sh

EXPOSE 3001

ENTRYPOINT ["/bin/sh", "/app/start.sh"]