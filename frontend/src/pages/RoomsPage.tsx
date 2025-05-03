import React, { useState } from 'react';
import { Box, Typography, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab, Divider } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { RoomList } from '../components/RoomList';
import { rooms } from '../services/api';
import { Room } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const RoomsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState(0);

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

  const addUserMutation = useMutation({
    mutationFn: async ({ roomId, username }: { roomId: number; username: string }) => {
      const response = await rooms.addUser(roomId, username);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setIsAddUserDialogOpen(false);
      setUsername('');
    },
  });

  const handleEditRoom = (room: Room) => {
    navigate(`/rooms/edit/${room.id}`);
  };

  const handleAddUser = (room: Room) => {
    setSelectedRoom(room);
    setIsAddUserDialogOpen(true);
  };

  const handleAddUserSubmit = () => {
    if (selectedRoom && username) {
      addUserMutation.mutate({ roomId: selectedRoom.id, username });
    }
  };

  const handleCreateRoom = () => {
    navigate('/rooms/create');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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

  const personalRooms = roomsData?.filter(room => room.admin_id === user?.id) || [];
  const invitedRooms = roomsData?.filter(room => room.admin_id !== user?.id) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Комнаты</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateRoom}
        >
          Создать комнату
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="room tabs">
          <Tab label={`Мои комнаты (${personalRooms.length})`} />
          <Tab label={`Приглашенные комнаты (${invitedRooms.length})`} />
        </Tabs>
      </Box>

      {activeTab === 0 ? (
        personalRooms.length > 0 ? (
          <RoomList
            rooms={personalRooms}
            onRoomClick={(roomId) => navigate(`/room/${roomId}`)}
            onEdit={handleEditRoom}
            onAddUser={handleAddUser}
            showControls={true}
          />
        ) : (
          <Alert severity="info">
            У вас пока нет личных комнат. Создайте новую комнату, нажав на кнопку выше.
          </Alert>
        )
      ) : (
        invitedRooms.length > 0 ? (
          <RoomList
            rooms={invitedRooms}
            onRoomClick={(roomId) => navigate(`/room/${roomId}`)}
            onEdit={handleEditRoom}
            onAddUser={handleAddUser}
            showControls={false}
          />
        ) : (
          <Alert severity="info">
            У вас пока нет приглашенных комнат.
          </Alert>
        )
      )}

      <Dialog open={isAddUserDialogOpen} onClose={() => setIsAddUserDialogOpen(false)}>
        <DialogTitle>Добавить пользователя в комнату</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Логин пользователя"
            type="text"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={addUserMutation.isError}
            helperText={addUserMutation.isError ? 'Ошибка при добавлении пользователя' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddUserDialogOpen(false)}>Отмена</Button>
          <Button 
            onClick={handleAddUserSubmit}
            disabled={addUserMutation.isPending || !username}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 