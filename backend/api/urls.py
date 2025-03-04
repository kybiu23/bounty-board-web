from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'subreddits', views.SubredditViewSet)
router.register(r'posts', views.PostViewSet)
router.register(r'comments', views.CommentViewSet)
router.register(r'notifications', views.NotificationViewSet, basename='notification')
router.register(r'subscriptions', views.SubscriptionViewSet, basename='subscription')
router.register(r'keywords', views.KeywordViewSet)
router.register(r'crawl-history', views.CrawlHistoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('me/', views.current_user, name='current_user'),
    path('posts/manual/', views.manual_posts, name='manual_posts'),
    path('notifications/mark-all-read/', views.mark_all_notifications_read, name='mark_all_notifications_read'),
]