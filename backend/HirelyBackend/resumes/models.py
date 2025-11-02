# resumes/models.py
from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator
import os

def resume_upload_path(instance, filename):
    """Generate upload path for resume files"""
    # Use user ID and original filename
    return f'resumes/{instance.user.id}/{filename}'

class Resume(models.Model):
    RESUME_TYPES = [
        ('pdf', 'PDF Document'),
        ('doc', 'Word Document'),
        ('docx', 'Word Document (DOCX)'),
        ('txt', 'Text Document'),
    ]
    
    TEMPLATE_CHOICES = [
        ('modern', 'Modern'),
        ('classic', 'Classic'),
        ('minimal', 'Minimal'),
        ('creative', 'Creative'),
        ('professional', 'Professional'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('archived', 'Archived'),
    ]
    
    # Basic Info
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resumes')
    title = models.CharField(max_length=200, help_text="Resume title (e.g., 'Software Engineer Resume')")
    
    # File Management
    file = models.FileField(
        upload_to=resume_upload_path,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'txt'])],
        help_text="Upload your resume file (PDF, DOC, DOCX, or TXT)"
    )
    file_type = models.CharField(max_length=10, choices=RESUME_TYPES)
    file_size = models.PositiveIntegerField(help_text="File size in bytes")
    original_filename = models.CharField(max_length=255)
    
    # Resume Content (for online editing/viewing)
    personal_info = models.JSONField(default=dict, blank=True, help_text="Personal information")
    experience = models.JSONField(default=list, blank=True, help_text="Work experience")
    education = models.JSONField(default=list, blank=True, help_text="Education details")
    skills = models.JSONField(default=list, blank=True, help_text="Skills and competencies")
    projects = models.JSONField(default=list, blank=True, help_text="Projects")
    certifications = models.JSONField(default=list, blank=True, help_text="Certifications")
    
    # Metadata
    template = models.CharField(max_length=20, choices=TEMPLATE_CHOICES, default='modern')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_default = models.BooleanField(default=False, help_text="Default resume for applications")
    is_public = models.BooleanField(default=False, help_text="Public resume viewable by employers")
    
    # Analytics
    download_count = models.PositiveIntegerField(default=0)
    view_count = models.PositiveIntegerField(default=0)
    last_downloaded = models.DateTimeField(null=True, blank=True)
    last_viewed = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        constraints = [
            models.UniqueConstraint(
                fields=['user'], 
                condition=models.Q(is_default=True),
                name='unique_default_resume_per_user'
            )
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"
    
    def save(self, *args, **kwargs):
        # Set file type based on file extension
        if self.file:
            self.file_type = self.file.name.split('.')[-1].lower()
            self.file_size = self.file.size
            self.original_filename = os.path.basename(self.file.name)
        
        # Ensure only one default resume per user
        if self.is_default:
            Resume.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(is_default=False)
        
        super().save(*args, **kwargs)
    
    @property
    def file_size_mb(self):
        """Return file size in MB"""
        return round(self.file_size / (1024 * 1024), 2) if self.file_size else 0
    
    @property
    def download_url(self):
        """Return secure download URL"""
        return f"/api/resumes/{self.pk}/download/"


class ResumeShare(models.Model):
    """Track resume sharing with employers"""
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='shares')
    shared_with_email = models.EmailField(help_text="Email of person resume was shared with")
    shared_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    access_token = models.CharField(max_length=100, unique=True)
    view_count = models.PositiveIntegerField(default=0)
    last_viewed = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.resume.title} shared with {self.shared_with_email}"


class ResumeTemplate(models.Model):
    """Resume templates for different styles"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    template_file = models.FileField(upload_to='resume_templates/')
    preview_image = models.ImageField(upload_to='template_previews/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=False)
    category = models.CharField(max_length=50, default='general')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name