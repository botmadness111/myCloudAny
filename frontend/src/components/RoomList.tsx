import React from 'react';
import {
  Box,
  IconButton,
  Grow,
  Chip,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Room } from '../types';

interface RoomListProps {
  rooms: Room[];
  onRoomClick?: (roomId: number) => void;
  onEdit?: (room: Room) => void;
  onAddUser?: (room: Room) => void;
  showControls?: boolean;
}

export const RoomList: React.FC<RoomListProps> = ({ 
  rooms, 
  onRoomClick,
  onEdit,
  onAddUser,
  showControls = true
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (roomId: number) => api.delete(`/room/${roomId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  const handleRoomClick = (roomId: number) => {
    if (onRoomClick) {
      onRoomClick(roomId);
    } else {
      navigate(`/room/${roomId}`);
    }
  };

  const handleEdit = (e: React.MouseEvent, room: Room) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(room);
    } else {
      navigate(`/rooms/edit/${room.id}`);
    }
  };

  const handleAddUser = (e: React.MouseEvent, room: Room) => {
    e.stopPropagation();
    if (onAddUser) {
      onAddUser(room);
    }
  };

  const handleDelete = (e: React.MouseEvent, roomId: number) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить эту комнату?')) {
      deleteMutation.mutate(roomId);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {rooms.map((room, index) => (
        <Grow in={true} timeout={500} key={room.id} style={{ transitionDelay: `${index * 100}ms` }}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.01)',
                boxShadow: 3,
              },
            }}
            onClick={() => handleRoomClick(room.id)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" component="div">
                    {room.name}
                  </Typography>
                  <Chip
                    icon={<PeopleIcon />}
                    label={`${room.users?.length || 0} участников`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                {showControls && (
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(e, room);
                      }}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddUser(e, room);
                      }}
                    >
                      <PersonAddIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(e, room.id);
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {room.description || 'Нет описания'}
              </Typography>
            </CardContent>
          </Card>
        </Grow>
      ))}
    </Box>
  );
}; 