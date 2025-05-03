import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { RoomList } from '../components/RoomList';
import { rooms, auth } from '../services/api';

interface Room {
  id: number;
  name: string;
  description: string;
  admin_id: number;
}

export const RoomsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => auth.getCurrentUser().then(response => response.data),
  });

  const { data: roomsData, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await rooms.getAll();
      return response.data.map((room: Room) => ({
        ...room,
        description: room.description || '',
      }));
    },
  });

  const handleDelete = (roomId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту комнату?')) {
      rooms.delete(roomId);
    }
  };

  const handleEdit = (roomId: number) => {
    navigate(`/rooms/${roomId}/edit`);
  };

  if (isLoading) {
    return <Typography>Загрузка...</Typography>;
  }

  if (error) {
    return <Typography color="error">Ошибка при загрузке комнат</Typography>;
  }

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
      {roomsData && roomsData.length > 0 ? (
        <RoomList
          rooms={roomsData}
          onRoomClick={(roomId) => navigate(`/room/${roomId}`)}
        />
      ) : (
        <Typography>У вас пока нет комнат</Typography>
      )}
    </Box>
  );
}; 