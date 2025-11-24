"""
Quiz Assessment Views with Security and Rate Limiting
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.conf import settings
from django.db import models
from datetime import timedelta
import json
import os

from .models import QuestionSet, Assessment, RateLimit, QuizCategory
from .serializers import (
    QuestionSetSerializer, 
    AssessmentSerializer, 
    GenerateQuizSerializer,
    SubmitAnswersSerializer
)

# Import Google Generative AI
try:
    import google.generativeai as genai
    GEMINI_API_KEY = os.getenv('GOOGLE_GENERATIVE_API_KEY')
    # Use gemini-pro which is stable and available in v1 API
    GEMINI_MODEL = os.getenv('GOOGLE_GEMINI_MODEL')
    
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel(GEMINI_MODEL)
        print(f"✅ Gemini AI configured with model: {GEMINI_MODEL}")
    else:
        model = None
        print("⚠️ WARNING: GOOGLE_GENERATIVE_API_KEY not set")
except ImportError as e:
    model = None
    print(f"⚠️ WARNING: google-generativeai not installed: {e}")
except Exception as e:
    model = None
    print(f"⚠️ ERROR configuring Gemini AI: {e}")


# Rate Limit Constants
RATE_LIMITS = {
    'quiz_generation': {
        'per_hour': 2,
        'per_day': 5,
    },
    'voice_interview': {
        'per_hour': 1,
        'per_day': 3,
    }
}


def check_rate_limit(user, action):
    """
    Check if user has exceeded rate limits
    Returns (allowed: bool, message: str)
    """
    now = timezone.now()
    
    # Check hourly limit
    hour_ago = now - timedelta(hours=1)
    hourly_count = RateLimit.objects.filter(
        user=user,
        action=action,
        window_start__gte=hour_ago
    ).count()
    
    if hourly_count >= RATE_LIMITS[action]['per_hour']:
        return False, f"Hourly limit exceeded. You can generate {RATE_LIMITS[action]['per_hour']} {action.replace('_', ' ')}s per hour."
    
    # Check daily limit
    day_ago = now - timedelta(days=1)
    daily_count = RateLimit.objects.filter(
        user=user,
        action=action,
        window_start__gte=day_ago
    ).count()
    
    if daily_count >= RATE_LIMITS[action]['per_day']:
        return False, f"Daily limit exceeded. You can generate {RATE_LIMITS[action]['per_day']} {action.replace('_', ' ')}s per day. Try again tomorrow."
    
    return True, "OK"


def record_rate_limit(user, action):
    """Record an API usage for rate limiting"""
    RateLimit.objects.create(user=user, action=action)
    
    # Clean up old records (older than 24 hours)
    day_ago = timezone.now() - timedelta(days=1)
    RateLimit.objects.filter(window_start__lt=day_ago).delete()


def generate_quiz_with_ai(category, difficulty='Mixed', user_profile=None):
    """
    Generate quiz questions using Gemini AI
    """
    if not model:
        raise Exception("AI model not configured. Please set GOOGLE_GENERATIVE_API_KEY")
    
    # Build prompt based on difficulty
    difficulty_instructions = {
        'Easy': "Focus on fundamental concepts and basic knowledge. Questions should be suitable for beginners.",
        'Medium': "Include practical application questions. Suitable for intermediate developers.",
        'Hard': "Include advanced scenarios, best practices, and architectural decisions. Suitable for senior developers.",
        'Mixed': "Mix of 3 Easy, 4 Medium, and 3 Hard questions to assess comprehensive knowledge."
    }
    
    user_context = ""
    if user_profile:
        if hasattr(user_profile, 'industry') and user_profile.industry:
            user_context = f" The user works in {user_profile.industry}."
        if hasattr(user_profile, 'skills') and user_profile.skills:
            user_context += f" Their skills include: {', '.join(user_profile.skills[:5])}."
    
    prompt = f"""
Generate 10 technical interview questions for {category} category.
{difficulty_instructions.get(difficulty, difficulty_instructions['Mixed'])}
{user_context}

Requirements:
1. Each question must be multiple choice with exactly 4 options (A, B, C, D)
2. Mark the correct answer
3. Provide a brief explanation for the correct answer
4. Questions should be practical and relevant to real-world scenarios
5. Avoid overly theoretical or trivia questions
6. Ensure variety in topics within {category}

