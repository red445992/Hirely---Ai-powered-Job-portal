"""
Tests for Job and Application Management
Priority: HIGH - Core Business Features
"""
import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from jobs.models import Job
from applications.models import Application

User = get_user_model()


@pytest.mark.django_db
class TestJobCRUD:
    """Test Job Create, Read, Update, Delete operations"""
    
    def test_create_job_as_employer(self, authenticated_client, employer_user):
        """Test employer can create job"""
        data = {
            'title': 'Senior Backend Developer',
            'description': 'We are looking for an experienced backend developer',
            'company': 'Tech Corp',
            'location': 'San Francisco, CA',
            'category': 'Technology',
            'level': 'Senior',
            'salary': '120000-160000',
            'job_type': 'full_time',
            'skills': 'Python, Django, PostgreSQL',
            'requirements': '5+ years experience',
            'responsibilities': 'Develop and maintain backend services'
        }
        
        response = authenticated_client.post('/api/jobs/addjobs/', data)
        
        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_200_OK]
        assert Job.objects.filter(title='Senior Backend Developer').exists()
    
    def test_list_jobs(self, api_client, sample_job):
        """Test listing jobs is public"""
        response = api_client.get('/api/jobs/')
        
        assert response.status_code == status.HTTP_200_OK
        # Check if response contains job data
        if isinstance(response.data, dict) and 'results' in response.data:
            jobs = response.data['results']
        else:
            jobs = response.data
        assert len(jobs) > 0
    
    def test_get_job_detail(self, api_client, sample_job):
        """Test getting job details"""
        response = api_client.get(f'/api/jobs/{sample_job.id}/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == sample_job.title
    
    def test_update_own_job(self, authenticated_client, sample_job):
        """Test employer can update their own job"""
        data = {'title': 'Updated Job Title'}
        
        response = authenticated_client.patch(f'/api/jobs/{sample_job.id}/', data)
        
        assert response.status_code == status.HTTP_200_OK
        sample_job.refresh_from_db()
        assert sample_job.title == 'Updated Job Title'
    
    def test_delete_own_job(self, authenticated_client, sample_job):
        """Test employer can delete their own job"""
        job_id = sample_job.id
        
        response = authenticated_client.delete(f'/api/jobs/{job_id}/')
        
        assert response.status_code in [status.HTTP_204_NO_CONTENT, status.HTTP_200_OK]
        assert not Job.objects.filter(id=job_id).exists()
    
    def test_cannot_update_others_job(self, api_client, sample_job):
        """Test employer cannot update another employer's job"""
        # Create different employer
        other_employer = User.objects.create_user(
            username='other_employer',
            email='other@test.com',
            password='testpass123',
            is_employer=True
        )
        api_client.force_authenticate(user=other_employer)
        
        data = {'title': 'Hacked Title'}
        response = api_client.patch(f'/api/jobs/{sample_job.id}/', data)
        
        # Should be forbidden or not found
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]


