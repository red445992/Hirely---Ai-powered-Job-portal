"""
URLs for user authentication and profile management
"""

from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Registration
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    
    # Login/Logout
    path('login/', views.user_login_view, name='user-login'),
    path('logout/', views.user_logout_view, name='user-logout'),
    
    # Profile
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    # JWT token refresh (SimpleJWT)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Health check
    path('health/', views.health_check_view, name='health-check'),
]