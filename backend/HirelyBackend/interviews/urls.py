from django.urls import path
from . import views

app_name = 'interviews'

urlpatterns = [
    path('', views.health_check, name='health_check'),
    path('generate/', views.generate_interview, name='generate_interview'),
    path('list/', views.InterviewListCreateView.as_view(), name='interview_list'),
    path('<uuid:id>/', views.InterviewDetailView.as_view(), name='interview_detail'),
]