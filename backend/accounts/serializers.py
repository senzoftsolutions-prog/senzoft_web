from rest_framework import serializers
from django.db import transaction
from careers.models import CandidateProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "role", "is_email_verified")
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=10)
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True, max_length=32)

    class Meta:
        model = User
        fields = ("username", "email", "password", "first_name", "last_name", "phone")

    def create(self, validated_data):
        with transaction.atomic():
            phone = validated_data.pop("phone", "")
            user = User.objects.create_user(**validated_data)
            CandidateProfile.objects.create(
                user=user,
                name=user.get_full_name().strip() or user.username,
                email=user.email,
                phone=phone,
            )
        return user


class AdminUserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="get_full_name", read_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "name", "email", "role", "is_active", "is_email_verified", "date_joined", "last_login")
        read_only_fields = fields


class UserRoleSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=User.Role.choices)


class UserStatusSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()


class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        identifier = attrs.get(self.username_field, "")
        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).only("username").first()
            if user:
                attrs[self.username_field] = user.username
        return super().validate(attrs)
