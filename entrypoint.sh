#!/bin/sh
set -e

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until pg_isready -h database -p 5432 -U ${POSTGRES_USER:-next}; do
  echo "Database is not ready yet..."
  sleep 2
done

echo "✅ Database is ready!"

# Push database schema
echo "🔄 Pushing database schema..."
pnpm run db:push

# Start the server
echo "🎉 Starting Next.js application..."
exec node server.js