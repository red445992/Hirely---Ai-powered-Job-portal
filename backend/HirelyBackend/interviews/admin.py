from django.contrib import admin
from .models import Interview

@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ['role', 'type', 'level', 'user', 'question_count', 'finalized', 'created_at']
    list_filter = ['type', 'level', 'finalized', 'created_at']
    search_fields = ['role', 'user__username', 'user__email']
    readonly_fields = ['id', 'created_at', 'updated_at', 'question_count']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'role', 'type', 'level')
        }),
        ('Technical Details', {
            'fields': ('techstack', 'questions')
        }),
        ('Settings', {
            'fields': ('cover_image', 'finalized')
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
