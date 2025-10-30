from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from .models import Job
from .serializers import JobSerializer, JobCreateSerializer

class IsEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        # For safe methods (GET, HEAD, OPTIONS), allow anyone
        if request.method in permissions.SAFE_METHODS:
            return True
        # For write methods, require employer authentication
        return request.user.is_authenticated and request.user.user_type == 'employer'

    def has_object_permission(self, request, view, obj):
        # Allow anyone to view job details
        if request.method in permissions.SAFE_METHODS:
            return True
        # Only allow employer who owns the job to modify it
        return obj.employer == request.user

class JobListCreateView(generics.ListCreateAPIView):
    # Allow anyone to list jobs, but require employer auth to create
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsEmployer]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobCreateSerializer
        return JobSerializer
    
    def get_queryset(self):
        # For GET requests (listing jobs), show all active jobs to everyone
        if self.request.method == 'GET':
            return Job.objects.filter(is_active=True)
        # For POST requests (creating jobs), only show employer's own jobs
        return Job.objects.filter(employer=self.request.user)
    
    def perform_create(self, serializer):
        # Only employers can create jobs
        serializer.save(employer=self.request.user)

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    # Allow anyone to view job details, but require employer auth to modify
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsEmployer]
    serializer_class = JobSerializer
    
    def get_queryset(self):
        # For GET requests, show job to everyone if active
        if self.request.method == 'GET':
            return Job.objects.filter(is_active=True)
        # For write requests, only allow access to employer's own jobs
        return Job.objects.filter(employer=self.request.user)

class ToggleJobStatusView(generics.UpdateAPIView):
    # Only employers can toggle job status
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    serializer_class = JobSerializer
    
    def get_queryset(self):
        return Job.objects.filter(employer=self.request.user)
    
    def update(self, request, *args, **kwargs):
        job = self.get_object()
        job.is_active = not job.is_active
        job.save()
        
        serializer = self.get_serializer(job)
        return Response(serializer.data)

# NEW: Public job listing view (optional - for more flexibility)
class PublicJobListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]  # Completely public
    serializer_class = JobSerializer
    
    def get_queryset(self):
        # Return only active jobs for public viewing
        return Job.objects.filter(is_active=True)
    
    def get(self, request, *args, **kwargs):
        # You can add additional public-specific logic here
        return self.list(request, *args, **kwargs)