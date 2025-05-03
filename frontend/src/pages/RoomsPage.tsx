import React, { useEffect } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { RoomList } from '../components/RoomList';
import { rooms, auth } from '../services/api';

export const RoomsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => auth.getCurrentUser().then(response => response.data),
  });

  const { data: roomsData, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return [];
      }

      console.log('Токен:', token);
      try {
        const response = await rooms.getAll();
        console.log('Ответ от сервера:', response);
        if (!response.data) {
          console.log('Нет данных в ответе');
          return [];
        }
        return response.data;
      } catch (err) {
        console.error('Ошибка при запросе:', err);
        if ((err as any)?.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        throw err;
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => rooms.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту комнату?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (roomId: number) => {
    navigate(`/rooms/${roomId}/edit`);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    console.error('Ошибка в компоненте:', error);
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Ошибка при загрузке комнат
        </Typography>
        <Typography color="text.secondary">
          Пожалуйста, попробуйте перезагрузить страницу
        </Typography>
      </Box>
    );
  }

  console.log('Данные комнат:', roomsData);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Комнаты</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/rooms/create')}
        >
          Создать комнату
        </Button>
      </Box>
      {Array.isArray(roomsData) && roomsData.length > 0 ? (
        <RoomList
          rooms={roomsData}
          onDelete={handleDelete}
          onEdit={handleEdit}
          currentUserId={currentUser?.id}
        />
      ) : (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            У вас пока нет комнат
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/rooms/create')}
            sx={{ mt: 2 }}
          >
            Создать первую комнату
          </Button>
        </Box>
      )}
    </Box>
  );
}; 