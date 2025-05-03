import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container,
  Alert,
  CircularProgress,
  Fade,
  Grow,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rooms } from '../services/api';
import { Room } from '../types';

export const EditRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Room>>({
    name: '',
    description: '',
  });

  const { data: room, isLoading, error: fetchError } = useQuery({
    queryKey: ['room', id],
    queryFn: async () => {
      if (!id) throw new Error('ID комнаты не указан');
      const response = await rooms.getById(Number(id));
      setFormData(response.data);
      return response.data;
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Room>) => {
      if (!id) throw new Error('ID комнаты не указан');
      return rooms.update(Number(id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room', id] });
      navigate('/rooms');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (fetchError) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Ошибка при загрузке комнаты: {fetchError instanceof Error ? fetchError.message : 'Неизвестная ошибка'}
        </Alert>
      </Container>
    );
  }

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
            Редактирование комнаты
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
              error={updateMutation.isError}
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
              error={updateMutation.isError}
            />
            {updateMutation.isError && (
              <Fade in={true}>
                <Alert severity="error" sx={{ mt: 2 }}>
                  Ошибка при обновлении комнаты: {updateMutation.error instanceof Error ? updateMutation.error.message : 'Неизвестная ошибка'}
                </Alert>
              </Fade>
            )}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/rooms')}
                disabled={updateMutation.isPending}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={updateMutation.isPending}
                startIcon={updateMutation.isPending ? <CircularProgress size={20} /> : null}
              >
                {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Grow>
    </Container>
  );
}; 