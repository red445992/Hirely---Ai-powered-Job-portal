# applications/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Application, ApplicationStatusHistory
from jobs.models import Job
from jobs.serializers import JobSerializer

User = get_user_model()


class ApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new applications"""
    
    class Meta:
        model = Application
        fields = [
            'job',
            'full_name',
            'email', 
            'phone',
            'resume',
            'cover_letter',
            'portfolio_url',
            'linkedin_url',
            'expected_salary',
            'availability',
            'additional_info'
        ]
        
    def validate_resume(self, value):
        """Validate resume file size and type"""
        if value:
            # Check file size (5MB limit)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Resume file size must be less than 5MB")
            
            # Check file extension
            allowed_extensions = ['.pdf', '.doc', '.docx', '.txt']
            file_extension = value.name.lower().split('.')[-1]
            if f'.{file_extension}' not in allowed_extensions:
                raise serializers.ValidationError(
                    "Resume must be a PDF, DOC, DOCX, or TXT file"
                )
        return value
    
    def validate_email(self, value):
        """Check if user already applied for this job"""
        job_id = self.initial_data.get('job')
        if job_id and Application.objects.filter(job_id=job_id, email=value).exists():
            raise serializers.ValidationError(
                "You have already applied for this job with this email address"
            )
        return value
    
    def validate_job(self, value):
        """Validate job exists and is active"""
        if not value.is_active:
            raise serializers.ValidationError("This job is no longer accepting applications")
        return value


class ApplicationListSerializer(serializers.ModelSerializer):
    """Serializer for listing applications (for employers)"""
    job_title = serializers.CharField(source='job.title', read_only=True)
    job_company = serializers.CharField(source='job.company', read_only=True)
    resume_filename = serializers.SerializerMethodField()
    time_since_applied = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = [
            'id',
            'job',
            'job_title',
            'job_company',
            'full_name',
            'email',
            'phone',
            'resume_filename',
            'expected_salary',
            'availability',
            'status',
            'applied_at',
            'time_since_applied',
            'viewed_by_employer',
            'is_recent'
        ]
        
    def get_resume_filename(self, obj):
        return obj.get_resume_filename()
        
    def get_time_since_applied(self, obj):
        from django.utils import timezone
        diff = timezone.now() - obj.applied_at
        
        if diff.days > 0:
            return f"{diff.days} days ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hours ago"
        else:
            minutes = diff.seconds // 60
            return f"{minutes} minutes ago"


class ApplicationDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for viewing a specific application"""
    job = JobSerializer(read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    job_company = serializers.CharField(source='job.company', read_only=True)
    job_location = serializers.CharField(source='job.location', read_only=True)
    resume_filename = serializers.SerializerMethodField()
    status_history = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = [
            'id',
            'job',
            'job_title',
            'job_company', 
            'job_location',
            'full_name',
            'email',
            'phone',
            'resume',
            'resume_filename',
            'cover_letter',
            'portfolio_url',
            'linkedin_url',
            'expected_salary',
            'availability',
            'additional_info',
            'status',
            'applied_at',
            'updated_at',
            'viewed_by_employer',
            'employer_notes',
            'status_history',
            'is_recent'
        ]
        read_only_fields = ['applied_at', 'updated_at']
        
    def get_resume_filename(self, obj):
        return obj.get_resume_filename()
        
    def get_status_history(self, obj):
        history = obj.status_history.all()[:5]  # Last 5 status changes
        return [{
            'old_status': h.old_status,
            'new_status': h.new_status,
            'changed_at': h.changed_at,
            'notes': h.notes
        } for h in history]


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating application status"""
    notes = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Application
        fields = ['status', 'employer_notes', 'notes']
        
    def update(self, instance, validated_data):
        notes = validated_data.pop('notes', '')
        old_status = instance.status
        new_status = validated_data.get('status', old_status)
        
        # Update the application
        instance = super().update(instance, validated_data)
        
        # Create status history record if status changed
        if old_status != new_status:
            ApplicationStatusHistory.objects.create(
                application=instance,
                old_status=old_status,
                new_status=new_status,
                changed_by=self.context.get('request').user if self.context.get('request') else None,
                notes=notes
            )
            
        return instance


class ApplicationStatsSerializer(serializers.Serializer):
    """Serializer for application statistics"""
    total_applications = serializers.IntegerField()
    pending_applications = serializers.IntegerField()
    shortlisted_applications = serializers.IntegerField()
    accepted_applications = serializers.IntegerField()
    rejected_applications = serializers.IntegerField()
    recent_applications = serializers.IntegerField()  # Last 7 days