Return ONLY a JSON object (no markdown, no code blocks) in this exact format:
{{
  "questions": [
    {{
      "question": "Clear, concise question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Brief explanation of why this is correct"
    }}
  ]
}}
"""
    
    try:
        # Generate content with retry logic
        max_retries = 3
        for attempt in range(max_retries):
            try:
                result = model.generate_content(prompt)
                response_text = result.text.strip()
                
                # Clean up response (remove markdown code blocks if present)
                if response_text.startswith('```'):
                    response_text = response_text.split('```')[1]
                    if response_text.startswith('json'):
                        response_text = response_text[4:]
                    response_text = response_text.strip()
                
                # Parse JSON
                quiz_data = json.loads(response_text)
                
                # Validate structure
                if 'questions' not in quiz_data or not isinstance(quiz_data['questions'], list):
                    raise ValueError("Invalid quiz structure: missing 'questions' array")
                
                if len(quiz_data['questions']) != 10:
                    raise ValueError(f"Expected 10 questions, got {len(quiz_data['questions'])}")
                
                # Validate each question
                for i, q in enumerate(quiz_data['questions']):
                    if not all(k in q for k in ['question', 'options', 'correctAnswer', 'explanation']):
                        raise ValueError(f"Question {i+1} missing required fields")
                    
                    if len(q['options']) != 4:
                        raise ValueError(f"Question {i+1} must have exactly 4 options")
                    
                    if q['correctAnswer'] not in q['options']:
                        raise ValueError(f"Question {i+1} correct answer not in options")
                
                return quiz_data['questions']
                
            except json.JSONDecodeError as e:
                if attempt == max_retries - 1:
                    raise Exception(f"Failed to parse AI response after {max_retries} attempts: {str(e)}")
                continue
            
            except Exception as e:
                if attempt == max_retries - 1:
                    raise Exception(f"Error generating quiz: {str(e)}")
                continue
    
    except Exception as e:
        raise Exception(f"AI generation failed: {str(e)}")


@api_view(['POST'])
@permission_classes([])  # Temporarily public for testing
def generate_quiz(request):
    """
    Generate a new quiz (temporarily public for testing)
    POST /interviews/quiz/generate/
    Body: { "category": "Programming", "difficulty": "Mixed" }
    """
    serializer = GenerateQuizSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'error': 'Invalid request data',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Check rate limit (skip for anonymous users during testing)
        if request.user.is_authenticated:
            allowed, message = check_rate_limit(request.user, 'quiz_generation')
            if not allowed:
                return Response({
                    'success': False,
                    'error': message,
                    'rate_limit_exceeded': True
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)
        
        category = serializer.validated_data['category']
        difficulty = serializer.validated_data.get('difficulty', 'Mixed')
        
        # Get user profile for context (if exists)
        user_profile = None
        try:
            # Try to get user profile from Prisma (if exists)
            # This is optional - falls back to None if not found
            pass
        except:
            pass
        
        # Generate questions with AI
        questions = generate_quiz_with_ai(category, difficulty, user_profile)
        
        # Create question set
        question_set = QuestionSet.objects.create(
            user=request.user if request.user.is_authenticated else None,
            category=category,
            difficulty=difficulty,
            questions=questions
        )
        
        # Record rate limit usage (skip for anonymous users)
        if request.user.is_authenticated:
            record_rate_limit(request.user, 'quiz_generation')
        
        serializer = QuestionSetSerializer(question_set)
        
        return Response({
            'success': True,
            'data': serializer.data,
            'message': f'Successfully generated {len(questions)} questions for {category}'
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answers(request):
    """
    Submit quiz answers and get results
    POST /interviews/quiz/submit/
    Body: { 
        "question_set_id": "uuid",
        "answers": ["Answer1", "Answer2", ...],
        "time_taken_seconds": 180
    }
    """
    serializer = SubmitAnswersSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'error': 'Invalid submission data',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        question_set_id = serializer.validated_data['question_set_id']
        user_answers = serializer.validated_data['answers']
        time_taken = serializer.validated_data.get('time_taken_seconds')
        
        # Get question set
        try:
            question_set = QuestionSet.objects.get(id=question_set_id)
        except QuestionSet.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Question set not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Verify question set belongs to user
        if question_set.user != request.user:
            return Response({
                'success': False,
                'error': 'Unauthorized access to question set'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Verify question set is still valid
        if not question_set.is_valid():
            return Response({
                'success': False,
                'error': 'Question set has expired or already been used'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify hash integrity
        if not question_set.verify_hash():
            return Response({
                'success': False,
                'error': 'Question set integrity check failed'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate answer count
        if len(user_answers) != len(question_set.questions):
            return Response({
                'success': False,
                'error': f'Expected {len(question_set.questions)} answers, got {len(user_answers)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate score
        correct_count = 0
        for i, question in enumerate(question_set.questions):
            if user_answers[i] == question['correctAnswer']:
                correct_count += 1
        
        total_questions = len(question_set.questions)
        score = int((correct_count / total_questions) * 100)
        
        # Generate improvement tip with AI (optional)
        improvement_tip = ""
        if model and score < 70:
            try:
                tip_prompt = f"""
