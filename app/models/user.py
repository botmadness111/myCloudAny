from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

# Связь многие ко многим между комнатами и пользователями
room_user = Table(
    "room_user",
    Base.metadata,
    Column("room_id", Integer, ForeignKey("rooms.id")),
    Column("user_id", Integer, ForeignKey("users.id"))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Отношения
    rooms = relationship("Room", secondary=room_user, back_populates="users")
    admin_rooms = relationship("Room", back_populates="admin")
    files = relationship("File", back_populates="user") 