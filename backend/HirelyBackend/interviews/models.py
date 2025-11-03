from django.db import models
from django.conf import settings
import uuid
from datetime import datetime

class Interview(models.Model):
    INTERVIEW_TYPES = [
        ('Technical', 'Technical'),
        ('Behavioral', 'Behavioral'),
        ('Mixed', 'Mixed'),
    ]
    
    EXPERIENCE_LEVELS = [
        ('Entry', 'Entry Level'),
        ('Mid', 'Mid Level'),
        ('Senior', 'Senior Level'),
        ('Lead', 'Lead Level'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='interviews')
    role = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=INTERVIEW_TYPES)
    level = models.CharField(max_length=20, choices=EXPERIENCE_LEVELS)
    techstack = models.JSONField(default=list, blank=True)
    questions = models.JSONField(default=list)
    cover_image = models.CharField(max_length=200, blank=True)
    finalized = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.role} - {self.type} Interview ({self.user.username})"
    
    @property
    def question_count(self):
        return len(self.questions) if self.questions else 0