The user scored {score}% on a {question_set.category} quiz (difficulty: {question_set.difficulty}).
They got {correct_count} out of {total_questions} questions correct.

Provide a brief, encouraging improvement tip (2-3 sentences) focusing on:
1. What areas they should focus on
2. Specific resources or topics to study
3. Encouragement to keep learning

Keep it concise and actionable.
"""
                tip_result = model.generate_content(tip_prompt)
                improvement_tip = tip_result.text.strip()
            except:
                improvement_tip = f"Focus on strengthening your {question_set.category} fundamentals. Review the questions you missed and practice similar problems."
        elif score >= 70:
            improvement_tip = f"Great job! You demonstrated solid knowledge in {question_set.category}. Keep practicing to maintain your skills."
        
        # Create assessment record
        assessment = Assessment.objects.create(
            user=request.user,
            question_set=question_set,
            category=question_set.category,
            score=score,
            total_questions=total_questions,
            correct_answers=correct_count,
            answers=user_answers,
            time_taken_seconds=time_taken,
            improvement_tip=improvement_tip
        )
        
        # Mark question set as used
        question_set.used = True
        question_set.save()
        
        # Return results with detailed feedback
        result_data = {
            'assessment_id': str(assessment.id),
            'score': score,
            'correct_answers': correct_count,
            'total_questions': total_questions,
            'passed': assessment.passed,
            'improvement_tip': improvement_tip,
            'time_taken_seconds': time_taken,
            'category': question_set.category,
            'detailed_results': [
                {
                    'question': q['question'],
                    'user_answer': user_answers[i],
                    'correct_answer': q['correctAnswer'],
                    'is_correct': user_answers[i] == q['correctAnswer'],
                    'explanation': q['explanation']
                }
                for i, q in enumerate(question_set.questions)
            ]
        }
        
        return Response({
            'success': True,
            'data': result_data
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_assessments(request):
    """
    Get user's assessment history
    GET /interviews/quiz/assessments/?category=Programming
    """
    category = request.query_params.get('category')
    
    assessments = Assessment.objects.filter(user=request.user)
    
    if category:
        assessments = assessments.filter(category=category)
    
    serializer = AssessmentSerializer(assessments, many=True)
    
    # Calculate statistics
    if assessments.exists():
        stats = {
            'total_assessments': assessments.count(),
            'average_score': int(assessments.aggregate(models.Avg('score'))['score__avg']),
            'best_score': assessments.aggregate(models.Max('score'))['score__max'],
            'passed_count': assessments.filter(score__gte=70).count()
        }
    else:
        stats = {
            'total_assessments': 0,
            'average_score': 0,
            'best_score': 0,
            'passed_count': 0
        }
    
    return Response({
        'success': True,
        'data': serializer.data,
        'stats': stats
    })


@api_view(['GET'])
@permission_classes([])  # Public endpoint - no authentication required
def get_categories(request):
    """
    Get available quiz categories (Public endpoint)
    GET /interviews/quiz/categories/
    """
    categories = [
        {
            'value': choice[0],
            'label': choice[1],
            'icon': '📚'  # You can customize icons per category
        }
        for choice in QuizCategory.CATEGORIES
    ]
    
    return Response({
        'success': True,
        'data': categories
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_rate_limit_status(request):
    """
    Get user's current rate limit status
    GET /interviews/quiz/rate-limit-status/
    """
    now = timezone.now()
    hour_ago = now - timedelta(hours=1)
    day_ago = now - timedelta(days=1)
    
    quiz_hourly = RateLimit.objects.filter(
        user=request.user,
        action='quiz_generation',
        window_start__gte=hour_ago
    ).count()
    
    quiz_daily = RateLimit.objects.filter(
        user=request.user,
        action='quiz_generation',
        window_start__gte=day_ago
    ).count()
    
    return Response({
        'success': True,
        'data': {
            'quiz_generation': {
                'used_hourly': quiz_hourly,
                'limit_hourly': RATE_LIMITS['quiz_generation']['per_hour'],
                'remaining_hourly': max(0, RATE_LIMITS['quiz_generation']['per_hour'] - quiz_hourly),
                'used_daily': quiz_daily,
                'limit_daily': RATE_LIMITS['quiz_generation']['per_day'],
                'remaining_daily': max(0, RATE_LIMITS['quiz_generation']['per_day'] - quiz_daily)
            }
        }
    })
