FROM node:20-slim

# Set working directory
WORKDIR /app

# Install git and other build dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install root dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build frontend
WORKDIR /app/frontend
RUN pnpm install
RUN pnpm run build

# Build backend
WORKDIR /app/backend
RUN pnpm install
# Fix TypeScript module resolution issues
RUN sed -i 's/"moduleResolution": "NodeNext"/"moduleResolution": "Bundler"/g' tsconfig.json
RUN pnpm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "backend/dist/index.js"]