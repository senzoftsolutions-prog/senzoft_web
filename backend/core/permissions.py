from rest_framework.permissions import BasePermission


def has_role(user, *roles):
    return bool(user and user.is_authenticated and (user.is_superuser or user.role in roles))


class IsRecruitmentStaff(BasePermission):
    allowed = {"RECRUITER", "HIRING_MANAGER", "HR", "ADMIN", "SUPER_ADMIN"}

    def has_permission(self, request, view):
        return has_role(request.user, *self.allowed)


class IsAdminPanelUser(BasePermission):
    allowed = {"RECRUITER", "HIRING_MANAGER", "INTERVIEWER", "HR", "ADMIN", "SUPER_ADMIN"}

    def has_permission(self, request, view):
        return has_role(request.user, *self.allowed)


class HasModuleRole(BasePermission):
    """Viewsets declare `allowed_roles`; Django remains the authorization boundary."""

    def has_permission(self, request, view):
        return has_role(request.user, *getattr(view, "allowed_roles", ()))


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return has_role(request.user, "ADMIN", "SUPER_ADMIN")


class IsCandidate(BasePermission):
    def has_permission(self, request, view):
        return has_role(request.user, "CANDIDATE")
