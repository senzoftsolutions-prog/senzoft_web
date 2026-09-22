from rest_framework.views import exception_handler


def _first_message(value):
    if isinstance(value, dict):
        for item in value.values():
            message = _first_message(item)
            if message:
                return message
    elif isinstance(value, (list, tuple)):
        for item in value:
            message = _first_message(item)
            if message:
                return message
    elif value is not None:
        return str(value)
    return ""


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response
    detail = response.data.get("detail") if isinstance(response.data, dict) else None
    code = getattr(detail, "code", None) or "VALIDATION_ERROR" if response.status_code == 400 else "REQUEST_FAILED"
    message = str(detail) if detail else _first_message(response.data) or "The request could not be completed."
    if response.status_code == 404:
        code, message = "NOT_FOUND", "The requested resource could not be found."
    elif response.status_code == 403:
        code, message = "FORBIDDEN", "You do not have permission to perform this action."
    elif response.status_code == 401:
        code, message = "AUTHENTICATION_REQUIRED", "Authentication is required."
    response.data = {"success": False, "error": {"code": code, "message": message, "details": response.data}}
    return response
