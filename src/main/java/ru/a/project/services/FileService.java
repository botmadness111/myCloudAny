package ru.a.project.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.a.project.model.File;
import ru.a.project.repository.FileRepository;

import java.util.Optional;

@Transactional(readOnly = true)
@Service
public class FileService {
    private final FileRepository fileRepository;

    @Autowired
    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public File findById(int id) {
        Optional<File> fileOptional = fileRepository.findById(id);

        if (fileOptional.isEmpty()) {
            throw new RuntimeException("не найден файл с id: " + id);
        }

        return fileOptional.get();
    }

    @Transactional
    public File save(File file){
        return fileRepository.save(file);
    }

    public Integer countAllByName(String name, String type, Integer roomId){
        return fileRepository.countAllByNameAndTypeAndRoomId(name, type, roomId);
    }

    public Integer isExist(String name, Integer room_id){
        return fileRepository.isExist(name, room_id);
    }
}
