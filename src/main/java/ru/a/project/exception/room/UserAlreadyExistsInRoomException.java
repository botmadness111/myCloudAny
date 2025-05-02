package ru.a.project.exception.room;

import org.springframework.web.bind.annotation.ResponseStatus;

public class UserAlreadyExistsInRoomException extends RuntimeException {
    public UserAlreadyExistsInRoomException() {
        super();
    }

    public UserAlreadyExistsInRoomException(String message) {
        super(message);
    }

    public UserAlreadyExistsInRoomException(String message, Throwable cause) {
        super(message, cause);
    }
}
