from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.username', read_only=True)
    date = serializers.SerializerMethodField()
    applicants_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'category', 'location', 
            'level', 'salary', 'company', 'is_active', 'created_at',
            'employer_name', 'date', 'applicants_count'
        ]
        read_only_fields = ['id', 'employer', 'created_at', 'updated_at']
    
    def get_date(self, obj):
        return obj.created_at.strftime("%d %b. %Y")
    
    def get_applicants_count(self, obj):
        # We'll update this later when we have applications
        return 0

class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'title', 'description', 'category', 'location', 
            'level', 'salary', 'company'
        ]
    
    def validate_salary(self, value):
        if value and value < 0:
            raise serializers.ValidationError("Salary cannot be negative")
        return value