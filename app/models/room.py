from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.user import room_user

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)  # Максимальная длина названия - 100 символов
    description = Column(String(500), nullable=True)  # Максимальная длина описания - 500 символов
    admin_id = Column(Integer, ForeignKey("users.id"))
    
    # Отношения
    admin = relationship("User", back_populates="admin_rooms", foreign_keys=[admin_id])
    users = relationship("User", secondary=room_user, back_populates="rooms")
    files = relationship("File", back_populates="room") 