import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Alert, CircularProgress, Fade, Grow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rooms } from '../services/api';
import { Room } from '../types';

export const CreateRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Room>>({
    name: '',
    description: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Room>) => rooms.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      navigate('/rooms');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Grow in={true} timeout={500}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Создание новой комнаты
          </Typography>
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              mt: 1, 
              width: '100%',
              '& .MuiTextField-root': {
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.01)',
                },
              },
            }}
          >
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
              error={createMutation.isError}
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
              error={createMutation.isError}
            />
            {createMutation.isError && (
              <Fade in={true}>
                <Alert severity="error" sx={{ mt: 2 }}>
                  Ошибка при создании комнаты: {createMutation.error instanceof Error ? createMutation.error.message : 'Неизвестная ошибка'}
                </Alert>
              </Fade>
            )}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/rooms')}
                disabled={createMutation.isPending}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createMutation.isPending}
                startIcon={createMutation.isPending ? <CircularProgress size={20} /> : null}
              >
                {createMutation.isPending ? 'Создание...' : 'Создать'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Grow>
    </Container>
  );
}; 