import base64
import hashlib
import hmac
import json
import os
from datetime import datetime, timedelta, timezone
from urllib.error import HTTPError
from urllib.parse import quote, urlencode, urlsplit
from urllib.request import Request, urlopen

from django.conf import settings


STORAGE_ENVIRONMENT_VARIABLES = (
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_REGION",
    "AWS_ENDPOINT_URL_S3",
)


class StorageConfigurationError(RuntimeError):
    pass


def missing_storage_configuration():
    return [name for name in STORAGE_ENVIRONMENT_VARIABLES if not os.environ.get(name, "").strip()]


def bucket_name():
    return settings.CANDIDATE_DOCUMENTS_BUCKET


class NeonStorageClient:
    """Minimal SigV4 client that avoids boto3's large serverless bundle."""

    service = "s3"

    def __init__(self):
        missing = missing_storage_configuration()
        if missing:
            raise StorageConfigurationError(
                "Missing object-storage environment variables: " + ", ".join(missing)
            )
        self.access_key = os.environ["AWS_ACCESS_KEY_ID"]
        self.secret_key = os.environ["AWS_SECRET_ACCESS_KEY"]
        self.region = os.environ["AWS_REGION"]
        self.endpoint = os.environ["AWS_ENDPOINT_URL_S3"].rstrip("/")
        self.host = urlsplit(self.endpoint).netloc

    def _scope(self, date_stamp):
        return f"{date_stamp}/{self.region}/{self.service}/aws4_request"

    def _signing_key(self, date_stamp):
        date_key = hmac.new(("AWS4" + self.secret_key).encode(), date_stamp.encode(), hashlib.sha256).digest()
        region_key = hmac.new(date_key, self.region.encode(), hashlib.sha256).digest()
        service_key = hmac.new(region_key, self.service.encode(), hashlib.sha256).digest()
        return hmac.new(service_key, b"aws4_request", hashlib.sha256).digest()

    def _object_path(self, bucket, key):
        return f"/{quote(bucket, safe='')}/{quote(key, safe='/~')}"

    def generate_presigned_post(self, Bucket, Key, Fields=None, Conditions=None, ExpiresIn=300):
        now = datetime.now(timezone.utc)
        amz_date = now.strftime("%Y%m%dT%H%M%SZ")
        date_stamp = now.strftime("%Y%m%d")
        credential = f"{self.access_key}/{self._scope(date_stamp)}"
        fields = {
            "key": Key,
            "x-amz-algorithm": "AWS4-HMAC-SHA256",
            "x-amz-credential": credential,
            "x-amz-date": amz_date,
            **(Fields or {}),
        }
        conditions = [
            {"bucket": Bucket}, {"key": Key},
            {"x-amz-algorithm": "AWS4-HMAC-SHA256"},
            {"x-amz-credential": credential}, {"x-amz-date": amz_date},
            *(Conditions or []),
        ]
        policy = base64.b64encode(json.dumps({
            "expiration": (now + timedelta(seconds=ExpiresIn)).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "conditions": conditions,
        }, separators=(",", ":")).encode()).decode()
        fields["policy"] = policy
        fields["x-amz-signature"] = hmac.new(
            self._signing_key(date_stamp), policy.encode(), hashlib.sha256
        ).hexdigest()
        return {"url": f"{self.endpoint}/{quote(Bucket, safe='')}", "fields": fields}

    def generate_presigned_url(self, operation, Params, ExpiresIn=300):
        if operation != "get_object":
            raise ValueError("Only get_object presigning is supported")
        now = datetime.now(timezone.utc)
        amz_date = now.strftime("%Y%m%dT%H%M%SZ")
        date_stamp = now.strftime("%Y%m%d")
        canonical_uri = self._object_path(Params["Bucket"], Params["Key"])
        query = {
            "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
            "X-Amz-Credential": f"{self.access_key}/{self._scope(date_stamp)}",
            "X-Amz-Date": amz_date,
            "X-Amz-Expires": str(ExpiresIn),
            "X-Amz-SignedHeaders": "host",
        }
        if Params.get("ResponseContentDisposition"):
            query["response-content-disposition"] = Params["ResponseContentDisposition"]
        canonical_query = urlencode(sorted(query.items()), quote_via=quote, safe="-_.~")
        canonical_request = "\n".join([
            "GET", canonical_uri, canonical_query, f"host:{self.host}\n", "host", "UNSIGNED-PAYLOAD",
        ])
        string_to_sign = "\n".join([
            "AWS4-HMAC-SHA256", amz_date, self._scope(date_stamp),
            hashlib.sha256(canonical_request.encode()).hexdigest(),
        ])
        query["X-Amz-Signature"] = hmac.new(
            self._signing_key(date_stamp), string_to_sign.encode(), hashlib.sha256
        ).hexdigest()
        return f"{self.endpoint}{canonical_uri}?{urlencode(sorted(query.items()), quote_via=quote, safe='-_.~')}"

    def _request(self, method, bucket, key):
        now = datetime.now(timezone.utc)
        amz_date = now.strftime("%Y%m%dT%H%M%SZ")
        date_stamp = now.strftime("%Y%m%d")
        payload_hash = hashlib.sha256(b"").hexdigest()
        canonical_uri = self._object_path(bucket, key)
        canonical_headers = f"host:{self.host}\nx-amz-content-sha256:{payload_hash}\nx-amz-date:{amz_date}\n"
        signed_headers = "host;x-amz-content-sha256;x-amz-date"
        canonical_request = "\n".join([
            method, canonical_uri, "", canonical_headers, signed_headers, payload_hash,
        ])
        string_to_sign = "\n".join([
            "AWS4-HMAC-SHA256", amz_date, self._scope(date_stamp),
            hashlib.sha256(canonical_request.encode()).hexdigest(),
        ])
        signature = hmac.new(
            self._signing_key(date_stamp), string_to_sign.encode(), hashlib.sha256
        ).hexdigest()
        authorization = (
            f"AWS4-HMAC-SHA256 Credential={self.access_key}/{self._scope(date_stamp)}, "
            f"SignedHeaders={signed_headers}, Signature={signature}"
        )
        request = Request(f"{self.endpoint}{canonical_uri}", method=method, headers={
            "Host": self.host, "X-Amz-Date": amz_date,
            "X-Amz-Content-Sha256": payload_hash, "Authorization": authorization,
        })
        try:
            return urlopen(request, timeout=15)
        except HTTPError as error:
            detail = error.read().decode(errors="replace")
            raise RuntimeError(f"Neon storage returned HTTP {error.code}: {detail[:300]}") from error

    def head_object(self, Bucket, Key):
        with self._request("HEAD", Bucket, Key) as response:
            return {"ContentLength": int(response.headers.get("Content-Length", "0"))}

    def delete_object(self, Bucket, Key):
        with self._request("DELETE", Bucket, Key):
            return {}


def storage_client():
    return NeonStorageClient()
