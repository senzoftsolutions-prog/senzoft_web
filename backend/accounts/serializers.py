from rest_framework import serializers
from django.db import transaction
import phonenumbers
from careers.models import CandidateProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from .verification import challenge_payload, issue_login_challenge


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "role", "is_email_verified")
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=10)
    phone = serializers.RegexField(r"^\d+$", write_only=True, max_length=15)
    phone_country = serializers.RegexField(r"^[A-Z]{2}$", write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "first_name", "last_name", "phone", "phone_country")

    def validate(self, attrs):
        try:
            parsed = phonenumbers.parse(attrs["phone"], attrs["phone_country"])
        except phonenumbers.NumberParseException:
            raise serializers.ValidationError({"phone": "Enter a valid mobile number for the selected country."})
        mobile_types = {phonenumbers.PhoneNumberType.MOBILE, phonenumbers.PhoneNumberType.FIXED_LINE_OR_MOBILE}
        if not phonenumbers.is_valid_number_for_region(parsed, attrs["phone_country"]) or phonenumbers.number_type(parsed) not in mobile_types:
            raise serializers.ValidationError({"phone": "Enter a valid mobile number for the selected country."})
        attrs["phone"] = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
        return attrs

    def create(self, validated_data):
        with transaction.atomic():
            phone = validated_data.pop("phone", "")
            validated_data.pop("phone_country", None)
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
    role = serializers.ChoiceField(choices=[choice for choice in User.Role.choices if choice[0] not in {User.Role.ADMIN, User.Role.SUPER_ADMIN}])


class UserStatusSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()


class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        identifier = attrs.get(self.username_field, "")
        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).only("username").first()
            if user:
                attrs[self.username_field] = user.username
        token_data = super().validate(attrs)
        if self.user.is_superuser:
            return token_data
        return challenge_payload(issue_login_challenge(self.user))


class VerifyLoginCodeSerializer(serializers.Serializer):
    challenge_id = serializers.UUIDField()
    code = serializers.RegexField(r"^\d{6}$")


class ResendLoginCodeSerializer(serializers.Serializer):
    challenge_id = serializers.UUIDField()


class RequestLoginCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    portal = serializers.ChoiceField(choices=("candidate", "admin"))
