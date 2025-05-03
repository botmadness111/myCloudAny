from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.user import UserResponse, PasswordUpdate
from app.services.user_service import get_user_by_id, get_users, update_password
from app.security.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/users",
    tags=["users"],
    dependencies=[Depends(get_current_user)]
)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    return get_user_by_id(db, user_id)


@router.get("/", response_model=List[UserResponse])
async def get_users_list(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_users(db, skip, limit)


@router.put("/me/password")
async def update_password_endpoint(
    password_update: PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    update_password(db, current_user.id, password_update.old_password, password_update.new_password)
    return {"message": "Password updated successfully"} 