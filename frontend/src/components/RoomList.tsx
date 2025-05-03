import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Box,
  IconButton,
  Tooltip,
  Fade,
  Grow,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Room } from '../types';

interface RoomListProps {
  rooms: Room[];
  onRoomClick?: (roomId: number) => void;
  onEdit?: (room: Room) => void;
  onAddUser?: (room: Room) => void;
}

export const RoomList: React.FC<RoomListProps> = ({ 
  rooms, 
  onRoomClick,
  onEdit,
  onAddUser,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (roomId: number) => api.delete(`/rooms/${roomId}`),
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
    <List>
      {rooms.map((room, index) => (
        <Grow in={true} timeout={500} key={room.id} style={{ transitionDelay: `${index * 100}ms` }}>
          <ListItem
            onClick={() => handleRoomClick(room.id)}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'scale(1.01)',
                transition: 'all 0.2s ease-in-out',
              },
              mb: 1,
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {room.name}
                  <Chip
                    icon={<PeopleIcon />}
                    label={`${room.users?.length || 0} участников`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
              secondary={room.description}
            />
            <ListItemSecondaryAction>
              {room.admin_id === user?.id && (
                <Fade in={true} timeout={500}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Редактировать комнату">
                      <IconButton
                        onClick={(e) => handleEdit(e, room)}
                        size="small"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Добавить пользователя">
                      <IconButton
                        onClick={(e) => handleAddUser(e, room)}
                        size="small"
                        color="primary"
                      >
                        <PersonAddIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить комнату">
                      <IconButton
                        onClick={(e) => handleDelete(e, room.id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Fade>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        </Grow>
      ))}
    </List>
  );
}; 