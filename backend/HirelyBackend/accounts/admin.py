from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'user_type', 'is_staff', 'created_at')
    list_filter = ('user_type', 'is_staff', 'is_superuser')
    fieldsets = UserAdmin.fieldsets + (
        ('Job Portal Info', {
            'fields': ('user_type', 'phone_number', 'profile_picture', 'company', 'bio')
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Job Portal Info', {
            'fields': ('user_type', 'phone_number', 'company')
        }),
    )