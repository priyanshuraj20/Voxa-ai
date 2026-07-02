from fastapi import APIRouter,Depends



from app.auth.schemas import (
    RegisterUserSchema,
    LoginUserSchema,
)

from app.auth.service import (
    register_user,
    login_user,
)

from app.auth.dependency import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)
from app.auth.dependency import get_current_user


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

        "email": current_user["email"]

    }