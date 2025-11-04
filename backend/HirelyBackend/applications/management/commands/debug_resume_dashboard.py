from django.core.management.base import BaseCommand
from applications.models import Application
from jobs.models import Job

class Command(BaseCommand):
    help = 'Debug resume dashboard data'

    def add_arguments(self, parser):
        parser.add_argument('job_id', type=int, help='Job ID to check')

    def handle(self, *args, **options):
        job_id = options['job_id']
        
        # Check if job exists
        try:
            job = Job.objects.get(id=job_id)
            self.stdout.write(f"✅ Job {job_id} exists: {job.title}")
        except Job.DoesNotExist:
            self.stdout.write(f"❌ Job {job_id} does not exist")
            return
        
        # Get all applications
        applications = Application.objects.filter(job_id=job_id)
        self.stdout.write(f"📊 Total applications for job {job_id}: {applications.count()}")
        
        if applications.count() == 0:
            self.stdout.write("❌ No applications found for this job")
            return
        
        # Check each application
        for i, app in enumerate(applications, 1):
            self.stdout.write(f"\n--- Application {i} ---")
            self.stdout.write(f"ID: {app.id}")
            self.stdout.write(f"Full Name: {app.full_name}")
            self.stdout.write(f"Email: {app.email}")
            self.stdout.write(f"Has Resume: {'✅' if app.resume else '❌'}")
            self.stdout.write(f"Resume Path: {app.resume if app.resume else 'None'}")
            self.stdout.write(f"Has Applicant: {'✅' if app.applicant else '❌'}")
            self.stdout.write(f"Applicant: {app.applicant.username if app.applicant else 'None'}")
            self.stdout.write(f"Status: {app.status}")
            
            if app.resume and app.applicant:
                self.stdout.write("✅ This application would be processed")
            else:
                self.stdout.write("❌ This application would be filtered out")