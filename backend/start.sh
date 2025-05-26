#!/bin/sh

# Start the backend
cd /app/backend
node dist/index.js &

# Start the frontend
cd /app/frontend
pnpm preview --host 0.0.0.0 --port 5173 &

# Keep container running
wait 