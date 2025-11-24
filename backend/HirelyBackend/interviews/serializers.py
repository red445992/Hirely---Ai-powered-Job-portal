from rest_framework import serializers
from .models import Interview, QuestionSet, Assessment, QuizCategory
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


class QuizCategorySerializer(serializers.ModelSerializer):
    """Serializer for quiz categories"""
    class Meta:
        model = QuizCategory
        fields = ['name', 'description', 'icon']


class QuestionSetSerializer(serializers.ModelSerializer):
    """Serializer for question sets"""
    is_valid = serializers.ReadOnlyField()
    
    class Meta:
        model = QuestionSet
        fields = [
            'id', 'category', 'difficulty', 'questions', 
            'expires_at', 'is_valid', 'created_at'
        ]
        read_only_fields = ['id', 'questions_hash', 'expires_at', 'created_at']


class GenerateQuizSerializer(serializers.Serializer):
    """Serializer for quiz generation request"""
    category = serializers.ChoiceField(choices=QuizCategory.CATEGORIES)
    difficulty = serializers.ChoiceField(
        choices=QuestionSet.DIFFICULTY_LEVELS,
        default='Mixed'
    )
    
    def validate_category(self, value):
        # Ensure category exists
        valid_categories = [choice[0] for choice in QuizCategory.CATEGORIES]
        if value not in valid_categories:
            raise serializers.ValidationError(f"Invalid category. Choose from: {', '.join(valid_categories)}")
        return value


class SubmitAnswersSerializer(serializers.Serializer):
    """Serializer for submitting quiz answers"""
    question_set_id = serializers.UUIDField()
    answers = serializers.ListField(
        child=serializers.CharField(),
        min_length=1,
        max_length=20
    )
    time_taken_seconds = serializers.IntegerField(min_value=0, required=False)
    
    def validate_question_set_id(self, value):
        try:
            question_set = QuestionSet.objects.get(id=value)
            if not question_set.is_valid():
                raise serializers.ValidationError("Question set has expired or already been used")
            return value
        except QuestionSet.DoesNotExist:
            raise serializers.ValidationError("Invalid question set ID")


class AssessmentSerializer(serializers.ModelSerializer):
    """Serializer for assessment results"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    passed = serializers.ReadOnlyField()
    
    class Meta:
        model = Assessment
        fields = [
            'id', 'user', 'user_email', 'category', 'score', 
            'total_questions', 'correct_answers', 'answers',
            'time_taken_seconds', 'improvement_tip', 'passed',
            'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']