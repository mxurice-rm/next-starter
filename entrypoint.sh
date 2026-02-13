#!/bin/sh
set -e

# Wait for database to be ready
echo "Waiting for database to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0
until pg_isready -h "${POSTGRES_HOST:-postgres}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER:-next}"; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ "$RETRY_COUNT" -ge "$MAX_RETRIES" ]; then
    echo "Database not ready after ${MAX_RETRIES} attempts. Exiting."
    exit 1
  fi
  echo "Database is not ready yet... (${RETRY_COUNT}/${MAX_RETRIES})"
  sleep 2
done

echo "Database is ready!"

# Run database migrations
echo "Running database migrations..."
node migrate.mjs

# Start the server
echo "Starting Next.js application..."
exec node server.js
