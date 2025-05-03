from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional

from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.security.auth import get_password_hash, verify_password


def get_user_by_id(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    return user


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user_create: UserCreate) -> User:
    # Проверяем, что пользователя с таким именем или email нет
    db_user_by_username = get_user_by_username(db, user_create.username)
    if db_user_by_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    db_user_by_email = get_user_by_email(db, user_create.email)
    if db_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Создаем нового пользователя
    hashed_password = get_password_hash(user_create.password)
    db_user = User(
        username=user_create.username,
        email=user_create.email,
        hashed_password=hashed_password
    )
    
    # Сохраняем пользователя в базу данных
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def update_password(db: Session, user_id: int, old_password: str, new_password: str) -> User:
    # Получаем пользователя
    user = get_user_by_id(db, user_id)
    
    # Проверяем старый пароль
    if not verify_password(old_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect old password"
        )
    
    # Хэшируем новый пароль
    hashed_password = get_password_hash(new_password)
    
    # Обновляем пароль
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    
    return user 