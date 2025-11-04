from django.core.management.base import BaseCommand
from applications.models import Application
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Fix applications without applicant field'

    def handle(self, *args, **options):
        # Find applications without applicants
        orphaned_apps = Application.objects.filter(applicant__isnull=True)
        self.stdout.write(f"Found {orphaned_apps.count()} applications without applicant field")
        
        if orphaned_apps.count() == 0:
            self.stdout.write("✅ No orphaned applications found")
            return
        
        # Try to find users by email
        fixed_count = 0
        for app in orphaned_apps:
            try:
                # Try to find user by email
                user = User.objects.get(email=app.email)
                app.applicant = user
                app.save()
                self.stdout.write(f"✅ Linked application {app.id} to user {user.username}")
                fixed_count += 1
            except User.DoesNotExist:
                self.stdout.write(f"❌ No user found with email {app.email} for application {app.id}")
            except User.MultipleObjectsReturned:
                self.stdout.write(f"⚠️ Multiple users found with email {app.email} for application {app.id}")
        
        self.stdout.write(f"\n📊 Summary: Fixed {fixed_count} out of {orphaned_apps.count()} applications")