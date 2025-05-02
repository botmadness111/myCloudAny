package ru.a.project.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.a.project.security.dto.UserAuthorizationRequestDto;
import ru.a.project.security.dto.UserAuthorizationResponseDto;
import ru.a.project.security.dto.UserCreationRequestDto;
import ru.a.project.security.dto.UserCreationResponseDto;
import ru.a.project.security.model.UserCreationResult;
import ru.a.project.security.service.AuthorizationService;

@Controller
public class AuthorizationController {

    private AuthorizationService authorizationService;

    @Autowired
    public void setAuthorizationService(AuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }

    @GetMapping("/login")
    public String loginPage() {
        return "authorization/signin";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "authorization/signup";
    }

    @PostMapping("/register")
    public ResponseEntity<UserCreationResponseDto> createUser(@RequestBody UserCreationRequestDto userCreationRequestDto) {
        UserCreationResult userCreationResult = authorizationService.createUser(userCreationRequestDto);

        UserCreationResponseDto userCreationResp = null;
        switch (userCreationResult) {
            case SUCCESS -> {
                userCreationResp = new  UserCreationResponseDto("success");
            }
            case ALREADY_EXISTS -> {
                userCreationResp = new UserCreationResponseDto("user already exists");
            }
        }

        if (userCreationResp == null) userCreationResp = new UserCreationResponseDto("failure");
        return ResponseEntity.ok(userCreationResp);
    }
}
