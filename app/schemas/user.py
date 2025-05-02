from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserAddingDto(BaseModel):
    username: str
    room_id: int


class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True


class UserInDB(UserBase):
    id: int
    hashed_password: str

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
    user_id: Optional[int] = None 