from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional, Tuple

from app.models.file import File


def get_file_by_id(db: Session, file_id: int) -> File:
    file = db.query(File).filter(File.id == file_id).first()
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File with id {file_id} not found"
        )
    return file


def get_files_by_room_id(db: Session, room_id: int) -> List[File]:
    return db.query(File).filter(File.room_id == room_id).all()


def get_files_by_user_id(db: Session, user_id: int) -> List[File]:
    return db.query(File).filter(File.user_id == user_id).all()


def delete_file(db: Session, file_id: int) -> None:
    file = get_file_by_id(db, file_id)
    db.delete(file)
    db.commit() 