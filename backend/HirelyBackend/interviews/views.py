from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings
from .models import Interview
from .serializers import InterviewSerializer, InterviewCreateSerializer
from pathlib import Path

def get_random_interview_cover(user_id=None):
    """Generate deterministic cover image based on user ID"""
    covers = [
        '/covers/google.png',
        '/covers/microsoft.png', 
        '/covers/apple.png',
        '/covers/meta.png',
        '/covers/amazon.png',
        '/covers/netflix.png',
        '/covers/spotify.png',
        '/covers/airbnb.png',
        '/covers/uber.png',
        '/covers/twitter.png'
    ]
    
    if user_id:
        # Create deterministic selection based on user_id
        hash_val = hash(str(user_id))
        index = abs(hash_val) % len(covers)
        return covers[index]
    
    return covers[0]

def generate_questions_with_ai(role, level, techstack, interview_type, amount):
    """Generate interview questions using AI (placeholder for now)"""
    # For now, we'll generate sample questions
    # You can integrate with OpenAI, Google AI, or any other AI service here
    
    tech_str = ', '.join(techstack) if techstack else 'General'
    
    if interview_type.lower() == 'technical':
        questions = [
            f"What is your experience with {role} development?",
            f"How would you implement a scalable solution using {tech_str}?",
            f"Explain the architecture you would use for a {role} project.",
            f"What are the best practices for {tech_str} development?",
            f"How do you handle performance optimization in {role} applications?",
            f"Describe your experience with testing in {tech_str} environments.",
            f"How would you debug a complex issue in a {role} application?",
            f"What design patterns do you use in {role} development?",
        ]
    elif interview_type.lower() == 'behavioral':
        questions = [
            f"Tell me about a challenging {role} project you worked on.",
            "Describe a time when you had to work with a difficult team member.",
            "How do you handle tight deadlines and pressure?",
            "Give an example of when you had to learn a new technology quickly.",
            "Describe a time when you made a mistake and how you handled it.",
            "How do you stay updated with the latest technology trends?",
            "Tell me about a time you had to mentor a junior developer.",
            "Describe your approach to code reviews and collaboration.",
        ]
    else:  # Mixed
        questions = [
            f"What interests you about {role} development?",
            f"How would you approach learning {tech_str}?",
            "Describe your development process for a new feature.",
            f"What challenges do you see in {role} development?",
            "How do you balance technical debt with new feature development?",
            "Tell me about a time you had to make a technical decision.",
            f"What tools do you use for {role} development?",
            "How do you ensure code quality in your projects?",
        ]
    
    # Return the requested amount of questions
    return questions[:amount]

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_interview(request):
    """Generate interview questions and save interview"""
    serializer = InterviewCreateSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'error': 'Invalid data provided',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        data = serializer.validated_data
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return Response({
                'success': False,
                'error': 'Authentication required to generate interviews'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate questions
        questions = generate_questions_with_ai(
            role=data['role'],
            level=data['level'], 
            techstack=data.get('techstack', []),
            interview_type=data['type'],
            amount=data['amount']
        )
        
        # Create interview instance
        interview = Interview.objects.create(
            user=request.user,
            role=data['role'],
            type=data['type'],
            level=data['level'],
            techstack=data.get('techstack', []),
            questions=questions,
            cover_image=get_random_interview_cover(request.user.id),
            finalized=True
        )
        
        # Serialize and return
        response_serializer = InterviewSerializer(interview)
        
        return Response({
            'success': True,
            'data': {
                'interview_id': str(interview.id),
                'interview': response_serializer.data,
                'questions_generated': len(questions)
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Failed to generate interview: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class InterviewListCreateView(generics.ListCreateAPIView):
    serializer_class = InterviewSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # If user is authenticated, filter by user, otherwise return all
        if self.request.user.is_authenticated:
            return Interview.objects.filter(user=self.request.user)
        return Interview.objects.all()

class InterviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InterviewSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'
    
    def get_queryset(self):
        # If user is authenticated, filter by user, otherwise return all
        if self.request.user.is_authenticated:
            return Interview.objects.filter(user=self.request.user)
        return Interview.objects.all()

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint"""
    return Response({
        'success': True,
        'message': 'Interview API is working!',
        'timestamp': Interview.objects.count()
    })
