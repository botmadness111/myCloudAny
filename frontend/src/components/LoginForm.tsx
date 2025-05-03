import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import { LoginData } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Отправка данных для входа:', formData);
      const response = await auth.login(formData);
      console.log('Ответ от сервера:', response.data);
      await login(response.data.access_token);
      navigate('/rooms');
    } catch (err: any) {
      console.error('Ошибка при входе:', err);
      if (err.response) {
        console.error('Детали ошибки:', err.response.data);
        setError(err.response.data.detail || 'Ошибка при входе в систему');
      } else {
        setError('Не удалось подключиться к серверу');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Вход в систему
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Имя пользователя"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/register')}
          >
            Нет аккаунта? Зарегистрироваться
          </Button>
        </Box>
      </Box>
    </Container>
  );
}; 