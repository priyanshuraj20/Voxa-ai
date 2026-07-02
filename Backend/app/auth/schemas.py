from pydantic import BaseModel, EmailStr, Field


class RegisterUserSchema(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)


class LoginUserSchema(BaseModel):
    email: EmailStr
    password: str


class UserResponseSchema(BaseModel):
    id: str
    full_name: str
    email: EmailStr

class LoginUserSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)