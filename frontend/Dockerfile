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

# Install pnpm
RUN npm install -g pnpm

# Copy build output and package files
COPY --from=builder /app/build ./build
COPY package.json pnpm-lock.yaml ./

# Install production dependencies including vite
RUN pnpm install --prod && \
    pnpm add -g vite

# Expose port
EXPOSE 4173

# Start the preview server
CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "4173"] 