from django.db import models
from django.conf import settings
import uuid
import hashlib
import json
from datetime import datetime, timedelta
from django.utils import timezone

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


class QuizCategory(models.Model):
    """Categories for quiz assessments"""
    CATEGORIES = [
        ('Programming', 'Programming'),
        ('Frontend', 'Frontend Development'),
        ('Backend', 'Backend Development'),
        ('FullStack', 'Full Stack Development'),
        ('Mobile', 'Mobile Development'),
        ('DevOps', 'DevOps & Cloud'),
        ('DataScience', 'Data Science'),
        ('MachineLearning', 'Machine Learning'),
        ('UIUX', 'UI/UX Design'),
        ('ProductManagement', 'Product Management'),
        ('QA', 'Quality Assurance'),
        ('Cybersecurity', 'Cybersecurity'),
        ('CloudComputing', 'Cloud Computing'),
        ('Blockchain', 'Blockchain'),
        ('GameDev', 'Game Development'),
    ]
    
    name = models.CharField(max_length=50, choices=CATEGORIES, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    
    class Meta:
        verbose_name_plural = "Quiz Categories"
    
    def __str__(self):
        return self.get_name_display()


class QuestionSet(models.Model):
    """Stores generated question sets with hash for validation"""
    DIFFICULTY_LEVELS = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
        ('Mixed', 'Mixed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='question_sets', null=True, blank=True)
    category = models.CharField(max_length=50)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default='Mixed')
    questions = models.JSONField()  # Array of question objects
    questions_hash = models.CharField(max_length=64)  # SHA256 hash for validation
    expires_at = models.DateTimeField()  # Questions expire after 1 hour
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.questions_hash:
            # Generate hash from questions
            questions_str = json.dumps(self.questions, sort_keys=True)
            self.questions_hash = hashlib.sha256(questions_str.encode()).hexdigest()
        
        if not self.expires_at:
            # Set expiration to 1 hour from now
            self.expires_at = timezone.now() + timedelta(hours=1)
        
        super().save(*args, **kwargs)
    
    def is_valid(self):
        """Check if question set is still valid"""
        return not self.used and timezone.now() < self.expires_at
    
    def verify_hash(self):
        """Verify the integrity of questions"""
        questions_str = json.dumps(self.questions, sort_keys=True)
        calculated_hash = hashlib.sha256(questions_str.encode()).hexdigest()
        return calculated_hash == self.questions_hash
    
    def __str__(self):
        return f"QuestionSet {self.id} - {self.category} ({self.user.username})"


class Assessment(models.Model):
    """Stores quiz assessment results"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessments', null=True, blank=True)
    question_set = models.ForeignKey(QuestionSet, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.CharField(max_length=50)
    score = models.IntegerField()  # 0-100
    total_questions = models.IntegerField(default=10)
    correct_answers = models.IntegerField()
    answers = models.JSONField()  # Array of user answers
    time_taken_seconds = models.IntegerField(null=True, blank=True)
    improvement_tip = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'category']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.category}: {self.score}%"
    
    @property
    def passed(self):
        return self.score >= 70


class RateLimit(models.Model):
    """Track API usage for rate limiting"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    action = models.CharField(max_length=50)  # 'quiz_generation', 'voice_interview'
    count = models.IntegerField(default=1)
    window_start = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'action', 'window_start']
        indexes = [
            models.Index(fields=['user', 'action', 'window_start']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.action}: {self.count}"
