import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Room } from '../types';
import { InviteUserDialog } from './InviteUserDialog';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AnimatedButton } from './AnimatedButton';

interface RoomListProps {
  rooms: Room[];
  onDelete: (roomId: number) => void;
  onEdit: (roomId: number) => void;
  currentUserId?: number;
}

export const RoomList: React.FC<RoomListProps> = ({ rooms, onDelete, onEdit, currentUserId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const personalRooms = rooms.filter(room => room.admin_id === currentUserId);
  const invitedRooms = rooms.filter(room => room.admin_id !== currentUserId);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleInviteClick = (room: Room) => {
    setSelectedRoom(room);
    setIsInviteDialogOpen(true);
  };

  const handleInviteSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['rooms'] });
    setIsInviteDialogOpen(false);
  };

  const renderRoomCard = (room: Room) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {room.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {room.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Участников: {room.users?.length || 0}
          </Typography>
        </CardContent>
        <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
          <AnimatedButton
            variant="contained"
            color="primary"
            onClick={() => navigate(`/rooms/${room.id}`)}
          >
            Открыть
          </AnimatedButton>
          {room.admin_id === currentUserId && (
            <>
              <AnimatedButton
                isIconButton
                tooltip="Пригласить пользователя"
                onClick={() => handleInviteClick(room)}
              >
                <PersonAddIcon />
              </AnimatedButton>
              <AnimatedButton
                isIconButton
                tooltip="Редактировать"
                onClick={() => onEdit(room.id)}
              >
                <EditIcon />
              </AnimatedButton>
              <AnimatedButton
                isIconButton
                tooltip="Удалить"
                color="error"
                onClick={() => onDelete(room.id)}
              >
                <DeleteIcon />
              </AnimatedButton>
            </>
          )}
        </Box>
      </Card>
    </motion.div>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Мои комнаты" />
          <Tab label="Приглашения" />
        </Tabs>
      </Paper>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
        width: '100%'
      }}>
        {(activeTab === 0 ? personalRooms : invitedRooms).map((room) => (
          <Box key={room.id}>
            {renderRoomCard(room)}
          </Box>
        ))}
      </Box>
      {selectedRoom && (
        <InviteUserDialog
          open={isInviteDialogOpen}
          onClose={() => setIsInviteDialogOpen(false)}
          roomId={selectedRoom.id}
          onSuccess={handleInviteSuccess}
        />
      )}
    </Box>
  );
}; 