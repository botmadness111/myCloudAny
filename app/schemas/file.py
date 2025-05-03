from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.user import UserResponse


class FileTypeBase(BaseModel):
    name: str
    extension: str


class FileTypeResponse(FileTypeBase):
    id: int

    class Config:
        orm_mode = True


class FileBase(BaseModel):
    name: str
    description: Optional[str] = None


class FileCreate(FileBase):
    pass


class FileResponse(FileBase):
    id: int
    size: int
    uploaded_at: datetime
    type_id: int
    user_id: int
    room_id: int
    user: UserResponse

    class Config:
        orm_mode = True


class FileDetailResponse(FileResponse):
    type: FileTypeResponse

    class Config:
        orm_mode = True 