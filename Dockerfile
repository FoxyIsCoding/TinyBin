FROM node:20-slim

# Set working directory
WORKDIR /app

# Install git and other build dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy full project
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build frontend
WORKDIR /app/frontend
RUN pnpm run build

# Build backend
WORKDIR /app/backend
RUN pnpm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "backend/dist/index.js"]