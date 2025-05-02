# Cloudany

Облачное хранилище файлов с возможностью создания комнат и совместного доступа к файлам.

## Технологии

- **Backend**: Python 3.11, FastAPI, SQLAlchemy, Alembic
- **База данных**: PostgreSQL
- **Аутентификация**: JWT Tokens
- **Контейнеризация**: Docker, Docker Compose

## Запуск проекта

### Локальный запуск

1. Установить зависимости:
   ```bash
   pip install -r requirements.txt
   ```

2. Применить миграции:
   ```bash
   alembic upgrade head
   ```

3. Запустить сервер разработки:
   ```bash
   uvicorn app.main:app --reload
   ```

### Запуск через Docker Compose

```bash
docker-compose up -d
```

## API Документация

После запуска приложения, документация API доступна по адресу:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Основные эндпоинты

### Аутентификация

- `POST /register` - Регистрация нового пользователя
- `POST /token` - Получение JWT токена

### Пользователи

- `GET /users/me` - Информация о текущем пользователе
- `GET /users/{user_id}` - Информация о пользователе по ID
- `GET /users/` - Список всех пользователей

### Комнаты

- `GET /room/{room_id}` - Информация о комнате
- `GET /room/{room_id}/files` - Файлы в комнате
- `GET /room/{room_id}/users` - Пользователи в комнате
- `GET /room/` - Список комнат текущего пользователя
- `POST /room/create` - Создание новой комнаты
- `PUT /room/add_user` - Добавление пользователя в комнату
- `PUT /room/remove_user` - Удаление пользователя из комнаты
- `POST /room/upload` - Загрузка файла в комнату
- `GET /room/download/{file_id}` - Скачивание файла

### Файлы

- `GET /files/{file_id}` - Информация о файле
- `GET /files/` - Список файлов текущего пользователя
- `DELETE /files/{file_id}` - Удаление файла 