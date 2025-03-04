from rest_framework import serializers
from .models import User, Subreddit, Post, Comment, Notification, Subscription, Keyword, CrawlHistory


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  'oauth_provider', 'membership_status', 'date_joined',
                  'is_active', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at', 'date_joined')


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class SubredditSerializer(serializers.ModelSerializer):
    """Serializer for the Subreddit model"""
    class Meta:
        model = Subreddit
        fields = ('id', 'name', 'description', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for the Comment model"""
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'reddit_id', 'post', 'parent_comment', 'body', 'author',
                  'upvotes', 'submission_date', 'created_at', 'updated_at', 'replies')
        read_only_fields = ('created_at', 'updated_at')

    def get_replies(self, obj):
        # Only get direct replies, not nested ones
        replies = Comment.objects.filter(parent_comment=obj.id)
        return CommentBasicSerializer(replies, many=True).data


class CommentBasicSerializer(serializers.ModelSerializer):
    """Basic serializer for Comment model without replies to avoid recursion"""
    class Meta:
        model = Comment
        fields = ('id', 'reddit_id', 'post', 'parent_comment', 'body', 'author',
                  'upvotes', 'submission_date', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')


class PostSerializer(serializers.ModelSerializer):
    """Serializer for the Post model"""
    comments = serializers.SerializerMethodField()
    subreddit_name = serializers.CharField(read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'reddit_id', 'title', 'body', 'upvotes', 'comments_count',
                  'author', 'submission_date', 'subreddit', 'subreddit_name',
                  'post_url', 'manually_added', 'created_at', 'updated_at', 'comments')
        read_only_fields = ('created_at', 'updated_at', 'subreddit_name')

    def get_comments(self, obj):
        # Only get top-level comments (no parent)
        comments = Comment.objects.filter(post=obj.id, parent_comment=None)
        return CommentSerializer(comments, many=True).data


class PostListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Post model for list views"""
    subreddit_name = serializers.CharField(read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'reddit_id', 'title', 'upvotes', 'comments_count',
                  'author', 'submission_date', 'subreddit', 'subreddit_name',
                  'manually_added', 'created_at')
        read_only_fields = ('created_at', 'subreddit_name')


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for the Notification model"""
    class Meta:
        model = Notification
        fields = ('id', 'user', 'type', 'content', 'read_status', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for the Subscription model"""
    class Meta:
        model = Subscription
        fields = ('id', 'user', 'stripe_subscription_id', 'status', 'created_at', 'expires_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')


class KeywordSerializer(serializers.ModelSerializer):
    """Serializer for the Keyword model"""
    class Meta:
        model = Keyword
        fields = ('id', 'phrase', 'description', 'active', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')


class CrawlHistorySerializer(serializers.ModelSerializer):
    """Serializer for the CrawlHistory model"""
    subreddit_name = serializers.SerializerMethodField()

    class Meta:
        model = CrawlHistory
        fields = ('id', 'subreddit', 'subreddit_name', 'start_time', 'end_time',
                  'posts_found', 'comments_found', 'status', 'error_message', 'created_at')
        read_only_fields = ('created_at',)

    def get_subreddit_name(self, obj):
        if obj.subreddit:
            return obj.subreddit.name
        return None