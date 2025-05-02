package ru.a.project.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.a.project.dto.FileDto;
import ru.a.project.model.File;
import ru.a.project.model.Room;
import ru.a.project.model.User;
import ru.a.project.services.FileService;
import ru.a.project.services.RoomService;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/file")
public class FileController {

    private final FileService fileService;
    private final ModelMapper modelMapper;

    @Autowired
    public FileController(FileService fileService, ModelMapper modelMapper) {
        this.fileService = fileService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/{id}")
    public String homePage(Model model, @PathVariable Integer id) {
        File file = fileService.findById(id);

        model.addAttribute("file", convertToFileDto(file));

        return "room/home/files";
    }

    private FileDto convertToFileDto(File file) {
        return modelMapper.map(file, FileDto.class);
    }

    private File convertToFile(FileDto fileDto) {
        return modelMapper.map(fileDto, File.class);
    }
}
