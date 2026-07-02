from datetime import datetime


def create_user_document(
    full_name: str,
    email: str,
    hashed_password: str,
):
    return {
        "full_name": full_name,
        "email": email.lower(),
        "password": hashed_password,
        "refresh_token": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }