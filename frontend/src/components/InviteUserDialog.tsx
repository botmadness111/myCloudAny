import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { rooms } from '../services/api';

interface InviteUserDialogProps {
  open: boolean;
  onClose: () => void;
  roomId: number;
  onSuccess?: () => void;
}

export const InviteUserDialog: React.FC<InviteUserDialogProps> = ({
  open,
  onClose,
  roomId,
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleInvite = async () => {
    try {
      await rooms.addUser(roomId, username);
      setUsername('');
      setError('');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      if (err.response) {
        switch (err.response.status) {
          case 404:
            setError('Пользователь с таким именем не найден');
            break;
          case 400:
            setError('Этот пользователь уже добавлен в комнату');
            break;
          default:
            setError('Произошла ошибка при добавлении пользователя');
        }
      } else {
        setError('Не удалось подключиться к серверу');
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Пригласить пользователя</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleInvite} variant="contained" color="primary">
          Пригласить
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 