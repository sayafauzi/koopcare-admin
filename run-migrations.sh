#!/bin/bash
DB_CONTAINER="koopcare_mysql"
DB_USER="root"
DB_PASS="rootpassword"
DB_NAME="koopcare_db"

echo "⏳ Membuat database jika belum ada..."
docker exec -i $DB_CONTAINER mysql -u$DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

echo "⏳ Menjalankan migration..."

for file in backend/db/migrations/*.sql; do
  echo "   -> $(basename "$file")"
  docker exec -i $DB_CONTAINER mysql -u$DB_USER -p$DB_PASS $DB_NAME < "$file"
  if [ $? -ne 0 ]; then
    echo "❌ Error pada file $file"
    exit 1
  fi
done

echo "✅ Semua migration selesai."