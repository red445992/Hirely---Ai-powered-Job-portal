from django.urls import path
from . import views

urlpatterns = [
    path('addjobs/', views.JobListCreateView.as_view(), name='job-list-create'),
    path('<int:pk>/', views.JobDetailView.as_view(), name='job-detail'),
    path('<int:pk>/toggle-status/', views.ToggleJobStatusView.as_view(), name='job-toggle-status'),

    path('public/', views.PublicJobListView.as_view(), name='public-job-list'),
]