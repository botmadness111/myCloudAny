from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.user import UserResponse
from app.schemas.file import FileResponse


class RoomBase(BaseModel):
    name: str


class RoomCreate(RoomBase):
    pass


class RoomCreationDto(BaseModel):
    name: str


class RoomResponse(RoomBase):
    id: int
    admin_id: int

    class Config:
        from_attributes = True


class RoomDetailResponse(RoomResponse):
    admin: UserResponse
    users: List[UserResponse] = []
    files: List["FileResponse"] = []

    class Config:
        from_attributes = True 