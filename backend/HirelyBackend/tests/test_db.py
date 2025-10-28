import os
import sys
import django

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HirelyBackend.settings')
django.setup()

from django.db import connection

try:
    connection.ensure_connection()
    print("✅ PostgreSQL connection successful!")
    print(f"📊 Database: {connection.settings_dict['NAME']}")
    print(f"👤 User: {connection.settings_dict['USER']}")
    print(f"🌐 Host: {connection.settings_dict['HOST']}")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
