package ru.a.project.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.a.project.model.FileType;
import ru.a.project.repository.FileTypeRepository;

import java.util.Optional;

@Service
public class FileTypeService {

    private final FileTypeRepository fileTypeRepository;

    @Autowired
    public FileTypeService(FileTypeRepository fileTypeRepository) {
        this.fileTypeRepository = fileTypeRepository;
    }

    public FileType findFileTypeByType(String type) {

        Optional<FileType> fileTypeFounded = fileTypeRepository.findFileTypeByType(type);

        if (fileTypeFounded.isEmpty()) {
            throw new RuntimeException("не найдено имя для расширения: " + type);
        }

        return fileTypeFounded.get();

    }
}
