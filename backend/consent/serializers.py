from rest_framework import serializers

from .models import ConsentPolicy, ConsentRecord, CookieCategory, CookieDefinition


class CookieDefinitionSerializer(serializers.ModelSerializer):
    category_key = serializers.CharField(source="category.key", read_only=True)

    class Meta:
        model = CookieDefinition
        fields = "__all__"


class CookieCategorySerializer(serializers.ModelSerializer):
    definitions = serializers.SerializerMethodField()

    class Meta:
        model = CookieCategory
        fields = ("id", "key", "name", "description", "required", "display_order", "definitions")

    def get_definitions(self, category):
        return CookieDefinitionSerializer(category.definitions.filter(status="ACTIVE"), many=True).data


class ConsentPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsentPolicy
        fields = "__all__"
        read_only_fields = ("published_by", "effective_at", "created_at", "updated_at")


class ConsentRecordSerializer(serializers.ModelSerializer):
    version = serializers.CharField(source="policy.version", read_only=True)

    class Meta:
        model = ConsentRecord
        fields = ("id", "consent_identifier", "version", "necessary", "functional", "analytics", "marketing", "recorded_at")
        read_only_fields = ("id", "version", "necessary", "recorded_at")

    def create(self, validated_data):
        policy = ConsentPolicy.objects.filter(is_published=True).order_by("-effective_at", "-created_at").first()
        if not policy:
            raise serializers.ValidationError("No consent policy is currently published.")
        request = self.context["request"]
        user = request.user if request.user.is_authenticated else None
        return ConsentRecord.objects.create(policy=policy, user=user, necessary=True, **validated_data)

