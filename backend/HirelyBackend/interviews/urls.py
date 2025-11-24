from django.urls import path
from . import views
from . import quiz_views

app_name = 'interviews'

urlpatterns = [
    # Interview endpoints (existing)
    path('', views.health_check, name='health_check'),
    path('generate/', views.generate_interview, name='generate_interview'),
    path('list/', views.InterviewListCreateView.as_view(), name='interview_list'),
    path('<uuid:id>/', views.InterviewDetailView.as_view(), name='interview_detail'),
    
    # Quiz endpoints (new)
    path('quiz/generate/', quiz_views.generate_quiz, name='generate_quiz'),
    path('quiz/submit/', quiz_views.submit_answers, name='submit_answers'),
    path('quiz/assessments/', quiz_views.get_assessments, name='get_assessments'),
    path('quiz/categories/', quiz_views.get_categories, name='get_categories'),
    path('quiz/rate-limit-status/', quiz_views.get_rate_limit_status, name='rate_limit_status'),
]