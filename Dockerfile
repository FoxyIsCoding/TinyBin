FROM node:20-slim

# Set working directory
WORKDIR /app

# Install git and other build dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Frontend build
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend ./
RUN pnpm run build

# Build backend
FROM node:20-slim AS backend-builder
WORKDIR /app/backend
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY backend ./
RUN pnpm run build

# Final stage
FROM node:20-slim
WORKDIR /app

# Copy frontend build
COPY --from=0 /app/frontend/dist ./frontend/dist
COPY --from=0 /app/frontend/package.json ./frontend/
COPY --from=0 /app/frontend/pnpm-lock.yaml ./frontend/

# Copy backend build
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/drizzle ./backend/drizzle
COPY --from=backend-builder /app/backend/package.json ./backend/
COPY --from=backend-builder /app/backend/pnpm-lock.yaml ./backend/

# Copy start script
COPY backend/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Install dependencies
WORKDIR /app/frontend
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

WORKDIR /app/backend
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV VITE_PORT=5173

# Expose ports
EXPOSE 3000
EXPOSE 5173

# Start both services
CMD ["/app/start.sh"]