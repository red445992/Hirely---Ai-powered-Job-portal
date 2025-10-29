from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from .models import Job
from .serializers import JobSerializer, JobCreateSerializer

class IsEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'employer'

    def has_object_permission(self, request, view, obj):
        return obj.employer == request.user

class JobListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobCreateSerializer
        return JobSerializer
    
    def get_queryset(self):
        # Employers can only see their own jobs
        return Job.objects.filter(employer=self.request.user)
    
    def perform_create(self, serializer):
        # Set the employer to the current user and use their company if not provided
        employer_company = self.request.user.company
        if employer_company and not serializer.validated_data.get('company'):
            serializer.save(employer=self.request.user, company=employer_company)
        else:
            serializer.save(employer=self.request.user)

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    serializer_class = JobSerializer
    
    def get_queryset(self):
        # Employers can only access their own jobs
        return Job.objects.filter(employer=self.request.user)

class ToggleJobStatusView(generics.UpdateAPIView):
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