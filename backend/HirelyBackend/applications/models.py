# applications/models.py
from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
from jobs.models import Job

User = get_user_model()


class Application(models.Model):
    AVAILABILITY_CHOICES = [
        ('immediately', 'Immediately'),
        ('1_week', '1 Week'),
        ('2_weeks', '2 Weeks'),
        ('1_month', '1 Month'),
        ('2_months', '2 Months'),
        ('3_months', '3+ Months'),
        ('negotiable', 'Negotiable'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Reviewing'),
        ('shortlisted', 'Shortlisted'),
        ('interviewed', 'Interviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]

    # Relations
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications', null=True, blank=True)
    
    # Personal Information
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Documents
    resume = models.FileField(upload_to='applications/resumes/', null=True, blank=True)
    cover_letter = models.TextField(blank=True, null=True)
    
    # Professional Links
    portfolio_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    
    # Job Preferences
    expected_salary = models.CharField(max_length=100, blank=True, null=True)
    availability = models.CharField(
        max_length=20,
        choices=AVAILABILITY_CHOICES,
        default='immediately'
    )
    
    # Additional Information
    additional_info = models.TextField(blank=True, null=True)
    
    # Application Status and Metadata
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    # Timestamps
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional tracking fields
    viewed_by_employer = models.BooleanField(default=False)
    employer_notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-applied_at']
        unique_together = ['job', 'email']  # Prevent duplicate applications from same email
        
    def __str__(self):
        return f"{self.full_name} - {self.job.title} ({self.status})"
    
    @property
    def is_recent(self):
        """Check if application was submitted in the last 7 days"""
        from django.utils import timezone
        from datetime import timedelta
        return self.applied_at >= timezone.now() - timedelta(days=7)
    
    def get_resume_filename(self):
        """Get the original filename of the uploaded resume"""
        if self.resume:
            return self.resume.name.split('/')[-1]
        return None


class ApplicationStatusHistory(models.Model):
    """Track status changes for applications"""
    application = models.ForeignKey(
        Application, 
        on_delete=models.CASCADE, 
        related_name='status_history'
    )
    old_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    notes = models.TextField(blank=True, null=True)
    changed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-changed_at']
        verbose_name_plural = "Application status histories"
        
    def __str__(self):
        return f"{self.application.full_name}: {self.old_status} → {self.new_status}"
