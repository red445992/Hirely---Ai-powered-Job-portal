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
    
    # Use settings.AUTH_USER_MODEL instead of get_user_model()
    employer = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='jobs'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=JOB_CATEGORIES)
    location = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=JOB_LEVELS)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    company = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title