from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import io

from app.database import get_db
from app.schemas.room import RoomResponse, RoomDetailResponse, RoomCreationDto, RoomUpdateDto
from app.schemas.user import UserResponse, UserAddingDto
from app.schemas.file import FileResponse as FileResponseSchema
from app.services.room_service import (
    get_room_by_id, get_rooms, get_rooms_by_user, create_room,
    add_user_to_room, remove_user_from_room, upload_file_to_room, download_file,
    update_room, delete_file, delete_room
)
from app.security.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/room",
    tags=["rooms"],
    dependencies=[Depends(get_current_user)]
)


@router.get("/{room_id}", response_model=RoomDetailResponse)
async def get_room(room_id: int, db: Session = Depends(get_db)):
    return get_room_by_id(db, room_id)


@router.get("/{room_id}/files", response_model=RoomDetailResponse)
async def get_room_files(room_id: int, db: Session = Depends(get_db)):
    return get_room_by_id(db, room_id)


@router.get("/{room_id}/users", response_model=RoomDetailResponse)
async def get_room_users(room_id: int, db: Session = Depends(get_db)):
    return get_room_by_id(db, room_id)


@router.get("/", response_model=List[RoomResponse])
async def get_rooms_list(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_rooms_by_user(db, current_user.id)


@router.post("/create", response_model=RoomResponse)
async def create_new_room(
    room_data: RoomCreationDto,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_room(db, room_data.name, current_user.id, room_data.description)


@router.put("/add_user", response_model=UserResponse)
async def add_user(user_data: UserAddingDto, db: Session = Depends(get_db)):
    return add_user_to_room(db, user_data.username, user_data.room_id)


@router.put("/remove_user")
async def remove_user(user_id: int, room_id: int, db: Session = Depends(get_db)):
    user = remove_user_from_room(db, user_id, room_id)
    return {"message": f"User {user.username} removed from room"}


@router.post("/upload", response_model=FileResponseSchema)
async def upload_file(
    file: UploadFile = File(...),
    room_id: int = Form(...),
    description: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await upload_file_to_room(db, file, room_id, current_user.id, description)


@router.get("/download/{file_id}")
async def download_file_endpoint(file_id: int, db: Session = Depends(get_db)):
    file_data, filename, content_type = download_file(db, file_id)
    
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"',
        "Content-Type": content_type
    }
    print(f"Отправляемые заголовки: {headers}")
    
    return StreamingResponse(
        io.BytesIO(file_data),
        media_type=content_type,
        headers=headers
    )


@router.put("/{room_id}", response_model=RoomResponse)
async def update_room_endpoint(
    room_id: int,
    room_data: RoomUpdateDto,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    room = get_room_by_id(db, room_id)
    if room.admin_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only room admin can update room"
        )
    return update_room(db, room_id, room_data.name, room_data.description)


@router.delete("/{room_id}/files/{file_id}")
async def delete_file_endpoint(
    room_id: int,
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    delete_file(db, file_id, current_user.id)
    return {"message": "File deleted successfully"}


@router.delete("/{room_id}")
async def delete_room_endpoint(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    delete_room(db, room_id, current_user.id)
    return {"message": "Room deleted successfully"} 