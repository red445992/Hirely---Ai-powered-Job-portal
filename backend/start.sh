#!/bin/bash

# Wait for PostgreSQL
echo "Waiting for PostgreSQL..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL started"

# Change to directory where manage.py is located
cd /app/HirelyBackend

# Run migrations
python manage.py migrate

# Create superuser if needed (optional)
# echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'password') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell

# Start server
python manage.py runserver 0.0.0.0:8000