import os
import boto3
from botocore.config import Config
from django.conf import settings


def storage_client():
    return boto3.client(
        "s3",
        endpoint_url=os.getenv("AWS_ENDPOINT_URL_S3"),
        region_name=os.getenv("AWS_REGION"),
        config=Config(s3={"addressing_style": "path"}),
    )


def bucket_name():
    return settings.CANDIDATE_DOCUMENTS_BUCKET
