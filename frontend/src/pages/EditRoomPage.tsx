import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { rooms } from '../services/api';
import { Room } from '../types';

export const EditRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Partial<Room>>({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        if (id) {
          const response = await rooms.getById(Number(id));
          setFormData(response.data);
        }
      } catch (err) {
        console.error('Ошибка при загрузке комнаты:', err);
        setError('Ошибка при загрузке комнаты');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        console.log('Отправка данных для обновления комнаты:', formData);
        await rooms.update(Number(id), formData);
        navigate('/rooms');
      }
    } catch (err) {
      console.error('Ошибка при обновлении комнаты:', err);
      setError('Ошибка при обновлении комнаты');
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

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
          Редактирование комнаты
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
              Сохранить
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}; 