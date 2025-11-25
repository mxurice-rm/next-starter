#!/bin/sh
set -e

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until pg_isready -h postgres -p 5432 -U ${POSTGRES_USER:-next}; do
  echo "Database is not ready yet..."
  sleep 2
done

echo "✅ Database is ready!"

# Run database migrations
echo "🔄 Running database migrations..."
pnpm run db:migrate

# Start the server
echo "🎉 Starting Next.js application..."
exec node server.js