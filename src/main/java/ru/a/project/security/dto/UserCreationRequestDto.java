package ru.a.project.security.dto;

import lombok.Data;

@Data
public class UserCreationRequestDto {
    private String name;
    private String username;
    private String email;
    private String password;
}
