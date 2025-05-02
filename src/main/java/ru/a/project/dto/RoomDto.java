package ru.a.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
public class RoomDto {
    private Integer id;
    private String name;
    private UserDto admin;
}
