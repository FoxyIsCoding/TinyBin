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

# Set environment variables
ENV PORT=3000
ENV DB_HOST=db
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_NAME=tinybin
ENV DATABASE_URL=postgres://postgres:postgres@db:5432/tinybin

# Copy build output and package files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle
COPY package.json pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --prod

# Create start script
RUN echo '#!/bin/sh\n\
echo "Waiting for database..."\n\
while ! nc -z $DB_HOST $DB_PORT; do\n\
  sleep 1\n\
done\n\
echo "Database is ready!"\n\
\n\
cd /app && pnpm run db:push && node dist/index.js' > /app/start.sh && \
    chmod +x /app/start.sh

# Expose port
EXPOSE 3000

# Start the server
ENTRYPOINT ["/bin/sh", "/app/start.sh"] 