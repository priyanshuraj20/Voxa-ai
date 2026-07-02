from datetime import datetime, timedelta, timezone


def create_user_document(
    full_name: str,
    email: str,
    hashed_password: str,
    preferred_source_language: str = "en-US",
    preferred_target_language: str = "hi-IN",
):
    return {
        "full_name": full_name,
        "email": email.lower(),
        "password": hashed_password,
        "preferred_source_language": preferred_source_language,
        "preferred_target_language": preferred_target_language,
        "refresh_token": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

def create_otp_expiry():

    return datetime.now(

        timezone.utc

    ) + timedelta(

        minutes=5

    )