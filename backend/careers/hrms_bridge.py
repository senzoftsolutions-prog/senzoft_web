import json
import secrets
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings


class HRMSBridgeError(Exception):
    def __init__(self, message, status=503):
        super().__init__(message)
        self.status = status


def request_hrms(path, method="GET", payload=None, file_upload=None):
    base_url = settings.HRMS_INTEGRATION_API_URL
    token = settings.HRMS_INTEGRATION_TOKEN
    if not base_url or not token:
        raise HRMSBridgeError("Careers integration is not configured.")

    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    content_type = "application/json"
    if file_upload is not None:
        boundary = f"----SenzoftHRMS{secrets.token_hex(18)}"
        parts = []
        for name, value in payload.items():
            if value is None:
                continue
            parts.extend((
                f"--{boundary}\r\nContent-Disposition: form-data; name=\"{name}\"\r\n\r\n".encode("utf-8"),
                str(value).encode("utf-8"),
                b"\r\n",
            ))
        filename = file_upload.name.replace("\\", "_").replace('"', "_").replace("\r", "_").replace("\n", "_")
        extension = filename.rsplit(".", 1)[-1].lower()
        mime_type = {
            "pdf": "application/pdf",
            "doc": "application/msword",
            "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }.get(extension, "application/octet-stream")
        uploaded_bytes = b"".join(file_upload.chunks())
        parts.extend((
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"resumeFile\"; filename=\"{filename}\"\r\n".encode("utf-8"),
            f"Content-Type: {mime_type}\r\n\r\n".encode("ascii"),
            uploaded_bytes,
            b"\r\n",
            f"--{boundary}--\r\n".encode("ascii"),
        ))
        body = b"".join(parts)
        content_type = f"multipart/form-data; boundary={boundary}"
    request = Request(
        f"{base_url}/{path.lstrip('/')}",
        data=body,
        method=method,
        headers={
            "Accept": "application/json",
            "Authorization": f"Bearer {token}",
            **({"Content-Type": content_type} if body is not None else {}),
        },
    )
    try:
        with urlopen(request, timeout=10) as response:
            result = json.loads(response.read().decode("utf-8"))
            return result, response.status
    except HTTPError as exc:
        try:
            result = json.loads(exc.read().decode("utf-8"))
        except (ValueError, UnicodeDecodeError):
            result = {}
        raise HRMSBridgeError(result.get("error", "The HRMS request was rejected."), exc.code) from exc
    except (URLError, TimeoutError, OSError, ValueError) as exc:
        raise HRMSBridgeError("HRMS is temporarily unavailable. Please try again.") from exc


def list_hrms_jobs():
    result, _ = request_hrms("jobs/")
    jobs = result.get("jobs")
    if not isinstance(jobs, list):
        raise HRMSBridgeError("HRMS returned an invalid jobs response.")
    return jobs


def submit_hrms_application(payload, resume_file=None):
    return request_hrms("applications/", method="POST", payload=payload, file_upload=resume_file)
