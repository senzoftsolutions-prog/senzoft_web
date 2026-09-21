import secrets


def public_id(prefix: str) -> str:
    return f"{prefix}-{secrets.token_hex(6).upper()}"


def candidate_id(): return public_id("CAN")
def job_id(): return public_id("JOB")
def application_id(): return public_id("APP")
def interview_id(): return public_id("INT")
def document_id(): return public_id("DOC")
def bgv_id(): return public_id("BGV")
def offer_id(): return public_id("OFF")
def joining_id(): return public_id("JOIN")
def blog_id(): return public_id("BLOG")
def notification_id(): return public_id("NOT")