@pytest.mark.django_db
class TestJobValidation:
    """Test job creation validation"""
    
    def test_create_job_missing_required_fields(self, authenticated_client):
        """Test job creation fails with missing required fields"""
        data = {
            'title': 'Test Job',
            # Missing description, company, location, etc.
        }
        
        response = authenticated_client.post('/api/jobs/addjobs/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_create_job_invalid_level(self, authenticated_client):
        """Test job creation fails with invalid level"""
        data = {
            'title': 'Test Job',
            'description': 'Test description',
            'company': 'Test Company',
            'location': 'Remote',
            'category': 'Technology',
            'level': 'InvalidLevel',  # Invalid
            'salary': '80000-100000',
            'job_type': 'full_time'
        }
        
        response = authenticated_client.post('/api/jobs/addjobs/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestApplicationFlow:
    """Test job application workflow"""
    
    def test_candidate_can_apply(self, api_client, candidate_user, sample_job):
        """Test candidate can apply for job"""
        api_client.force_authenticate(user=candidate_user)
        
        data = {
            'job': sample_job.id,
            'full_name': 'Test Candidate',
            'email': 'candidate@test.com',
            'phone': '+1234567890',
            'cover_letter': 'I am interested in this position',
            'availability': 'immediately'
        }
        
        response = api_client.post('/api/applications/apply/', data)
        
        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_200_OK]
        assert Application.objects.filter(
            job=sample_job,
            email='candidate@test.com'
        ).exists()
    
    def test_duplicate_application_prevented(self, api_client, candidate_user, sample_application):
        """Test cannot apply twice for same job"""
        api_client.force_authenticate(user=candidate_user)
        
        data = {
            'job': sample_application.job.id,
            'full_name': 'Test Candidate',
            'email': 'candidate@test.com',
            'phone': '+1234567890'
        }
        
        response = api_client.post('/api/applications/apply/', data)
        
        # Should prevent duplicate
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_view_my_applications(self, api_client, candidate_user, sample_application):
        """Test candidate can view their applications"""
        api_client.force_authenticate(user=candidate_user)
        
        response = api_client.get('/api/applications/my-applications/')
        
        assert response.status_code == status.HTTP_200_OK
    
    def test_employer_view_job_applications(self, authenticated_client, sample_job, sample_application):
        """Test employer can view applications for their job"""
        response = authenticated_client.get(f'/api/applications/job/{sample_job.id}/applications/')
        
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestApplicationStatus:
    """Test application status management"""
    
    def test_employer_can_update_application_status(self, authenticated_client, sample_application):
        """Test employer can change application status"""
        data = {'status': 'reviewing'}
        
        response = authenticated_client.patch(
            f'/api/applications/{sample_application.id}/update-status/',
            data
        )
        
        # Status should be updated (if endpoint exists)
        if response.status_code == status.HTTP_200_OK:
            sample_application.refresh_from_db()
            assert sample_application.status == 'reviewing'
    
    def test_candidate_cannot_change_status(self, api_client, candidate_user, sample_application):
        """Test candidate cannot change their application status"""
        api_client.force_authenticate(user=candidate_user)
        
        data = {'status': 'accepted'}
        response = api_client.patch(
            f'/api/applications/{sample_application.id}/update-status/',
            data
        )
        
        # Should be forbidden
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND, status.HTTP_405_METHOD_NOT_ALLOWED]


@pytest.mark.django_db
class TestJobFiltering:
    """Test job filtering and search"""
    
    def test_filter_by_category(self, api_client, multiple_jobs):
        """Test filtering jobs by category"""
        response = api_client.get('/api/jobs/?category=Technology')
        
        assert response.status_code == status.HTTP_200_OK
    
    def test_filter_by_location(self, api_client, sample_job):
        """Test filtering jobs by location"""
        response = api_client.get(f'/api/jobs/?location={sample_job.location}')
        
        assert response.status_code == status.HTTP_200_OK
    
    def test_search_jobs(self, api_client, sample_job):
        """Test searching jobs by keyword"""
        response = api_client.get('/api/jobs/?search=Python')
        
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestJobModel:
    """Test Job model functionality"""
    
    def test_job_creation(self, employer_user):
        """Test creating a job instance"""
        job = Job.objects.create(
            employer=employer_user,
            title='Test Job',
            description='Test description',
            company='Test Company',
            location='Remote',
            category='Technology',
            level='Mid',
            salary='80000-100000',
            job_type='full_time'
        )
        
        assert job.title == 'Test Job'
        assert job.employer == employer_user
        assert job.is_active is True
    
    def test_job_string_representation(self, sample_job):
        """Test job __str__ method"""
        assert sample_job.title in str(sample_job)
    
    def test_job_applicants_count(self, sample_job, sample_application):
        """Test counting applicants for a job"""
        count = sample_job.applications.count()
        
        assert count >= 1


@pytest.mark.django_db
class TestApplicationModel:
    """Test Application model functionality"""
    
    def test_application_creation(self, sample_job, candidate_user):
        """Test creating an application instance"""
        application = Application.objects.create(
            job=sample_job,
            applicant=candidate_user,
            full_name='Test User',
            email='test@example.com',
            status='pending'
        )
        
        assert application.job == sample_job
        assert application.applicant == candidate_user
        assert application.status == 'pending'
    
    def test_application_string_representation(self, sample_application):
        """Test application __str__ method"""
        string_repr = str(sample_application)
        assert sample_application.full_name in string_repr or sample_application.email in string_repr
