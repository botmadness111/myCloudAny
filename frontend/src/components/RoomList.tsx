import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Room {
  id: number;
  name: string;
  description: string;
  admin_id: number;
}

interface RoomListProps {
  rooms: Room[];
  onRoomClick?: (roomId: number) => void;
}

export const RoomList: React.FC<RoomListProps> = ({ rooms, onRoomClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRoomClick = (roomId: number) => {
    if (onRoomClick) {
      onRoomClick(roomId);
    } else {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <List>
      {rooms.map((room) => (
        <ListItem
          key={room.id}
          onClick={() => handleRoomClick(room.id)}
          sx={{ cursor: 'pointer' }}
        >
          <ListItemText
            primary={room.name}
            secondary={room.description}
          />
          <ListItemSecondaryAction>
            {room.admin_id === user?.id && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {/* Здесь можно добавить кнопки для администратора */}
              </Box>
            )}
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}; 