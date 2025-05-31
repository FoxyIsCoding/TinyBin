# Build stage
FROM node:22-alpine AS builder
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
FROM node:22-alpine
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

COPY --from=builder /app/build   ./dist
COPY package.json pnpm-lock.yaml ./
COPY vite.config.js ./

# Install production dependencies and vite
RUN pnpm install --prod

# Expose port
EXPOSE 4173

# Start the preview server
CMD ["pnpm", "exec", "vite", "preview", "--host", "0.0.0.0", "--port", "4173"] 
