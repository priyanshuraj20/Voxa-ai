from fastapi import HTTPException, status
from datetime import datetime,timezone
from app.database import users_collection
from app.auth.dependency import invalidate_user_cache


from app.auth.password import hash_password

from app.auth.models import create_user_document

from app.auth.schemas import (
    RegisterUserSchema,
    LoginUserSchema,
)


from app.auth.password import verify_password
from app.auth.jwt import (
    create_access_token,
    create_refresh_token,
)
from app.auth.jwt import (
    create_access_token,
    create_refresh_token,
)


from app.auth.schemas import (
    RegisterUserSchema,
    LoginUserSchema,
    ForgotPasswordSchema,
    VerifyOTPSchema,
    ResetPasswordSchema
)
from app.auth.password import verify_password, hash_password



from app.auth.email import send_reset_otp
from app.auth.otp import generate_otp
from app.auth.models import create_otp_expiry

async def get_user_by_email(email: str):

    return await users_collection.find_one(
        {
            "email": email.lower()
        }
    )   # for lowering the email lowercse


async def register_user(    # register user service 
    user: RegisterUserSchema,
):

    existing_user = await get_user_by_email(    #Email already hai ya nahi.
        user.email
    )

    if existing_user:
                #Agar mil gaya     409 means conflict
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered."
        )
# nahi mila toh : phale passwor dhash 
    hashed_password = hash_password(
        user.password       
    )
#mongo document 
    user_document = create_user_document(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hashed_password,
        preferred_source_language=user.preferred_source_language,
        preferred_target_language=user.preferred_target_language,
    )
#databse mein save 
    result = await users_collection.insert_one(
        user_document
    )
#response
    return {

        "message": "User registered successfully.",

        "user_id": str(result.inserted_id)

    }

#login function :
async def login_user(user: LoginUserSchema):

    existing_user = await get_user_by_email(user.email)

    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    if not verify_password(
        user.password,
        existing_user["password"],
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password."
        )

    access_token = create_access_token(
    {
        "user_id": str(existing_user["_id"]),
        "email": existing_user["email"],
        "type": "access"
    }
)

    refresh_token = create_refresh_token(
    {
        "user_id": str(existing_user["_id"]),
        "email": existing_user["email"],
        "type": "refresh"
    }
)

    await users_collection.update_one(
        {
            "_id": existing_user["_id"]
        },
        {
            "$set": {
                "refresh_token": refresh_token
            }
        }
    )

    return {
        "message": "Login successful.",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": str(existing_user["_id"]),
            "full_name": existing_user["full_name"],
            "email": existing_user["email"],
            "preferred_source_language": existing_user.get("preferred_source_language", "en-US"),
            "preferred_target_language": existing_user.get("preferred_target_language", "hi-IN"),
        },
    }



async def logout_user(current_user):

    await users_collection.update_one(
        {
            "_id": current_user["_id"]
        },
        {
            "$set": {
                "refresh_token": None
            }
        }
    )

    invalidate_user_cache(current_user["_id"])

    return {
        "message": "Logout successful."
    }


async def refresh_access_token(current_user):

    access_token = create_access_token(
        {
            "user_id": str(current_user["_id"]),
            "email": current_user["email"],
            "type": "access"
        }
    )

    return {

        "access_token": access_token

    }


async def change_password(data, current_user):

    if not verify_password(
        data.old_password,
        current_user["password"]
    ):
        raise HTTPException(
            status_code=400,
            detail="Old password is incorrect."
        )

    new_password = hash_password(data.new_password)

    await users_collection.update_one(
        {
            "_id": current_user["_id"]
        },
        {
            "$set": {
                "password": new_password
            }
        }
    )

    invalidate_user_cache(current_user["_id"])

    return {
        "message": "Password changed successfully."
    }



async def forgot_password(
    user: ForgotPasswordSchema
):

    existing_user = await get_user_by_email(user.email)

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    otp = generate_otp()

    expiry = create_otp_expiry()

    await users_collection.update_one(

        {
            "_id": existing_user["_id"]
        },

        {
            "$set": {

                "reset_otp": otp,

                "reset_otp_expiry": expiry

            }
        }

    )

    send_reset_otp(
        user.email,
        otp
    )

    return {

        "message": "OTP sent successfully."

    }




async def verify_otp(
    data: VerifyOTPSchema
):

    user = await get_user_by_email(data.email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    if user.get("reset_otp") != data.otp:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP."
        )

    if datetime.now(timezone.utc) > user["reset_otp_expiry"]:
        raise HTTPException(
            status_code=400,
            detail="OTP Expired."
        )

    return {

        "message": "OTP verified."

    }


async def reset_password(
    data: ResetPasswordSchema
):

    user = await get_user_by_email(data.email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    if user.get("reset_otp") != data.otp:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP."
        )

    if datetime.now(timezone.utc) > user["reset_otp_expiry"]:
        raise HTTPException(
            status_code=400,
            detail="OTP Expired."
        )

    new_password = hash_password(
        data.new_password
    )

    await users_collection.update_one(

        {
            "_id": user["_id"]
        },

        {
            "$set": {

                "password": new_password

            },

            "$unset": {

                "reset_otp": "",

                "reset_otp_expiry": ""

            }

        }

    )

    return {

        "message": "Password updated successfully."

    }


async def update_user_preferences(data, current_user):

    await users_collection.update_one(

        {
            "_id": current_user["_id"]
        },

        {
            "$set": {

                "preferred_source_language": data.preferred_source_language,

                "preferred_target_language": data.preferred_target_language,

                "updated_at": datetime.utcnow()

            }
        }

    )

    invalidate_user_cache(current_user["_id"])

    return {

        "message": "Preferences updated successfully."

    }