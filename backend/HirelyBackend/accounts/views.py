"""
Views for user authentication and profile management
"""

from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import logging
from django.contrib.auth import get_user_model

from .models import User
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserUpdateSerializer
)

User = get_user_model()

# Configure module logger
logger = logging.getLogger(__name__)


class UserRegistrationView(generics.CreateAPIView):
    """
    View for user registration
    POST /api/auth/register/
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        """
        Handle user registration
        """
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            try:
                user = serializer.save()
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                
                response_data = {
                    'success': True,
                    'message': 'User registered successfully',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'user_type': user.user_type,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                    },
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }
                
                return Response(response_data, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                return Response({
                    'success': False,
                    'message': 'Registration failed',
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        
        else:
            return Response({
                'success': False,
                'message': 'Invalid data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def user_login_view(request):
    """
    User login view
    POST /api/auth/login/
    """
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            # Get user by email
            try:
                user = User.objects.get(email=email)
                logger.debug("Login attempt for email=%s: user found (username=%s)", email, user.username)
            except User.DoesNotExist:
                logger.debug("Login attempt for email=%s: no user found", email)
                return Response({
                    'success': False,
                    'message': 'No user found with this email'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Authenticate user (using username since we extend AbstractUser)
            user_auth = authenticate(username=user.username, password=password)
            if user_auth is None:
                # Password incorrect or inactive — log check without revealing password
                pwd_ok = user.check_password(password)
                logger.debug("Password check for user %s: %s", user.username, pwd_ok)
            else:
                logger.debug("Authentication succeeded for user %s", user.username)
            user = user_auth
            
            if user is not None:
                if user.is_active:
                    # Generate JWT tokens
                    refresh = RefreshToken.for_user(user)
                    
                    response_data = {
                        'success': True,
                        'message': 'Login successful',
                        'user': {
                            'id': user.id,
                            'username': user.username,
                            'email': user.email,
                            'user_type': user.user_type,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                        },
                        'tokens': {
                            'refresh': str(refresh),
                            'access': str(refresh.access_token),
                        }
                    }
                    
                    return Response(response_data, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'success': False,
                        'message': 'Account is disabled'
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    'success': False,
                    'message': 'Invalid credentials'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'No user found with this email'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    else:
        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    View for user profile - retrieve and update
    GET, PUT, PATCH /api/auth/profile/
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """
        Return the current authenticated user
        """
        return self.request.user

    def get_serializer_class(self):
        """
        Use different serializers for different actions
        """
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserProfileSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        Get user profile
        """
        try:
            user = self.get_object()
            serializer = self.get_serializer(user)
            
            return Response({
                'success': True,
                'user': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Failed to fetch profile',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Update user profile
        """
        try:
            user = self.get_object()
            serializer = self.get_serializer(user, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                
                # Return updated profile data
                profile_serializer = UserProfileSerializer(user)
                
                return Response({
                    'success': True,
                    'message': 'Profile updated successfully',
                    'user': profile_serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'message': 'Invalid data',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Failed to update profile',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def user_logout_view(request):
    """
    User logout view
    POST /api/auth/logout/
    """
    try:
        # Blacklist the refresh token
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'success': True,
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Logout failed',
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check_view(request):
    """
    Health check endpoint
    GET /api/auth/health/
    """
    return Response({
        'success': True,
        'message': 'Authentication service is running',
        'status': 'healthy'
    }, status=status.HTTP_200_OK)