from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    """
    Extended user model that replaces Django's default User
    """
    oauth_provider = models.CharField(max_length=50, blank=True, null=True)
    membership_status = models.CharField(max_length=50, default='Free')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user'


class Subreddit(models.Model):
    """
    Represents a subreddit to be crawled
    """
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'subreddit'


class Post(models.Model):
    """
    Represents a Reddit post/submission
    """
    reddit_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    body = models.TextField(blank=True, null=True)
    upvotes = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    author = models.CharField(max_length=255, blank=True, null=True)
    submission_date = models.DateTimeField(blank=True, null=True)
    subreddit = models.ForeignKey(Subreddit, on_delete=models.CASCADE, related_name='posts')
    subreddit_name = models.CharField(max_length=255)
    post_url = models.CharField(max_length=255, blank=True, null=True)
    manually_added = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'post'


class Comment(models.Model):
    """
    Represents a Reddit comment, which can be a reply to a post or another comment
    """
    reddit_id = models.CharField(max_length=50, unique=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE,
                                       related_name='replies', blank=True, null=True)
    body = models.TextField()
    author = models.CharField(max_length=255, blank=True, null=True)
    upvotes = models.IntegerField(default=0)
    submission_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.author}: {self.body[:50]}..."

    class Meta:
        db_table = 'comment'


class Notification(models.Model):
    """
    User notifications
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=50)
    content = models.TextField()
    read_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.type} notification for {self.user.username}"

    class Meta:
        db_table = 'notification'


class Subscription(models.Model):
    """
    Premium user subscriptions
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s subscription ({self.status})"

    class Meta:
        db_table = 'subscription'


class Keyword(models.Model):
    """
    Keywords to search for in Reddit posts/comments
    """
    phrase = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.phrase

    class Meta:
        db_table = 'keyword'


class CrawlHistory(models.Model):
    """
    History of Reddit crawling operations
    """
    subreddit = models.ForeignKey(Subreddit, on_delete=models.CASCADE, related_name='crawl_history', null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(blank=True, null=True)
    posts_found = models.IntegerField(default=0)
    comments_found = models.IntegerField(default=0)
    status = models.CharField(max_length=50)
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Crawl of {self.subreddit.name} at {self.start_time}"

    class Meta:
        db_table = 'crawl_history'
        verbose_name_plural = 'Crawl histories'