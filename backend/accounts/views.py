from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import LoginVerification
from .serializers import AdminTokenObtainPairSerializer, RegisterSerializer, RequestLoginCodeSerializer, ResendLoginCodeSerializer, UserSerializer, VerifyLoginCodeSerializer
from .verification import challenge_payload, issue_login_challenge, verify_login_challenge
from rest_framework_simplejwt.views import TokenObtainPairView


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        challenge = issue_login_challenge(user)
        return Response(challenge_payload(challenge), status=status.HTTP_201_CREATED)


class MeView(APIView):
    def get(self, request):
        return Response({"success": True, "data": UserSerializer(request.user).data})


class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer


class VerifyLoginCodeView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        serializer = VerifyLoginCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        _user, tokens = verify_login_challenge(**serializer.validated_data)
        return Response(tokens)


class RequestLoginCodeView(APIView):
    """Passwordless sign-in for previously verified, non-superuser accounts."""

    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        serializer = RequestLoginCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        from .models import User

        user = User.objects.filter(email__iexact=serializer.validated_data["email"], is_active=True).first()
        if not user or user.is_superuser or user.role == User.Role.SUPER_ADMIN or not user.is_email_verified:
            raise ValidationError({"email": "OTP sign-in is unavailable for this account. Use first-time or Super Admin sign-in."})
        portal = serializer.validated_data["portal"]
        if (portal == "candidate") != (user.role == User.Role.CANDIDATE):
            raise ValidationError({"email": "This account cannot access the selected portal."})
        return Response(challenge_payload(issue_login_challenge(user, enforce_cooldown=True)))


class ResendLoginCodeView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        serializer = ResendLoginCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            prior = LoginVerification.objects.select_related("user").get(id=serializer.validated_data["challenge_id"])
        except LoginVerification.DoesNotExist:
            raise ValidationError({"challenge_id": "Invalid verification request."})
        challenge = issue_login_challenge(prior.user, enforce_cooldown=True)
        return Response(challenge_payload(challenge))
