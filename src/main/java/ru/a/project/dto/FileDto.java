package ru.a.project.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class FileDto {
    private Integer id;
    private String name;
    private String description;
    private Integer sizeKb;
    private String type;
    private Integer downloads;
    private UserDto user;
}
