# resumes/urls.py
from django.urls import path
from . import views

app_name = 'resumes'

urlpatterns = [
    # Resume CRUD
    path('', views.ResumeListCreateView.as_view(), name='list-create'),
    path('<int:pk>/', views.ResumeDetailView.as_view(), name='detail'),
    path('<int:pk>/download/', views.download_resume, name='download'),
    path('<int:pk>/set-default/', views.set_default_resume, name='set-default'),
    path('<int:pk>/duplicate/', views.duplicate_resume, name='duplicate'),
    
    # Resume sharing
    path('shares/', views.ResumeShareListCreateView.as_view(), name='shares'),
    path('public/<str:access_token>/', views.public_resume_view, name='public-view'),
    
    # Templates and stats
    path('templates/', views.ResumeTemplateListView.as_view(), name='templates'),
    path('stats/', views.resume_stats, name='stats'),
]