from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.conf import settings
from rest_framework.authtoken.models import Token
from .models import Post, Notification, User, Subscription
import datetime

# Create authentication token for each new user
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

# Update subreddit_name when a post is saved/updated
@receiver(pre_save, sender=Post)
def set_subreddit_name(sender, instance, **kwargs):
    if instance.subreddit and not instance.subreddit_name:
        instance.subreddit_name = instance.subreddit.name

# Create notifications for new posts
@receiver(post_save, sender=Post)
def create_post_notification(sender, instance, created, **kwargs):
    if created:
        # Notify premium users about new posts
        premium_users = User.objects.filter(membership_status='Premium')
        for user in premium_users:
            Notification.objects.create(
                user=user,
                type='New Post',
                content=f'A new post has been added: "{instance.title}"',
                read_status=False
            )

# Update user membership status when subscription changes
@receiver(post_save, sender=Subscription)
def update_membership_status(sender, instance, **kwargs):
    user = instance.user

    # Check if the subscription is active
    if instance.status == 'active' and instance.expires_at and instance.expires_at > datetime.datetime.now(instance.expires_at.tzinfo):
        user.membership_status = 'Premium'
    else:
        # Check if the user has any other active subscriptions
        active_subs = Subscription.objects.filter(
            user=user,
            status='active',
            expires_at__gt=datetime.datetime.now()
        ).exclude(id=instance.id)

        if not active_subs.exists():
            user.membership_status = 'Free'

    user.save()