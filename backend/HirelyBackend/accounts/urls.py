"""
URLs for user authentication and profile management
"""

from django.urls import path
from . import views

urlpatterns = [
    # Registration
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    
    # Login/Logout
    path('login/', views.user_login_view, name='user-login'),
    path('logout/', views.user_logout_view, name='user-logout'),
    
    # Profile
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    
    # Health check
    path('health/', views.health_check_view, name='health-check'),
]