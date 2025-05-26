# Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY ./frontend/package.json ./frontend/pnpm-lock.yaml ./frontend/
WORKDIR /app/frontend
RUN pnpm install --frozen-lockfile

# Copy frontend code
COPY ./frontend ./

# Build frontend
RUN pnpm run build

# Build backend
FROM node:20-alpine AS backend-builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY ./backend/package.json ./backend/pnpm-lock.yaml ./backend/
WORKDIR /app/backend
RUN pnpm install --frozen-lockfile

# Copy backend code
COPY ./backend ./

# Build backend
RUN pnpm run build

# Final stage
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

# Copy frontend build
COPY --from=frontend-builder /app/frontend/build ./frontend/build
COPY --from=frontend-builder /app/frontend/package.json ./frontend/
COPY --from=frontend-builder /app/frontend/pnpm-lock.yaml ./frontend/

# Copy backend build
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package.json ./backend/
COPY --from=backend-builder /app/backend/pnpm-lock.yaml ./backend/
COPY --from=backend-builder /app/backend/drizzle ./backend/drizzle

# Install dependencies
RUN npm install -g pnpm && \
    cd frontend && pnpm install --prod && \
    cd ../backend && pnpm install --prod

# Create start script
RUN echo '#!/bin/sh\n\
echo "Waiting for database..."\n\
while ! nc -z $DB_HOST $DB_PORT; do\n\
  sleep 1\n\
done\n\
echo "Database is ready!"\n\
\n\
cd /app/backend && pnpm run db:push && node dist/index.js &\n\
cd /app/frontend && pnpm preview --host 0.0.0.0 --port 4173 &\n\
\n\
wait' > /app/start.sh && \
    chmod +x /app/start.sh

# Expose ports
EXPOSE 3000
EXPOSE 4173

# Start the application
CMD ["/app/start.sh"] 