from rest_framework import serializers
from .models import Interview
from django.contrib.auth.models import User

class InterviewSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    question_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Interview
        fields = [
            'id', 'user', 'user_email', 'role', 'type', 'level', 
            'techstack', 'questions', 'cover_image', 'finalized',
            'question_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class InterviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating interviews with question generation"""
    amount = serializers.IntegerField(write_only=True, min_value=1, max_value=20)
    
    class Meta:
        model = Interview
        fields = [
            'role', 'type', 'level', 'techstack', 'amount'
        ]
    
    def validate_techstack(self, value):
        if isinstance(value, str):
            # Convert comma-separated string to list
            value = [tech.strip() for tech in value.split(',') if tech.strip()]
        return value