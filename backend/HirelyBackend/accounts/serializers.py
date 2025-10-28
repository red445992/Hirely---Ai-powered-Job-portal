"""
Serializers for User model and authentication
"""

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    Handles user creation with password validation
    Company field is optional - can be filled later
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=8,
        error_messages={
            'min_length': 'Password must be at least 8 characters long.'
        }
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'confirm_password',
            'user_type', 'first_name', 'last_name', 'phone_number', 'company'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'company': {'required': False, 'allow_blank': True},  # ✅ Company is optional
            'phone_number': {'required': False, 'allow_blank': True},
        }


    def validate_email(self, value):
        """
        Validate that email is unique
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        """
        Validate that username is unique
        """
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate(self, attrs):
        """
        Validate that passwords match and meet requirements
        """
        password = attrs.get('password')
        confirm_password = attrs.pop('confirm_password', None)

        # Check if passwords match
        if password != confirm_password:
            raise serializers.ValidationError({
                'confirm_password': "Passwords do not match."
            })

        # Validate password strength
        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError({
                'password': list(e.messages)
            })

        # ✅ REMOVED company validation for employers
        # Company is now optional and can be filled later
        
        return attrs

    def create(self, validated_data):
        """
        Create and return a new user instance
        """
        # Extract password and remove from validated_data
        password = validated_data.pop('password')
        
        # Handle optional company field - set to empty string if not provided
        if 'company' not in validated_data:
            validated_data['company'] = ''
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Set password (this will be hashed)
        user.set_password(password)
        user.save()
        
        return user



class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        """
        Validate login credentials
        """
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError("Both email and password are required.")

        return attrs

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile (read-only for now)
    """
    full_name = serializers.SerializerMethodField()
    user_type_display = serializers.CharField(source='get_user_type_display', read_only=True)
    has_company_profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'user_type', 'user_type_display', 'phone_number', 'company', 'bio',
            'profile_picture', 'date_joined', 'last_login', 'has_company_profile'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']

    def get_full_name(self, obj):
        """
        Return user's full name
        """
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_has_company_profile(self, obj):
        """
        Check if employer has completed company profile
        """
        if obj.user_type == 'employer':
            return bool(obj.company and obj.company.strip())
        return None

class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile
    """
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone_number', 'company', 'bio', 'profile_picture'
        ]
        extra_kwargs = {
            'company': {'required': False, 'allow_blank': True},  # ✅ Still optional in updates
        }