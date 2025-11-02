# applications/urls.py
from django.urls import path
from . import views

app_name = 'applications'

urlpatterns = [
    # Application CRUD
    path('apply/', views.ApplicationCreateView.as_view(), name='apply'),
    path('', views.ApplicationListView.as_view(), name='list'),
    path('<int:pk>/', views.ApplicationDetailView.as_view(), name='detail'),
    path('<int:pk>/delete/', views.delete_application, name='delete'),
    
    # Job-specific applications
    path('job/<int:job_id>/', views.JobApplicationsView.as_view(), name='job-applications'),
    
    # User's applications
    path('my-applications/', views.ApplicationsByUserView.as_view(), name='my-applications'),
    
    # Statistics and bulk operations
    path('stats/', views.application_stats, name='stats'),
    path('bulk-update/', views.bulk_update_applications, name='bulk-update'),
]