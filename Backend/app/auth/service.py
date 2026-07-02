from fastapi import HTTPException, status

from app.database import users_collection

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
)

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
        },
    }