import axios from 'axios';
import { AuthResponse, LoginData, RegisterData, Room, User, FileData, RoomDetailResponse } from '../types';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Токен в интерцепторе:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Заголовки запроса:', config.headers);
  }
  return config;
});

// Интерцептор для логирования ответов
api.interceptors.response.use(
  (response) => {
    console.log('Ответ от сервера:', response);
    return response;
  },
  (error) => {
    console.error('Ошибка в ответе:', error);
    return Promise.reject(error);
  }
);

// Аутентификация
export const auth = {
  login: async (data: LoginData) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('grant_type', 'password');
    formData.append('scope', '');
    formData.append('client_id', '');
    formData.append('client_secret', '');
    
    return api.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  register: (data: RegisterData) => api.post('/register', data),
  getCurrentUser: () => api.get<User>('/users/me'),
};

// Работа с комнатами
export const rooms = {
  getAll: () => api.get<Room[]>('/room/'),
  getById: (id: number) => api.get<Room>(`/room/${id}`),
  create: (data: Partial<Room>) => api.post<Room>('/room/create', data),
  update: (id: number, data: Partial<Room>) => api.put<Room>(`/room/${id}`, data),
  delete: (id: number) => api.delete(`/room/${id}`),
  addUser: async (roomId: number, username: string) => {
    const response = await api.put(`/room/add_user`, { username, room_id: roomId });
    return response.data;
  },
  removeUser: (roomId: number, userId: number) => api.put('/room/remove_user', { user_id: userId, room_id: roomId }),
};

// Работа с файлами
export const files = {
  getAll: (roomId: number) => {
    console.log('Получение файлов для комнаты:', roomId);
    return api.get<RoomDetailResponse>(`/room/${roomId}/files`);
  },
  upload: (roomId: number, file: File) => {
    console.log('Загрузка файла в комнату:', roomId, file);
    const formData = new FormData();
    formData.append('file', file as unknown as Blob);
    formData.append('room_id', roomId.toString());
    return api.post<FileData>('/room/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (roomId: number, fileId: number) => api.delete(`/room/${roomId}/files/${fileId}`),
  download: (roomId: number, fileId: number) => 
    api.get(`/room/download/${fileId}`, {
      responseType: 'blob',
      headers: {
        'Accept': '*/*',
      },
      transformResponse: [(data) => data],
      validateStatus: (status) => status === 200,
    }),
}; 