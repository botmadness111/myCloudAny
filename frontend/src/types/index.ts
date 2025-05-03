export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Room {
  id: number;
  name: string;
  description?: string;
  admin_id: number;
  admin: User;
  users: User[];
}

export interface RoomDetailResponse extends Room {
  files: FileData[];
}

export interface FileData {
  id: number;
  name: string;
  description?: string;
  size: number;
  type_id: number;
  user_id: number;
  room_id: number;
  user: User;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
} 