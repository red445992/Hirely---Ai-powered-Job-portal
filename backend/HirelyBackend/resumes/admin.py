# resumes/admin.py
from django.contrib import admin
from .models import Resume, ResumeShare, ResumeTemplate


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'file_type', 'status', 'is_default', 'is_public', 'created_at']
    list_filter = ['status', 'file_type', 'template', 'is_default', 'is_public', 'created_at']
    search_fields = ['title', 'user__username', 'user__email']
    readonly_fields = ['file_size', 'original_filename', 'download_count', 'view_count', 
                      'last_downloaded', 'last_viewed', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'title', 'status', 'template')
        }),
        ('File Information', {
            'fields': ('file', 'file_type', 'file_size', 'original_filename')
        }),
        ('Content', {
            'fields': ('personal_info', 'experience', 'education', 'skills', 'projects', 'certifications'),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('is_default', 'is_public')
        }),
        ('Analytics', {
            'fields': ('download_count', 'view_count', 'last_downloaded', 'last_viewed'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(ResumeShare)
class ResumeShareAdmin(admin.ModelAdmin):
    list_display = ['resume', 'shared_with_email', 'shared_at', 'expires_at', 'is_active', 'view_count']
    list_filter = ['is_active', 'shared_at', 'expires_at']
    search_fields = ['resume__title', 'shared_with_email']
    readonly_fields = ['access_token', 'view_count', 'last_viewed']


@admin.register(ResumeTemplate)
class ResumeTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'is_active', 'is_premium', 'created_at']
    list_filter = ['category', 'is_active', 'is_premium']
    search_fields = ['name', 'description']