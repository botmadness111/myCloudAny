import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { RoomList } from '../components/RoomList';
import { rooms } from '../services/api';
import { Room } from '../types';

export const RoomsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: roomsData, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      console.log('Запрос списка комнат...');
      const response = await rooms.getAll();
      console.log('Ответ от сервера:', response);
      return response.data.map((room: Room) => ({
        ...room,
        description: room.description || '',
      }));
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Загрузка комнат...</Typography>
      </Box>
    );
  }

  if (error) {
    console.error('Ошибка при загрузке комнат:', error);
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Ошибка при загрузке комнат: {error instanceof Error ? error.message : 'Неизвестная ошибка'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
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
      {roomsData && roomsData.length > 0 ? (
        <RoomList
          rooms={roomsData}
          onRoomClick={(roomId) => navigate(`/room/${roomId}`)}
        />
      ) : (
        <Alert severity="info">
          У вас пока нет комнат. Создайте новую комнату, нажав на кнопку выше.
        </Alert>
      )}
    </Box>
  );
}; 