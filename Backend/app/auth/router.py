from fastapi import APIRouter,Depends



from app.auth.schemas import (
    RegisterUserSchema,
    LoginUserSchema,
    ForgotPasswordSchema,
    VerifyOTPSchema,
    ResetPasswordSchema
)

from app.auth.service import (
    register_user,
    login_user,
    forgot_password,
    verify_otp,
    reset_password
)

from app.auth.dependency import get_current_user

from app.auth.service import refresh_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)
from app.auth.dependency import get_current_user


from app.auth.service import logout_user


from app.auth.schemas import ChangePasswordSchema
from app.auth.service import change_password
from app.auth.schemas import ForgotPasswordSchema
from app.auth.service import forgot_password


@router.post("/register", status_code=201)
async def register(
    user: RegisterUserSchema,
):
    return await register_user(user)

@router.post("/login")
async def login(
    user: LoginUserSchema,
):
    return await login_user(user)



@router.get("/me")
async def get_me(
    current_user = Depends(get_current_user)
):
    return {

        "id": str(current_user["_id"]),

        "full_name": current_user["full_name"],

        "email": current_user["email"],

        "preferred_source_language": current_user.get("preferred_source_language", "en-US"),

        "preferred_target_language": current_user.get("preferred_target_language", "hi-IN"),

    }


@router.post("/logout")
async def logout(
    current_user=Depends(get_current_user)
):
    return await logout_user(current_user)


@router.post("/refresh")
async def refresh(
    current_user=Depends(get_current_user)
):
    return await refresh_access_token(current_user)



@router.post("/change-password")
async def change_user_password(
    data: ChangePasswordSchema,
    current_user=Depends(get_current_user)
):
    return await change_password(
        data,
        current_user
    )

@router.post("/forgot-password")
async def forgot_password_route(

    user: ForgotPasswordSchema

):

    return await forgot_password(user)

@router.post("/verify-otp")
async def verify_otp_route(
    data: VerifyOTPSchema
):
    return await verify_otp(data)


@router.post("/reset-password")
async def reset_password_route(
    data: ResetPasswordSchema
):
    return await reset_password(data)


from app.auth.schemas import UserPreferencesSchema
from app.auth.service import update_user_preferences

@router.put("/preferences")
async def update_preferences(
    data: UserPreferencesSchema,
    current_user = Depends(get_current_user)
):
    return await update_user_preferences(data, current_user)