import axios from 'axios';
import { AuthResponse, Room, FileData } from '../types';

export const api = axios.create({
  baseURL: 'https://cloudanypython.onrender.com',
  withCredentials: true,
});

// Интерцептор для добавления токена к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      console.log('Unauthorized, redirecting to login...');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Аутентификация
export const auth = {
  login: async (data: { username: string; password: string }) => {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await api.post<AuthResponse>('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    
    return response;
  },
  register: (data: { username: string; email: string; password: string }) => {
    return api.post('/register', data);
  },
  getCurrentUser: () => {
    return api.get('/users/me');
  },
};

// Работа с комнатами
export const rooms = {
  getAll: () => api.get<Room[]>('/room/'),
  getById: (id: number) => api.get<Room>(`/room/${id}`),
  create: (data: Partial<Room>) => api.post<Room>('/room/create', data),
  update: (id: number, data: Partial<Room>) => api.put<Room>(`/room/${id}`, data),
  delete: (id: number) => api.delete(`/room/${id}`),
  addUser: async (roomId: number, email: string) => {
    const response = await api.put(`/room/add_user`, { email, room_id: roomId });
    return response.data;
  },
  removeUser: (roomId: number, userId: number) => api.put('/room/remove_user', { user_id: userId, room_id: roomId }),
};

// Работа с файлами
export const files = {
  getAll: (roomId: number) => api.get<Room>(`/room/${roomId}/files`),
  upload: (roomId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('room_id', roomId.toString());
    return api.post<FileData>('/room/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (roomId: number, fileId: number) => api.delete(`/room/${roomId}/files/${fileId}`),
  download: (_roomId: number, fileId: number) => 
    api.get(`/room/download/${fileId}`, {
      responseType: 'blob',
      headers: {
        'Accept': '*/*',
      },
    }),
}; 