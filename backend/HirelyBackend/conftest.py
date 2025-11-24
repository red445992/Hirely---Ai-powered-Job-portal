"""
Pytest configuration and fixtures for testing
"""
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from jobs.models import Job
from applications.models import Application

User = get_user_model()


@pytest.fixture
def api_client():
    """Return API client for testing"""
    return APIClient()


@pytest.fixture
def authenticated_client(api_client, employer_user):
    """Return authenticated API client"""
    api_client.force_authenticate(user=employer_user)
    return api_client


@pytest.fixture
def employer_user(db):
    """Create and return employer user"""
    user = User.objects.create_user(
        username='employer_test',
        email='employer@test.com',
        password='testpass123'
    )
    user.user_type = 'employer'
    user.save()
    return user


@pytest.fixture
def candidate_user(db):
    """Create and return candidate user"""
    user = User.objects.create_user(
        username='candidate_test',
        email='candidate@test.com',
        password='testpass123'
    )
    user.user_type = 'candidate'
    user.save()
    return user


@pytest.fixture
def sample_job(employer_user):
    """Create and return a sample job"""
    from decimal import Decimal
    return Job.objects.create(
        employer=employer_user,
        title='Senior Python Developer',
        description='We are looking for an experienced Python developer with Django expertise.',
        company='Test Company',
        location='Remote',
        category='programming',
        level='senior',
        salary=Decimal('120000.00'),
        salary_display='$100,000 - $150,000',
        job_type='full_time',
        is_active=True,
        skills='Python, Django, PostgreSQL, REST API',
        requirements='5+ years experience in Python development',
        responsibilities='Develop and maintain backend services'
    )


@pytest.fixture
def sample_application(sample_job, candidate_user):
    """Create and return a sample application"""
    return Application.objects.create(
        job=sample_job,
        applicant=candidate_user,
        full_name='Test Candidate',
        email='candidate@test.com',
        phone='+1234567890',
        status='pending'
    )


@pytest.fixture
def multiple_jobs(employer_user):
    """Create multiple jobs for testing"""
    from decimal import Decimal
    jobs = []
    for i in range(3):
        job = Job.objects.create(
            employer=employer_user,
            title=f'Job Position {i+1}',
            description=f'Description for job {i+1}',
            company='Test Company',
            location='Remote',
            category='programming',
            level='mid',
            salary=Decimal('90000.00'),
            salary_display='$80,000 - $100,000',
            job_type='full_time',
            is_active=True
        )
        jobs.append(job)
    return jobs
