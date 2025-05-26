# Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy frontend code
COPY frontend ./

# Build frontend
RUN pnpm run build

# Build backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY backend/package.json backend/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy backend code
COPY backend ./

# Build backend
RUN pnpm run build

# Final stage
FROM node:20-alpine
WORKDIR /app

# Install pnpm and netcat
RUN apk add --no-cache netcat-traditional

# Set environment variables
ENV PORT=3000
ENV VITE_PORT=5173
ENV DB_HOST=db
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_NAME=tinybin
ENV DATABASE_URL=postgres://postgres:postgres@db:5432/tinybin

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=frontend-builder /app/frontend/package.json ./frontend/
COPY --from=frontend-builder /app/frontend/pnpm-lock.yaml ./frontend/

# Copy backend build
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package.json ./backend/
COPY --from=backend-builder /app/backend/pnpm-lock.yaml ./backend/
COPY --from=backend-builder /app/backend/drizzle ./backend/drizzle

# Install dependencies
RUN npm install -g pnpm && \
    cd frontend && pnpm install --frozen-lockfile && \
    cd ../backend && pnpm install --frozen-lockfile

# Create start script
RUN echo '#!/bin/sh\n\
cd /app/backend && node dist/index.js &\n\
cd /app/frontend && pnpm preview --host 0.0.0.0 --port 5173 &\n\
wait' > /app/start.sh && \
    chmod +x /app/start.sh

# Expose ports
EXPOSE 3000
EXPOSE 5173

# Start the application
CMD ["/app/start.sh"]