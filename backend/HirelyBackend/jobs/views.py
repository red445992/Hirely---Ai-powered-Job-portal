from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from .models import Job
from .serializers import JobSerializer, JobCreateSerializer



from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils.resume_parser import parse_resume

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
            queryset = Job.objects.filter(is_active=True)
            
            # Add filtering capabilities for public access
            category = self.request.query_params.get('category')
            location = self.request.query_params.get('location')
            job_type = self.request.query_params.get('job_type')
            level = self.request.query_params.get('level')
            is_remote = self.request.query_params.get('is_remote')
            
            if category:
                queryset = queryset.filter(category=category)
            if location:
                queryset = queryset.filter(location__icontains=location)
            if job_type:
                queryset = queryset.filter(job_type=job_type)
            if level:
                queryset = queryset.filter(level=level)
            if is_remote:
                queryset = queryset.filter(is_remote=True)
                
            return queryset.select_related('employer')
        
        # For POST requests (creating jobs), only show employer's own jobs
        return Job.objects.filter(employer=self.request.user)
    
    def perform_create(self, serializer):
        # Only employers can create jobs
        serializer.save(employer=self.request.user)
    
    def list(self, request, *args, **kwargs):
        """Override to add filtering metadata"""
        response = super().list(request, *args, **kwargs)
        
        # Add available filters metadata
        if request.method == 'GET':
            # Get unique categories, locations, etc. for filter options
            jobs = Job.objects.filter(is_active=True)
            response.data['filters'] = {
                'categories': list(jobs.values_list('category', flat=True).distinct()),
                'locations': list(jobs.values_list('location', flat=True).distinct().order_by('location')),
                'job_types': list(jobs.values_list('job_type', flat=True).distinct()),
                'levels': list(jobs.values_list('level', flat=True).distinct()),
            }
        
        return response

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
    
    def retrieve(self, request, *args, **kwargs):
        """Get job details and related jobs"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        # Add related jobs in the same category
        related_jobs = Job.objects.filter(
            is_active=True,
            category=instance.category
        ).exclude(id=instance.id)[:3]  # Get 3 related jobs
        
        related_serializer = JobSerializer(related_jobs, many=True)
        
        response_data = serializer.data
        response_data['related_jobs'] = related_serializer.data
        
        return Response(response_data)

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

class PublicJobListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = JobSerializer
    
    def get_queryset(self):
        queryset = Job.objects.filter(is_active=True)
        
        # Enhanced filtering for public endpoint
        category = self.request.query_params.get('category')
        location = self.request.query_params.get('location')
        search = self.request.query_params.get('search')
        job_type = self.request.query_params.get('type')
        level = self.request.query_params.get('level')
        is_remote = self.request.query_params.get('remote')
        
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(company__icontains=search) |
                Q(skills__icontains=search)
            )
        if category:
            queryset = queryset.filter(category=category)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        if level:
            queryset = queryset.filter(level=level)
        if is_remote:
            queryset = queryset.filter(is_remote=True)
            
        return queryset.select_related('employer')
    
    def list(self, request, *args, **kwargs):
        """Add filter options to response"""
        response = super().list(request, *args, **kwargs)
        
        # Add available filter options
        jobs = Job.objects.filter(is_active=True)
        response.data['filter_options'] = {
            'categories': [
                {'value': cat[0], 'label': cat[1], 'count': jobs.filter(category=cat[0]).count()}
                for cat in Job.JOB_CATEGORIES
            ],
            'locations': [
                {'value': loc, 'count': jobs.filter(location=loc).count()}
                for loc in jobs.values_list('location', flat=True).distinct().order_by('location')
            ],
            'job_types': [
                {'value': jt[0], 'label': jt[1], 'count': jobs.filter(job_type=jt[0]).count()}
                for jt in Job.JOB_TYPES
            ],
            'levels': [
                {'value': lvl[0], 'label': lvl[1], 'count': jobs.filter(level=lvl[0]).count()}
                for lvl in Job.JOB_LEVELS
            ],
        }
        
        return response

# NEW: Job Search View for more specific search functionality
class JobSearchView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = JobSerializer
    
    def get_queryset(self):
        queryset = Job.objects.filter(is_active=True)
        
        search_query = self.request.query_params.get('q')
        location_query = self.request.query_params.get('location')
        
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(company__icontains=search_query) |
                Q(skills__icontains=search_query) |
                Q(responsibilities__icontains=search_query)
            )
        
        if location_query:
            queryset = queryset.filter(location__icontains=location_query)
            
        return queryset.select_related('employer')
    
@api_view(["POST"])
def parse_resume_view(request):
    """
    Accepts a resume text or file and returns extracted entities.
    """
    resume_text = request.data.get("resume_text")
    if not resume_text:
        return Response({"error": "resume_text field is required"}, status=400)
    
    try:
        result = parse_resume(resume_text)
        return Response(result)  # Return the full result which includes entities, method, and status
    except Exception as e:
        return Response({"error": str(e), "status": "failed"}, status=500)