from rest_framework import serializers
from .models import Job

# jobs/serializers.py
class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.username', read_only=True)
    date = serializers.SerializerMethodField()
    applicants_count = serializers.SerializerMethodField()
    is_expired = serializers.ReadOnlyField()
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'category', 'location', 
            'level', 'salary', 'salary_display', 'company', 'job_type',
            'is_active', 'is_remote', 'is_featured', 'is_expired',
            'responsibilities', 'requirements', 'skills',
            'application_deadline', 'application_url',
            'created_at', 'updated_at',
            'employer_name', 'date', 'applicants_count'
        ]
        read_only_fields = ['id', 'employer', 'created_at', 'updated_at']
    
    def get_date(self, obj):
        return obj.created_at.strftime("%d %b. %Y")
    
    def get_applicants_count(self, obj):
        return obj.applications.count()

class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'title', 'description', 'category', 'location', 
            'level', 'salary', 'salary_display', 'company', 'job_type',
            'is_remote', 'responsibilities', 'requirements', 'skills',
            'application_deadline', 'application_url'
        ]
    
    def validate_salary(self, value):
        if value and value < 0:
            raise serializers.ValidationError("Salary cannot be negative")
        return value