from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from typing import List, Optional, BinaryIO, Tuple
import os
import io
from datetime import datetime

from app.models.room import Room
from app.models.user import User
from app.models.file import File, FileType
from app.schemas.room import RoomCreate, RoomResponse
from app.schemas.file import FileResponse
from app.services.user_service import get_user_by_id, get_user_by_username
from app.services.file_type_service import get_file_type_by_extension, create_default_file_type


def get_room_by_id(db: Session, room_id: int) -> Room:
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Room with id {room_id} not found"
        )
    return room


def get_rooms(db: Session, skip: int = 0, limit: int = 100) -> List[Room]:
    return db.query(Room).offset(skip).limit(limit).all()


def get_rooms_by_user(db: Session, user_id: int) -> List[Room]:
    user = get_user_by_id(db, user_id)
    return user.rooms


def create_room(db: Session, name: str, admin_id: int) -> Room:
    # Получаем пользователя-администратора
    admin = get_user_by_id(db, admin_id)
    
    # Создаем новую комнату
    room = Room(name=name, admin_id=admin.id)
    
    # Добавляем админа как пользователя комнаты
    room.users.append(admin)
    
    # Сохраняем комнату в базу данных
    db.add(room)
    db.commit()
    db.refresh(room)
    
    return room


def add_user_to_room(db: Session, username: str, room_id: int) -> User:
    # Получаем комнату
    room = get_room_by_id(db, room_id)
    
    # Получаем пользователя
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with username {username} not found"
        )
    
    # Проверяем, что пользователь еще не добавлен в комнату
    if user in room.users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User {username} is already in the room"
        )
    
    # Добавляем пользователя в комнату
    room.users.append(user)
    
    # Сохраняем изменения
    db.commit()
    db.refresh(room)
    
    return user


def remove_user_from_room(db: Session, user_id: int, room_id: int) -> User:
    # Получаем комнату
    room = get_room_by_id(db, room_id)
    
    # Получаем пользователя
    user = get_user_by_id(db, user_id)
    
    # Проверяем, что пользователь есть в комнате
    if user not in room.users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with id {user_id} is not in the room"
        )
    
    # Проверяем, что пользователь не является администратором комнаты
    if room.admin_id == user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot remove room administrator from the room"
        )
    
    # Удаляем пользователя из комнаты
    room.users.remove(user)
    
    # Сохраняем изменения
    db.commit()
    
    return user


async def upload_file_to_room(db: Session, file: UploadFile, room_id: int, user_id: int, description: Optional[str] = None) -> File:
    # Получаем комнату
    room = get_room_by_id(db, room_id)
    
    # Получаем пользователя
    user = get_user_by_id(db, user_id)
    
    # Проверяем, что пользователь есть в комнате
    if user not in room.users:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not in the room"
        )
    
    # Получаем расширение файла
    filename = file.filename
    if not filename:
        filename = "unnamed_file"
    
    # Получаем расширение файла
    ext = os.path.splitext(filename)[1].lower().replace(".", "")
    if not ext:
        ext = "unknown"
    
    # Получаем или создаем тип файла по расширению
    file_type = get_file_type_by_extension(db, ext)
    if not file_type:
        file_type = create_default_file_type(db, ext)
    
    # Читаем содержимое файла
    contents = await file.read()
    
    # Создаем объект файла
    db_file = File(
        name=filename,
        description=description,
        data=contents,
        size=len(contents),
        type_id=file_type.id,
        user_id=user.id,
        room_id=room.id
    )
    
    # Сохраняем файл в базу данных
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    
    return db_file


def download_file(db: Session, file_id: int) -> Tuple[bytes, str]:
    # Получаем файл из базы данных
    file = db.query(File).filter(File.id == file_id).first()
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File with id {file_id} not found"
        )
    
    # Возвращаем содержимое файла и его имя
    return file.data, file.name 