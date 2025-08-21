from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: Optional[str] = None
    role: Literal["customer", "staff"] | None = None

class UserRead(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    role: Literal["customer", "staff"]

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: Literal["customer", "staff"]

class TokenPayload(BaseModel):
    sub: str
    exp: int
    role: Literal["customer", "staff"]
