from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User, Subreddit, Post, Comment,
    Notification, Subscription, Keyword, CrawlHistory
)


# Customize the User admin display
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'membership_status', 'is_staff', 'date_joined')
    list_filter = ('membership_status', 'is_staff', 'is_superuser', 'oauth_provider')
    fieldsets = UserAdmin.fieldsets + (
        ('Membership', {'fields': ('membership_status', 'oauth_provider')}),
    )


# Register the User model with custom admin
admin.site.register(User, CustomUserAdmin)


# Register other models
@admin.register(Subreddit)
class SubredditAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'subreddit_name', 'upvotes', 'comments_count', 'submission_date')
    list_filter = ('subreddit_name', 'manually_added')
    search_fields = ('title', 'body', 'author')
    date_hierarchy = 'submission_date'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'post', 'parent_comment', 'upvotes', 'submission_date')
    list_filter = ('submission_date',)
    search_fields = ('body', 'author')
    raw_id_fields = ('post', 'parent_comment')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'read_status', 'created_at')
    list_filter = ('type', 'read_status')
    search_fields = ('content',)


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'created_at', 'expires_at')
    list_filter = ('status',)
    search_fields = ('user__username', 'user__email')


@admin.register(Keyword)
class KeywordAdmin(admin.ModelAdmin):
    list_display = ('phrase', 'active', 'created_at')
    list_filter = ('active',)
    search_fields = ('phrase', 'description')


@admin.register(CrawlHistory)
class CrawlHistoryAdmin(admin.ModelAdmin):
    list_display = ('subreddit', 'start_time', 'end_time', 'posts_found', 'comments_found', 'status')
    list_filter = ('status',)
    search_fields = ('subreddit__name', 'error_message')
    date_hierarchy = 'start_time'
