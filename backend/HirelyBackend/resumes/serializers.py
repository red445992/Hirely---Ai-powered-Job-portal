# resumes/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Resume, ResumeShare, ResumeTemplate

User = get_user_model()

class ResumeListSerializer(serializers.ModelSerializer):
    """Serializer for listing resumes"""
    file_size_display = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'file_type', 'file_size', 'file_size_display',
            'template', 'status', 'is_default', 'is_public',
            'download_count', 'view_count', 'created_at', 'updated_at',
            'file_url'
        ]
    
    def get_file_size_display(self, obj):
        """Human readable file size"""
        if obj.file_size:
            if obj.file_size < 1024:
                return f"{obj.file_size} B"
            elif obj.file_size < 1024 * 1024:
                return f"{round(obj.file_size / 1024, 1)} KB"
            else:
                return f"{round(obj.file_size / (1024 * 1024), 1)} MB"
        return "0 B"
    
    def get_file_url(self, obj):
        """Get secure file URL"""
        return obj.download_url if obj.file else None


class ResumeDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for resume with all fields"""
    file_size_display = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'file', 'file_type', 'file_size', 'file_size_display',
            'original_filename', 'personal_info', 'experience', 'education',
            'skills', 'projects', 'certifications', 'template', 'status',
            'is_default', 'is_public', 'download_count', 'view_count',
            'last_downloaded', 'last_viewed', 'created_at', 'updated_at',
            'file_url', 'user_name'
        ]
        read_only_fields = ['file_size', 'file_type', 'original_filename', 
                           'download_count', 'view_count', 'last_downloaded', 
                           'last_viewed', 'created_at', 'updated_at']
    
    def get_file_size_display(self, obj):
        return ResumeListSerializer().get_file_size_display(obj)
    
    def get_file_url(self, obj):
        return ResumeListSerializer().get_file_url(obj)


class ResumeCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new resumes"""
    
    class Meta:
        model = Resume
        fields = [
            'title', 'file', 'personal_info', 'experience', 'education',
            'skills', 'projects', 'certifications', 'template', 'status',
            'is_default', 'is_public'
        ]
    
    def validate_file(self, value):
        """Validate resume file"""
        if value:
            # Check file size (10MB limit)
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("Resume file size must be less than 10MB")
            
            # Check file extension
            allowed_extensions = ['pdf', 'doc', 'docx', 'txt']
            file_extension = value.name.lower().split('.')[-1]
            if file_extension not in allowed_extensions:
                raise serializers.ValidationError(
                    "Resume must be a PDF, DOC, DOCX, or TXT file"
                )
        return value
    
    def create(self, validated_data):
        """Create resume with user from request"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ResumeUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating resumes"""
    
    class Meta:
        model = Resume
        fields = [
            'title', 'personal_info', 'experience', 'education',
            'skills', 'projects', 'certifications', 'template', 'status',
            'is_default', 'is_public'
        ]


class ResumeShareSerializer(serializers.ModelSerializer):
    """Serializer for resume sharing"""
    resume_title = serializers.CharField(source='resume.title', read_only=True)
    
    class Meta:
        model = ResumeShare
        fields = [
            'id', 'resume', 'resume_title', 'shared_with_email',
            'shared_at', 'expires_at', 'is_active', 'access_token',
            'view_count', 'last_viewed'
        ]
        read_only_fields = ['access_token', 'view_count', 'last_viewed']


class ResumeTemplateSerializer(serializers.ModelSerializer):
    """Serializer for resume templates"""
    preview_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ResumeTemplate
        fields = [
            'id', 'name', 'description', 'preview_image', 'preview_url',
            'is_active', 'is_premium', 'category'
        ]
    
    def get_preview_url(self, obj):
        """Get preview image URL"""
        if obj.preview_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.preview_image.url)
        return None


class ResumeStatsSerializer(serializers.Serializer):
    """Serializer for resume statistics"""
    total_resumes = serializers.IntegerField()
    active_resumes = serializers.IntegerField()
    draft_resumes = serializers.IntegerField()
    total_downloads = serializers.IntegerField()
    total_views = serializers.IntegerField()
    default_resume_id = serializers.IntegerField(allow_null=True)