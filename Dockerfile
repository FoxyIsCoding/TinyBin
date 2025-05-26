# 🌐 Build frontend (SvelteKit)
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

RUN npm install -g pnpm
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend ./
RUN pnpm run build

# 🧠 Build backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

RUN npm install -g pnpm
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY backend ./
RUN pnpm run build

# 🎉 Final container
FROM node:20-alpine
WORKDIR /app

# Tools
RUN apk add --no-cache netcat-openbsd

# Env vars
ENV PORT=3000
ENV DB_HOST=db
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_NAME=tinybin
ENV DATABASE_URL=postgres://postgres:postgres@db:5432/tinybin

# ✅ Copy frontend (adapter-node output)
COPY --from=frontend-builder /app/frontend/build ./frontend/build
COPY --from=frontend-builder /app/frontend/package.json ./frontend/
COPY --from=frontend-builder /app/frontend/pnpm-lock.yaml ./frontend/

# ✅ Copy backend
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package.json ./backend/
COPY --from=backend-builder /app/backend/pnpm-lock.yaml ./backend/
COPY --from=backend-builder /app/backend/drizzle ./backend/drizzle

# 📦 Install runtime deps
RUN npm install -g pnpm \
    && cd frontend && pnpm install --prod && \
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
wait' > /app/start.sh && chmod +x /app/start.sh

# Entrypoint to run both
CMD ["/app/start.sh"]

# 🚪 Expose ports
EXPOSE 3000
EXPOSE 4173
