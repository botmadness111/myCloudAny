from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.file import FileType


def get_file_type_by_id(db: Session, type_id: int) -> Optional[FileType]:
    return db.query(FileType).filter(FileType.id == type_id).first()


def get_file_type_by_extension(db: Session, extension: str) -> Optional[FileType]:
    return db.query(FileType).filter(FileType.extension == extension).first()


def get_file_types(db: Session, skip: int = 0, limit: int = 100) -> List[FileType]:
    return db.query(FileType).offset(skip).limit(limit).all()


def create_file_type(db: Session, name: str, extension: str) -> FileType:
    db_file_type = FileType(name=name, extension=extension)
    db.add(db_file_type)
    db.commit()
    db.refresh(db_file_type)
    return db_file_type


def create_default_file_type(db: Session, extension: str) -> FileType:
    # Если тип файла не найден, создаем новый
    type_name = extension.upper() if extension != "unknown" else "Unknown"
    return create_file_type(db, type_name, extension) 