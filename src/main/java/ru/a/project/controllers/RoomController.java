package ru.a.project.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.a.project.dto.*;
import ru.a.project.exception.room.CreateRoomException;
import ru.a.project.model.Room;
import ru.a.project.model.User;
import ru.a.project.security.UserDetailsImpl;
import ru.a.project.services.RoomService;
import ru.a.project.services.UserService;
import ru.a.project.util.ByteArrayResourceWithFilename;

import java.awt.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/room")
public class RoomController {

    private final RoomService roomService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @Autowired
    public RoomController(RoomService roomService, UserService userService, ModelMapper modelMapper) {
        this.roomService = roomService;
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/{id}/files")
    public String homeFilesPage(Model model, @PathVariable Integer id) {
        Room room = roomService.findById(id);
        User admin = room.getAdmin();

        model.addAttribute("c_user", admin);
        model.addAttribute("room", room);
        model.addAttribute("files", convertToFileDto(room.getFiles()));

        return "room/home/files";
    }

    @GetMapping("/{id}/users")
    public String homeUsersPage(Model model, @PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Integer userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();

        User c_user = userService.findById(userId);

        Room room = roomService.findById(id);
        User admin = room.getAdmin();

        model.addAttribute("c_user", c_user);
        model.addAttribute("room", room);
        model.addAttribute("users", convertToUserDto(room.getUsers()));

        return "room/home/users";
    }

    @PostMapping("/upload")
    public ResponseEntity<FileDto> uploadFile(@RequestParam("file") MultipartFile multipatFile,
                             @RequestParam(value = "description", required = false, defaultValue = "") String description,
                             @RequestParam("room_id") Integer roomId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(
                convertToSingleFileDto(roomService.uploadFile(multipatFile, roomId, userId, description))
        );
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable Integer id) throws IOException {

        ByteArrayResourceWithFilename resource = roomService.downloadFile(id);

        String filename = new String(resource.getFilename().getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }


    @PostMapping("/create")
    public ResponseEntity<RoomDto> createRoom(@RequestBody RoomCreationDto roomCreationDto) {
        String name = roomCreationDto.getName();
//        Integer adminId = roomCreationDto.getAdmin();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();

        if (name.isBlank()) throw new CreateRoomException("Пустое название");

        User admin = userService.findById(userId);
        Room createdRoom = roomService.createRoom(name, admin);

        if (createdRoom == null) throw new CreateRoomException("Не удалось создать комнату");
        return ResponseEntity.ok(convertToRoomDto(createdRoom));
    }

    @PutMapping("/add_user")
    public ResponseEntity<UserDto> addUser(@RequestBody UserAddingDto userAddingDto){
        System.out.println("HANDLED - handled request");

        User user = roomService.addUser(userAddingDto.getUsername(), userAddingDto.getRoomId());

        return ResponseEntity.ok(convertToUserDto(user));
    }

    @PutMapping("/remove_user")
    public String removeUser(@RequestParam("user_id")Integer userId,
                                           @RequestParam("room_id") Integer roomId){

        User user = roomService.removeUser(userId, roomId);

        return "redirect:/room/" + roomId + "/users";
    }

    private UserDto convertToUserDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }

    private List<UserDto> convertToUserDto(List<User> users) {
        return users.stream()
                .map(user -> modelMapper.map(user, UserDto.class))
                .collect(Collectors.toList());
    }

    private List<User> convertToUser(List<UserDto> usersDto) {
        return usersDto.stream()
                .map(userDto -> modelMapper.map(userDto, User.class))
                .collect(Collectors.toList());
    }

    private List<FileDto> convertToFileDto(List<ru.a.project.model.File> files) {
        return files.stream()
                .map(file -> modelMapper.map(file, FileDto.class))
                .collect(Collectors.toList());
    }

    private FileDto convertToSingleFileDto(ru.a.project.model.File file) {
        return modelMapper.map(file, FileDto.class);
    }

    private List<File> convertToFile(List<FileDto> filesDto) {
        return filesDto.stream()
                .map(fileDto -> modelMapper.map(fileDto, File.class))
                .collect(Collectors.toList());
    }

    private RoomDto convertToRoomDto(Room room) {
        return modelMapper.map(room, RoomDto.class);
    }

}
