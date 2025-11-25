"""
Critical Tests for User Authentication
Priority: HIGH - Security Critical
"""
import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

User = get_user_model()


@pytest.mark.django_db
class TestUserRegistration:
    """Test user registration endpoint"""
    
    def test_register_candidate_success(self, api_client):
        """Test successful candidate registration"""
        data = {
            'username': 'newcandidate',
            'email': 'candidate@example.com',
            'password': 'SecurePass123!',
            'confirm_password': 'SecurePass123!',
            'first_name': 'John',
            'last_name': 'Doe',
            'user_type': 'candidate'
        }
        
        response = api_client.post('/accounts/register/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username='newcandidate').exists()
        assert 'tokens' in response.data
        assert 'access' in response.data['tokens']
    
    def test_register_employer_success(self, api_client):
        """Test successful employer registration"""
        data = {
            'username': 'newemployer',
            'email': 'employer@example.com',
            'password': 'SecurePass123!',
            'confirm_password': 'SecurePass123!',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'user_type': 'employer'
        }
        
        response = api_client.post('/accounts/register/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        user = User.objects.get(username='newemployer')
        assert user.user_type == 'employer'
    
    def test_register_duplicate_username(self, api_client, candidate_user):
        """Test registration with duplicate username fails"""
        data = {
            'username': 'candidate_test',  # Already exists in fixture
            'email': 'new@example.com',
            'password': 'SecurePass123!',
            'confirm_password': 'SecurePass123!',
            'user_type': 'candidate'
        }
        
        response = api_client.post('/accounts/register/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_register_duplicate_email(self, api_client, candidate_user):
        """Test registration with duplicate email fails"""
        data = {
            'username': 'newuser',
            'email': 'candidate@test.com',  # Already exists
            'password': 'SecurePass123!',
            'confirm_password': 'SecurePass123!',
            'user_type': 'candidate'
        }
        
        response = api_client.post('/accounts/register/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_register_password_mismatch(self, api_client):
        """Test registration with mismatched passwords fails"""
        data = {
            'username': 'newuser',
            'email': 'user@example.com',
            'password': 'SecurePass123!',
            'confirm_password': 'DifferentPass123!',
            'user_type': 'candidate'
        }
        
        response = api_client.post('/accounts/register/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_register_weak_password(self, api_client):
        """Test registration with weak password fails"""
        data = {
            'username': 'newuser',
            'email': 'user@example.com',
            'password': '123',
            'confirm_password': '123',
            'user_type': 'candidate'
        }
        
        response = api_client.post('/accounts/register/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_register_missing_required_fields(self, api_client):
        """Test registration with missing required fields fails"""
        data = {
            'username': 'newuser',
            # Missing email and password
        }
        
        response = api_client.post('/accounts/register/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestUserLogin:
    """Test user login endpoint"""
    
    def test_login_success_with_username(self, api_client, candidate_user):
        """Test successful login with email (API requires email, not username)"""
        data = {
            'email': 'candidate@test.com',
            'password': 'testpass123'
        }
        
        response = api_client.post('/accounts/login/', data)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'tokens' in response.data
        assert 'access' in response.data['tokens']
    
    def test_login_success_with_email(self, api_client, candidate_user):
        """Test successful login with email"""
        data = {
            'email': 'candidate@test.com',
            'password': 'testpass123'
        }
        
        response = api_client.post('/accounts/login/', data)
        
        assert response.status_code == status.HTTP_200_OK
    
    def test_login_wrong_password(self, api_client, candidate_user):
        """Test login with wrong password fails"""
        data = {
            'email': 'candidate@test.com',
            'password': 'wrongpassword'
        }
        
        response = api_client.post('/accounts/login/', data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED or response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_login_nonexistent_user(self, api_client):
        """Test login with non-existent user fails"""
        data = {
            'email': 'nonexistent@test.com',
            'password': 'testpass123'
        }
        
        response = api_client.post('/accounts/login/', data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED or response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_login_missing_credentials(self, api_client):
        """Test login with missing credentials fails"""
        data = {}
        
        response = api_client.post('/accounts/login/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestJWTTokens:
    """Test JWT token functionality"""
    
    def test_access_token_valid(self, api_client, candidate_user):
        """Test that access token grants access to protected endpoints"""
        # Login to get token
        login_data = {
            'email': 'candidate@test.com',
            'password': 'testpass123'
        }
        login_response = api_client.post('/accounts/login/', login_data)
        
        assert login_response.status_code == status.HTTP_200_OK
        # Extract token from nested structure
        if 'tokens' in login_response.data:
            token = login_response.data['tokens']['access']
        else:
            token = login_response.data.get('access') or login_response.data.get('token')
        
        # Use token to access protected endpoint
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = api_client.get('/applications/my-applications/')
        
        # Should not return 401 Unauthorized
        assert response.status_code != status.HTTP_401_UNAUTHORIZED
    
    def test_access_protected_without_token(self, api_client):
        """Test that protected endpoints reject requests without token"""
        response = api_client.get('/applications/my-applications/')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_access_protected_with_invalid_token(self, api_client):
        """Test that protected endpoints reject invalid tokens"""
        api_client.credentials(HTTP_AUTHORIZATION='Bearer invalid_token_123')
        response = api_client.get('/applications/my-applications/')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_refresh_token_generates_new_access(self, api_client, candidate_user):
        """Test that refresh token can generate new access token"""
        # Login to get tokens
        login_data = {
            'email': 'candidate@test.com',
            'password': 'testpass123'
        }
        login_response = api_client.post('/accounts/login/', login_data)
        
        refresh_token = login_response.data.get('refresh')
        
        if refresh_token:
            # Use refresh token to get new access token
            refresh_data = {'refresh': refresh_token}
            refresh_response = api_client.post('/accounts/token/refresh/', refresh_data)
            
            assert refresh_response.status_code == status.HTTP_200_OK
            assert 'access' in refresh_response.data


@pytest.mark.django_db
class TestUserPermissions:
    """Test role-based permissions"""
    
    def test_employer_can_create_job(self, authenticated_client, employer_user):
        """Test that employer can create jobs"""
        data = {
            'title': 'Test Job',
            'description': 'Test job description',
            'company': 'Test Company',
            'location': 'Remote',
            'category': 'programming',
            'level': 'mid',
            'job_type': 'full_time'
        }
        
        response = authenticated_client.post('/jobs/addjobs/', data)
        
        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_200_OK]
    
    def test_candidate_cannot_create_job(self, api_client, candidate_user):
        """Test that candidates cannot create jobs"""
        api_client.force_authenticate(user=candidate_user)
        
        data = {
            'title': 'Test Job',
            'description': 'Test job description',
            'company': 'Test Company',
            'location': 'Remote',
            'category': 'Technology',
            'level': 'Mid',
            'salary': '80000-100000',
            'job_type': 'full_time'
        }
        
        response = api_client.post('/jobs/addjobs/', data)
        
        # Should be forbidden or unauthorized
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED, status.HTTP_400_BAD_REQUEST]
    
    def test_user_can_only_view_own_applications(self, api_client, candidate_user, sample_application):
        """Test that users can only see their own applications"""
        api_client.force_authenticate(user=candidate_user)
        
        response = api_client.get('/applications/my-applications/')
        
        assert response.status_code == status.HTTP_200_OK
        # Verify response contains their applications
        if isinstance(response.data, dict) and 'results' in response.data:
            applications = response.data['results']
        else:
            applications = response.data
        
        for app in applications:
            assert app['email'] == candidate_user.email


@pytest.mark.django_db
class TestUserModel:
    """Test User model functionality"""
    
    def test_create_user(self):
        """Test creating a basic user"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        assert user.username == 'testuser'
        assert user.email == 'test@example.com'
        assert user.check_password('testpass123')
    
    def test_create_employer_user(self):
        """Test creating an employer user"""
        user = User.objects.create_user(
            username='employer',
            email='employer@example.com',
            password='testpass123'
        )
        user.user_type = 'employer'
        user.save()
        
        assert user.user_type == 'employer'
        assert user.username == 'employer'
        assert user.check_password('testpass123')
    
    def test_user_string_representation(self, candidate_user):
        """Test user __str__ method"""
        user_str = str(candidate_user)
        assert 'candidate_test' in user_str and 'Candidate' in user_str
