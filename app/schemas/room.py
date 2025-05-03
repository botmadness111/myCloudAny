from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from app.schemas.user import UserResponse
from app.schemas.file import FileResponse


class RoomBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)


class RoomCreate(RoomBase):
    pass


class RoomCreationDto(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)


class RoomUpdateDto(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)


class RoomResponse(RoomBase):
    id: int
    admin_id: int
    admin: UserResponse
    users: List[UserResponse] = []

    class Config:
        from_attributes = True
        populate_by_name = True


class RoomDetailResponse(RoomResponse):
    files: List["FileResponse"] = []

    class Config:
        from_attributes = True
        populate_by_name = True 