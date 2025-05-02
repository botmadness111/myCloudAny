package ru.a.project.security.dto;

import lombok.Data;

@Data
public class UserAuthorizationRequestDto {
    private String username;
    private String password;
}
