from sqlalchemy import Column, Integer, String, ForeignKey, LargeBinary, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class FileType(Base):
    __tablename__ = "file_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    extension = Column(String, unique=True)
    
    # Отношения
    files = relationship("File", back_populates="type")

class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    data = Column(LargeBinary)
    size = Column(Integer)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    type_id = Column(Integer, ForeignKey("file_types.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    room_id = Column(Integer, ForeignKey("rooms.id"))
    
    # Отношения
    type = relationship("FileType", back_populates="files")
    user = relationship("User", back_populates="files")
    room = relationship("Room", back_populates="files") 