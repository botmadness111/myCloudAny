package ru.a.project.exception.handler;

import com.sun.net.httpserver.HttpsServer;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import ru.a.project.exception.room.CreateRoomException;
import ru.a.project.exception.room.UserAlreadyExistsInRoomException;
import ru.a.project.exception.room.UserNotFoundException;

@ControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(CreateRoomException.class)
    protected ResponseEntity<CommonException> handleCreateRoomException() {
        return new ResponseEntity<>(new CommonException("Ошибка при создании комнаты."), HttpStatus.NOT_FOUND);
    }

//    @ExceptionHandler(Exception.class)
//    protected ResponseEntity<CommonException> handleException() {
//        System.out.println("EXCEPTION");
//        return new ResponseEntity<>(new CommonException("Произошла ошибка."), HttpStatus.NOT_FOUND);
//    }

    @ExceptionHandler(UserAlreadyExistsInRoomException.class)
    protected ResponseEntity<CommonException> handleUserAlreadyExistsInRoomException() {
        return new ResponseEntity<>(new CommonException("Пользователь уже находится в комнате"), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFoundException.class)
    protected ResponseEntity<CommonException> handleUserNotFoundException() {
        return new ResponseEntity<>(new CommonException("Пользователь не найден"), HttpStatus.BAD_REQUEST);
    }
    @Data
    @AllArgsConstructor
    public static class CommonException {
        private String error;
    }
}
