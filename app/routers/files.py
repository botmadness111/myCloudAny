from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.file import FileResponse, FileDetailResponse
from app.services.file_service import get_file_by_id, get_files_by_user_id, delete_file
from app.security.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/files",
    tags=["files"],
    dependencies=[Depends(get_current_user)]
)


@router.get("/{file_id}", response_model=FileDetailResponse)
async def get_file(file_id: int, db: Session = Depends(get_db)):
    return get_file_by_id(db, file_id)


@router.get("/", response_model=List[FileResponse])
async def get_user_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_files_by_user_id(db, current_user.id)


@router.delete("/{file_id}")
async def delete_file_endpoint(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    file = get_file_by_id(db, file_id)
    
    # Проверяем, является ли пользователь владельцем файла или администратором комнаты
    if file.user_id != current_user.id and file.room.admin_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this file"
        )
    
    delete_file(db, file_id)
    return {"message": "File deleted successfully"} 