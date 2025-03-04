from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        # Assuming the object has an 'user' attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user
        # For other objects like Post that might have 'author' instead of 'user'
        elif hasattr(obj, 'author'):
            return obj.author == request.user.username

        return False


class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to edit objects.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to admin users.
        return request.user and request.user.is_staff


class IsPremiumUser(permissions.BasePermission):
    """
    Custom permission to only allow premium users to access certain views.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.membership_status == 'Premium'