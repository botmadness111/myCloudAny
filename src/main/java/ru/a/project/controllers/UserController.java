package ru.a.project.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import ru.a.project.dto.RoomDto;
import ru.a.project.model.Room;
import ru.a.project.model.User;
import ru.a.project.security.UserDetailsImpl;
import ru.a.project.services.UserService;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    @Autowired
    public UserController(UserService userService, ModelMapper modelMapper) {
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/rooms")
    public String userRooms(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();

        User user = userService.findById(userId);
        List<RoomDto> userRooms = convertToRoomDto(user.getRooms());
        List<RoomDto> adminRooms = convertToRoomDto(user.getAdminRooms());

        model.addAttribute("userRooms", userRooms);
        model.addAttribute("adminRooms", adminRooms);
        model.addAttribute("c_user", user);
        return "user/rooms";
    }

    @GetMapping("/home")
    public String index() {
        return "/main/index";
    }

    private List<RoomDto> convertToRoomDto(List<Room> rooms) {
        return rooms.stream()
                .map(room -> modelMapper.map(room, RoomDto.class))
                .collect(Collectors.toList());
    }

    private List<Room> convertToRoom(List<RoomDto> roomsDto) {
        return roomsDto.stream()
                .map(roomDto -> modelMapper.map(roomDto, Room.class))
                .collect(Collectors.toList());
    }
}
