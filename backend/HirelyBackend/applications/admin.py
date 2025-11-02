# applications/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Application, ApplicationStatusHistory


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = [
        'full_name',
        'email', 
        'job_title',
        'status',
        'applied_at',
        'is_recent',
        'viewed_by_employer'
    ]
    list_filter = [
        'status',
        'availability',
        'applied_at',
        'viewed_by_employer',
        'job__company'
    ]
    search_fields = [
        'full_name',
        'email',
        'job__title',
        'job__company'
    ]
    readonly_fields = [
        'applied_at',
        'updated_at',
        'is_recent'
    ]
    ordering = ['-applied_at']
    
    fieldsets = (
        ('Job Information', {
            'fields': ('job', 'status', 'viewed_by_employer')
        }),
        ('Personal Information', {
            'fields': ('full_name', 'email', 'phone', 'applicant')
        }),
        ('Documents', {
            'fields': ('resume', 'cover_letter')
        }),
        ('Professional Links', {
            'fields': ('portfolio_url', 'linkedin_url')
        }),
        ('Job Preferences', {
            'fields': ('expected_salary', 'availability')
        }),
        ('Additional Information', {
            'fields': ('additional_info', 'employer_notes')
        }),
        ('Timestamps', {
            'fields': ('applied_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def job_title(self, obj):
        return obj.job.title
    job_title.short_description = 'Job Title'
    job_title.admin_order_field = 'job__title'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('job', 'applicant')


@admin.register(ApplicationStatusHistory)
class ApplicationStatusHistoryAdmin(admin.ModelAdmin):
    list_display = [
        'application_name',
        'old_status',
        'new_status',
        'changed_by',
        'changed_at'
    ]
    list_filter = [
        'old_status',
        'new_status',
        'changed_at'
    ]
    search_fields = [
        'application__full_name',
        'application__email',
        'application__job__title'
    ]
    readonly_fields = [
        'application',
        'old_status',
        'new_status',
        'changed_by',
        'changed_at'
    ]
    ordering = ['-changed_at']
    
    def application_name(self, obj):
        return f"{obj.application.full_name} - {obj.application.job.title}"
    application_name.short_description = 'Application'
    application_name.admin_order_field = 'application__full_name'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'application__job', 
            'changed_by'
        )
