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
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Membership', {'fields': ('membership_status', 'oauth_provider')}),
    )
    search_fields = ('username', 'email', 'first_name', 'last_name')


# Register the User model with custom admin
admin.site.register(User, CustomUserAdmin)


# Register other models
@admin.register(Subreddit)
class SubredditAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'subreddit_name', 'upvotes', 'comments_count', 'submission_date', 'manually_added')
    list_filter = ('subreddit_name', 'manually_added', 'submission_date')
    search_fields = ('title', 'body', 'author', 'reddit_id')
    date_hierarchy = 'submission_date'
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 25


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('get_short_body', 'author', 'post', 'parent_comment', 'upvotes', 'submission_date')
    list_filter = ('submission_date',)
    search_fields = ('body', 'author', 'reddit_id')
    raw_id_fields = ('post', 'parent_comment')
    readonly_fields = ('created_at', 'updated_at')

    def get_short_body(self, obj):
        return obj.body[:50] + '...' if len(obj.body) > 50 else obj.body
    get_short_body.short_description = 'Comment'


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'read_status', 'created_at')
    list_filter = ('type', 'read_status', 'created_at')
    search_fields = ('content', 'user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['mark_as_read', 'mark_as_unread']

    def mark_as_read(self, request, queryset):
        queryset.update(read_status=True)
    mark_as_read.short_description = "Mark selected notifications as read"

    def mark_as_unread(self, request, queryset):
        queryset.update(read_status=False)
    mark_as_unread.short_description = "Mark selected notifications as unread"


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'created_at', 'expires_at')
    list_filter = ('status', 'created_at', 'expires_at')
    search_fields = ('user__username', 'user__email', 'stripe_subscription_id')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Keyword)
class KeywordAdmin(admin.ModelAdmin):
    list_display = ('phrase', 'active', 'created_at')
    list_filter = ('active', 'created_at')
    search_fields = ('phrase', 'description')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['activate_keywords', 'deactivate_keywords']

    def activate_keywords(self, request, queryset):
        queryset.update(active=True)
    activate_keywords.short_description = "Activate selected keywords"

    def deactivate_keywords(self, request, queryset):
        queryset.update(active=False)
    deactivate_keywords.short_description = "Deactivate selected keywords"


@admin.register(CrawlHistory)
class CrawlHistoryAdmin(admin.ModelAdmin):
    list_display = ('subreddit', 'start_time', 'end_time', 'posts_found', 'comments_found', 'status')
    list_filter = ('status', 'start_time', 'subreddit')
    search_fields = ('subreddit__name', 'error_message')
    date_hierarchy = 'start_time'
    readonly_fields = ('created_at',)