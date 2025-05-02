package ru.a.project.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.a.project.exception.room.UserNotFoundException;
import ru.a.project.model.Room;
import ru.a.project.model.User;
import ru.a.project.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Transactional(readOnly = true)
@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findById(int id) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Не нашел user с id: " + id);
        }

        return userOptional.get();
    }

    public User findByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            throw new UserNotFoundException("не найден user с username: " + username);
        }

        return userOptional.get();
    }

    public void save(User user) {
        userRepository.save(user);
    }
}
