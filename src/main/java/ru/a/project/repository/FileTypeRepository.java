package ru.a.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.a.project.model.FileType;

import java.util.Optional;

@Repository
public interface FileTypeRepository extends JpaRepository<FileType, Integer> {

    Optional<FileType> findFileTypeByType(String type);
}
