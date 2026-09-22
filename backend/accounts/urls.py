from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import AdminTokenObtainPairView, MeView, RegisterView, RequestLoginCodeView, ResendLoginCodeView, VerifyLoginCodeView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", AdminTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("verify-code/", VerifyLoginCodeView.as_view(), name="verify-login-code"),
    path("request-code/", RequestLoginCodeView.as_view(), name="request-login-code"),
    path("resend-code/", ResendLoginCodeView.as_view(), name="resend-login-code"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", MeView.as_view(), name="account-me"),
]
