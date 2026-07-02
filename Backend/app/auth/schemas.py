from pydantic import BaseModel, EmailStr, Field



class RegisterUserSchema(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    preferred_source_language: str = Field("en-US")
    preferred_target_language: str = Field("hi-IN")


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



class ChangePasswordSchema(BaseModel):
    old_password: str = Field(min_length=8)
    new_password: str = Field(min_length=8)

class ForgotPasswordSchema(BaseModel):

    email: EmailStr

class VerifyOTPSchema(BaseModel):

    email: EmailStr

    otp: str

class ResetPasswordSchema(BaseModel):

    email: EmailStr

    otp: str

    new_password: str = Field(
        min_length=8
    )

class UserPreferencesSchema(BaseModel):
    preferred_source_language: str
    preferred_target_language: str