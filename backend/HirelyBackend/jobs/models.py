from django.db import models
from django.conf import settings

class Job(models.Model):
    JOB_CATEGORIES = [
        ('programming', 'Programming'),
        ('design', 'Design'),
        ('marketing', 'Marketing'),
        ('sales', 'Sales'),
        ('business', 'Business'),
        ('customer_service', 'Customer Service'),
        ('other', 'Other'),
    ]
    
    JOB_LEVELS = [
        ('intern', 'Intern'),
        ('junior', 'Junior'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior'),
        ('lead', 'Lead'),
        ('manager', 'Manager'),
    ]
    
    JOB_TYPES = [
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
        ('remote', 'Remote'),
    ]
    
    # Basic Info
    employer = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='jobs'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # Categorization
    category = models.CharField(max_length=50, choices=JOB_CATEGORIES)
    level = models.CharField(max_length=20, choices=JOB_LEVELS)
    job_type = models.CharField(max_length=20, choices=JOB_TYPES, default='full_time')
    
    # Location & Company
    location = models.CharField(max_length=100)
    company = models.CharField(max_length=200)
    is_remote = models.BooleanField(default=False)
    
    # Salary
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_currency = models.CharField(max_length=10, default='USD', blank=True)
    salary_display = models.CharField(max_length=100, blank=True)  # e.g., "CTC 500+", "$80,000 - $100,000"
    
    # Detailed sections from UI
    responsibilities = models.TextField(blank=True)  # Key Responsibilities
    requirements = models.TextField(blank=True)      # Requirements
    skills = models.TextField(blank=True)            # Skills Required
    
    # Job Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    application_deadline = models.DateTimeField(null=True, blank=True)
    application_url = models.URLField(blank=True)    # External apply link
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['is_active', 'category']),
            models.Index(fields=['is_active', 'location']),
        ]
    
    def __str__(self):
        return f"{self.title} at {self.company}"
    
    @property
    def is_expired(self):
        if self.application_deadline:
            from django.utils import timezone
            return timezone.now() > self.application_deadline
        return False