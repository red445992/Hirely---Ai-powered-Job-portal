# backend/Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps for psycopg2 and database tools
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    postgresql-client \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better caching)
COPY requirements.txt .

# Install Python deps
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .


WORKDIR /app/HirelyBackend
# Create start script
RUN echo '#!/bin/bash\n\
set -e\n\
echo "Waiting for PostgreSQL..."\n\
while ! nc -z postgres 5432; do\n\
  sleep 1\n\
done\n\
echo "PostgreSQL started"\n\
python manage.py migrate\n\
python manage.py collectstatic --noinput || true\n\
exec gunicorn HirelyBackend.wsgi:application --bind 0.0.0.0:8000 --workers 3' > /start.sh && chmod +x /start.sh

EXPOSE 8000

CMD ["/start.sh"]