#!/bin/bash

# Pull latest images
docker-compose pull

# Stop and remove existing containers
docker-compose down

# Start new containers
docker-compose up -d

# Run database migrations
docker-compose exec backend python manage.py migrate

# Collect static files (if needed)
docker-compose exec backend python manage.py collectstatic --noinput

echo "Deployment completed successfully!"