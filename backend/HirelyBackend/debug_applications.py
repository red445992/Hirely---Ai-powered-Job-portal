#!/usr/bin/env python
"""
Analyze application data to debug the frontend issue
"""
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HirelyBackend.settings')
django.setup()

from applications.models import Application
from django.contrib.auth import get_user_model

User = get_user_model()

print("=== APPLICATIONS ANALYSIS ===")
print(f"Total applications: {Application.objects.count()}")
print()

# Check each user
for user in User.objects.all():
    apps_by_applicant = Application.objects.filter(applicant=user)
    apps_by_email = Application.objects.filter(email=user.email) if user.email else Application.objects.none()
    
    print(f"User: {user.username} (ID: {user.id})")
    print(f"  Email: '{user.email}'")
    print(f"  Type: {getattr(user, 'user_type', 'unknown')}")
    print(f"  Applications by applicant link: {apps_by_applicant.count()}")
    print(f"  Applications by email match: {apps_by_email.count()}")
    
    if apps_by_applicant.exists():
        print(f"    Applicant-linked IDs: {list(apps_by_applicant.values_list('id', flat=True))}")
    if apps_by_email.exists():
        print(f"    Email-matched IDs: {list(apps_by_email.values_list('id', flat=True))}")
    print()

print("=== ALL APPLICATIONS ===")
for app in Application.objects.all():
    applicant_info = f"{app.applicant.username} (ID: {app.applicant.id})" if app.applicant else "None"
    print(f"App {app.id}: {app.full_name} <{app.email}> -> Job: {app.job.title}")
    print(f"  Applicant: {applicant_info}")
    print(f"  Status: {app.status}")
    print()