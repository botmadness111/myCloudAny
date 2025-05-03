import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { rooms } from '../services/api';
import { Room } from '../types';

export const CreateRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Room>>({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Отправка данных для создания комнаты:', formData);
      await rooms.create(formData);
      navigate('/rooms');
    } catch (err) {
      console.error('Ошибка при создании комнаты:', err);
      setError('Ошибка при создании комнаты');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Создание новой комнаты
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Название комнаты"
            name="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Описание"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/rooms')}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              Создать
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}; 