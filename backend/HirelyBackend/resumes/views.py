# resumes/views.py
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, Http404
from django.db.models import Sum, Q
from django.utils import timezone
import secrets
import mimetypes

from .models import Resume, ResumeShare, ResumeTemplate
from .serializers import (
    ResumeListSerializer, ResumeDetailSerializer, ResumeCreateSerializer,
    ResumeUpdateSerializer, ResumeShareSerializer, ResumeTemplateSerializer,
    ResumeStatsSerializer
)


class ResumeListCreateView(generics.ListCreateAPIView):
    """List user's resumes or create a new one"""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ResumeCreateSerializer
        return ResumeListSerializer
    
    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ResumeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a specific resume"""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ResumeUpdateSerializer
        return ResumeDetailSerializer
    
    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def download_resume(request, pk):
    """Download resume file"""
    try:
        resume = Resume.objects.get(pk=pk, user=request.user)
    except Resume.DoesNotExist:
        raise Http404("Resume not found")
    
    if not resume.file:
        return Response(
            {'error': 'No file attached to this resume'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Update download analytics
    resume.download_count += 1
    resume.last_downloaded = timezone.now()
    resume.save(update_fields=['download_count', 'last_downloaded'])
    
    # Serve file
    try:
        response = HttpResponse(
            resume.file.read(),
            content_type=mimetypes.guess_type(resume.file.name)[0] or 'application/octet-stream'
        )
        response['Content-Disposition'] = f'attachment; filename="{resume.original_filename}"'
        return response
    except Exception as e:
        return Response(
            {'error': 'Error downloading file'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def set_default_resume(request, pk):
    """Set a resume as default"""
    try:
        resume = Resume.objects.get(pk=pk, user=request.user)
    except Resume.DoesNotExist:
        return Response(
            {'error': 'Resume not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Remove default from other resumes
    Resume.objects.filter(user=request.user, is_default=True).update(is_default=False)
    
    # Set this as default
    resume.is_default = True
    resume.save(update_fields=['is_default'])
    
    return Response({'message': 'Default resume updated successfully'})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def duplicate_resume(request, pk):
    """Create a copy of an existing resume"""
    try:
        original = Resume.objects.get(pk=pk, user=request.user)
    except Resume.DoesNotExist:
        return Response(
            {'error': 'Resume not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Create duplicate
    duplicate = Resume.objects.create(
        user=request.user,
        title=f"{original.title} (Copy)",
        file=original.file,
        personal_info=original.personal_info,
        experience=original.experience,
        education=original.education,
        skills=original.skills,
        projects=original.projects,
        certifications=original.certifications,
        template=original.template,
        status='draft',  # Always create as draft
        is_default=False,
        is_public=False
    )
    
    serializer = ResumeDetailSerializer(duplicate, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)


class ResumeShareListCreateView(generics.ListCreateAPIView):
    """List resume shares or create a new share"""
    serializer_class = ResumeShareSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ResumeShare.objects.filter(resume__user=self.request.user)
    
    def perform_create(self, serializer):
        # Generate unique access token
        access_token = secrets.token_urlsafe(32)
        serializer.save(access_token=access_token)


class ResumeTemplateListView(generics.ListAPIView):
    """List available resume templates"""
    serializer_class = ResumeTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ResumeTemplate.objects.filter(is_active=True)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def resume_stats(request):
    """Get resume statistics for the user"""
    user = request.user
    resumes = Resume.objects.filter(user=user)
    
    stats = {
        'total_resumes': resumes.count(),
        'active_resumes': resumes.filter(status='active').count(),
        'draft_resumes': resumes.filter(status='draft').count(),
        'total_downloads': resumes.aggregate(total=Sum('download_count'))['total'] or 0,
        'total_views': resumes.aggregate(total=Sum('view_count'))['total'] or 0,
        'default_resume_id': resumes.filter(is_default=True).first().id if resumes.filter(is_default=True).exists() else None
    }
    
    serializer = ResumeStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def public_resume_view(request, access_token):
    """Public view for shared resumes"""
    try:
        share = ResumeShare.objects.get(
            access_token=access_token,
            is_active=True
        )
        
        # Check if expired
        if share.expires_at and share.expires_at < timezone.now():
            return Response(
                {'error': 'This resume link has expired'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Update view analytics
        share.view_count += 1
        share.last_viewed = timezone.now()
        share.save(update_fields=['view_count', 'last_viewed'])
        
        # Update resume view count
        resume = share.resume
        resume.view_count += 1
        resume.last_viewed = timezone.now()
        resume.save(update_fields=['view_count', 'last_viewed'])
        
        # Return resume data
        serializer = ResumeDetailSerializer(resume, context={'request': request})
        return Response(serializer.data)
        
    except ResumeShare.DoesNotExist:
        return Response(
            {'error': 'Invalid or expired resume link'}, 
            status=status.HTTP_404_NOT_FOUND
        )