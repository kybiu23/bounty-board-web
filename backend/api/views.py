from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authtoken.models import Token
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, Subreddit, Post, Comment, Notification, Subscription, Keyword, CrawlHistory
from .serializers import (
    UserSerializer, UserCreateSerializer, SubredditSerializer,
    PostSerializer, PostListSerializer, CommentSerializer,
    NotificationSerializer, SubscriptionSerializer,
    KeywordSerializer, CrawlHistorySerializer
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['POST'])
def login_view(request):
    """Custom login view to authenticate users and return token"""
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user:
        token, created = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(user)
        return Response({
            'token': token.key,
            'user': serializer.data
        })

    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def register_view(request):
    """Register a new user"""
    serializer = UserCreateSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    """API endpoint for users"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'list':
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get the current user's profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class SubredditViewSet(viewsets.ModelViewSet):
    """API endpoint for subreddits"""
    queryset = Subreddit.objects.all()
    serializer_class = SubredditSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]


class PostViewSet(viewsets.ModelViewSet):
    """API endpoint for posts"""
    queryset = Post.objects.all().order_by('-submission_date')
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['subreddit', 'author', 'manually_added']
    search_fields = ['title', 'body']
    ordering_fields = ['submission_date', 'upvotes', 'comments_count']

    def get_serializer_class(self):
        if self.action == 'list':
            return PostListSerializer
        return PostSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'])
    def manual(self, request):
        """Get only manually added posts"""
        posts = self.queryset.filter(manually_added=True)
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    """API endpoint for comments"""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['post', 'author']
    search_fields = ['body']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]


class NotificationViewSet(viewsets.ModelViewSet):
    """API endpoint for notifications"""
    serializer_class = NotificationSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all notifications
        for the currently authenticated user.
        """
        user = self.request.user
        return Notification.objects.filter(user=user).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        user = request.user
        Notification.objects.filter(user=user, read_status=False).update(read_status=True)
        return Response({'status': 'All notifications marked as read'})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a specific notification as read"""
        notification = self.get_object()
        notification.read_status = True
        notification.save()
        return Response({'status': 'Notification marked as read'})


class SubscriptionViewSet(viewsets.ModelViewSet):
    """API endpoint for subscriptions"""
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all subscriptions
        for the currently authenticated user.
        """
        user = self.request.user
        if user.is_staff:
            return Subscription.objects.all()
        return Subscription.objects.filter(user=user)


class KeywordViewSet(viewsets.ModelViewSet):
    """API endpoint for keywords"""
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['phrase', 'description']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get only active keywords"""
        keywords = self.queryset.filter(active=True)
        serializer = self.get_serializer(keywords, many=True)
        return Response(serializer.data)


class CrawlHistoryViewSet(viewsets.ModelViewSet):
    """API endpoint for crawl history"""
    queryset = CrawlHistory.objects.all().order_by('-start_time')
    serializer_class = CrawlHistorySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['subreddit', 'status']
    permission_classes = [IsAdminUser]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):
    """Mark all notifications as read for current user"""
    Notification.objects.filter(user=request.user, read_status=False).update(read_status=True)
    return Response({'status': 'All notifications marked as read'})