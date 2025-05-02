package ru.a.project.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import ru.a.project.model.User;
import ru.a.project.repository.UserRepository;
import ru.a.project.security.dto.UserAuthorizationRequestDto;
import ru.a.project.security.dto.UserAuthorizationResponseDto;
import ru.a.project.security.dto.UserCreationRequestDto;
import ru.a.project.security.model.UserCreationResult;

import java.util.Collections;

@Service
public class AuthorizationService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationProvider authenticationProvider;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    public void setAuthenticationProvider(AuthenticationProvider authenticationProvider) {
        this.authenticationProvider = authenticationProvider;
    }

    public UserCreationResult createUser(UserCreationRequestDto userCreationRequestDto) {
        boolean exists = userRepository.findByUsernameOrEmail(userCreationRequestDto.getUsername(), userCreationRequestDto.getEmail()).isPresent();

        if (exists) return UserCreationResult.ALREADY_EXISTS;

        User user = userRepository.save(new User(
                0,
                userCreationRequestDto.getName(),
                userCreationRequestDto.getUsername(),
                userCreationRequestDto.getEmail(),
                passwordEncoder.encode(userCreationRequestDto.getPassword()),
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList()
        ));

        return UserCreationResult.SUCCESS;
    }
}
