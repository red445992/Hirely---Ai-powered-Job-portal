# applications/views.py
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from jobs.utils.resume_scorer import analyze_resume
from .models import Application

from .models import Application, ApplicationStatusHistory
from .serializers import (
    ApplicationCreateSerializer,
    ApplicationListSerializer,
    ApplicationDetailSerializer,
    ApplicationStatusUpdateSerializer,
    ApplicationStatsSerializer
)
from jobs.models import Job


class ApplicationCreateView(generics.CreateAPIView):
    """Create a new job application"""
    queryset = Application.objects.all()
    serializer_class = ApplicationCreateSerializer
    permission_classes = [permissions.AllowAny]  # Allow anonymous applications
    parser_classes = [MultiPartParser, FormParser]  # Handle file uploads
    
    def perform_create(self, serializer):
        # Link to authenticated user if logged in
        if self.request.user.is_authenticated:
            serializer.save(applicant=self.request.user)
        else:
            serializer.save()


class ApplicationListView(generics.ListAPIView):
    """List applications for employers"""
    serializer_class = ApplicationListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Filter applications based on user role
        if user.is_superuser:
            # Admin can see all applications
            queryset = Application.objects.all()
        else:
            # Employers can only see applications for their jobs
            queryset = Application.objects.filter(job__employer=user)
        
        # Apply filters
        job_id = self.request.query_params.get('job', None)
        status_filter = self.request.query_params.get('status', None)
        search = self.request.query_params.get('search', None)
        
        if job_id:
            queryset = queryset.filter(job_id=job_id)
            
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search) |
                Q(email__icontains=search) |
                Q(job__title__icontains=search)
            )
            
        return queryset.select_related('job')


class ApplicationDetailView(generics.RetrieveUpdateAPIView):
    """View and update a specific application"""
    serializer_class = ApplicationDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Application.objects.all()
        else:
            return Application.objects.filter(job__employer=user)
    
    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return ApplicationStatusUpdateSerializer
        return ApplicationDetailSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Mark as viewed by employer
        if not instance.viewed_by_employer:
            instance.viewed_by_employer = True
            instance.save(update_fields=['viewed_by_employer'])
            
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class JobApplicationsView(generics.ListAPIView):
    """List all applications for a specific job"""
    serializer_class = ApplicationListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        job_id = self.kwargs['job_id']
        user = self.request.user
        
        # Verify user owns this job or is admin
        job = get_object_or_404(Job, id=job_id)
        if not user.is_superuser and job.employer != user:
            return Application.objects.none()
        
        return Application.objects.filter(job_id=job_id).select_related('job')


class ApplicationsByUserView(generics.ListAPIView):
    """List applications submitted by the authenticated user"""
    serializer_class = ApplicationDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Application.objects.filter(
            Q(applicant=user) | Q(email=user.email)
        ).select_related('job')


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def application_stats(request):
    """Get application statistics for the authenticated user"""
    user = request.user
    
    if user.is_superuser:
        # Admin sees all stats
        queryset = Application.objects.all()
    elif user.user_type == 'employer':
        # Employers see stats for their jobs only
        queryset = Application.objects.filter(job__employer=user)
    elif user.user_type == 'candidate':
        # Candidates see stats for their own applications (by user or email)
        queryset = Application.objects.filter(
            Q(applicant=user) | Q(email=user.email)
        )
    else:
        # Default: no applications
        queryset = Application.objects.none()
    
    stats = {
        'total_applications': queryset.count(),
        'pending_applications': queryset.filter(status='pending').count(),
        'shortlisted_applications': queryset.filter(status='shortlisted').count(),
        'accepted_applications': queryset.filter(status='accepted').count(),
        'rejected_applications': queryset.filter(status='rejected').count(),
        'recent_applications': queryset.filter(
            applied_at__gte=timezone.now() - timedelta(days=7)
        ).count(),
    }
    
    serializer = ApplicationStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def bulk_update_applications(request):
    """Bulk update application statuses"""
    application_ids = request.data.get('application_ids', [])
    new_status = request.data.get('status')
    notes = request.data.get('notes', '')
    
    if not application_ids or not new_status:
        return Response(
            {'error': 'application_ids and status are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = request.user
    
    # Get applications that user can modify
    if user.is_superuser:
        applications = Application.objects.filter(id__in=application_ids)
    else:
        applications = Application.objects.filter(
            id__in=application_ids,
            job__employer=user
        )
    
    updated_count = 0
    for app in applications:
        old_status = app.status
        app.status = new_status
        app.save()
        
        # Create status history
        ApplicationStatusHistory.objects.create(
            application=app,
            old_status=old_status,
            new_status=new_status,
            changed_by=user,
            notes=notes
        )
        updated_count += 1
    
    return Response({
        'message': f'Updated {updated_count} applications',
        'updated_count': updated_count
    })


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_application(request, pk):
    """Delete an application (admin or job owner only)"""
    user = request.user
    
    try:
        if user.is_superuser:
            application = Application.objects.get(pk=pk)
        else:
            application = Application.objects.get(pk=pk, job__employer=user)
        
        application.delete()
        return Response({'message': 'Application deleted successfully'})
        
    except Application.DoesNotExist:
        return Response(
            {'error': 'Application not found or you do not have permission to delete it'}, 
            status=status.HTTP_404_NOT_FOUND
        )


# Import timezone and timedelta for stats view
from django.utils import timezone
from datetime import timedelta






@api_view(["GET"])
@permission_classes([IsAuthenticated])
def resume_dashboard_view(request, job_id):
    """Return ranked list of candidates for a given job ID."""
    applications = Application.objects.filter(job_id=job_id).select_related("applicant", "job")

    results = []
    for app in applications:
        # Skip applications without resumes or applicants
        if not app.resume or not app.applicant:
            continue
        resume_path = app.resume.path
        job_desc = app.job.description or ""
        analysis = analyze_resume(resume_path, job_desc)

        results.append({
            "candidate": app.applicant.username,
            "candidate_name": app.full_name,
            "email": app.email,
            "score": analysis["score"],
            "parsed_data": analysis["parsed"]
        })

    # Sort by score descending
    results = sorted(results, key=lambda x: x["score"], reverse=True)
    return Response({"results": results})
