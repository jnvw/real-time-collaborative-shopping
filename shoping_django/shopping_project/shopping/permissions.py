# shopping/permissions.py
from rest_framework import permissions

class IsCartOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.family.members.filter(id=request.user.id).exists()
