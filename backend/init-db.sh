#!/bin/bash
set -e

echo "=== STARTING DATABASE MIGRATIONS ==="

for file in /migrations/*.sql; do
  echo "Executing: $file"
  mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" < "$file"
done

if [ -f /seed.sql ]; then
  echo "=== SEEDING DATABASE ==="
  mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" < /seed.sql
fi

echo "=== DATABASE INITIALIZATION COMPLETED ==="
