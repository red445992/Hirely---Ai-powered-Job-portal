# Railway Deployment - Django Backend Only
# This file tells Railway to build the Django backend

web: cd backend/HirelyBackend && python manage.py migrate && python manage.py collectstatic --noinput && gunicorn HirelyBackend.wsgi --bind 0.0.0.0:$PORT