import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import { User } from '../types';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await auth.getCurrentUser();
        setUser(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке профиля:', err);
        setError('Ошибка при загрузке профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <Container>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Профиль пользователя
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText
              primary="Имя пользователя"
              secondary={user?.username}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Email"
              secondary={user?.email}
            />
          </ListItem>
        </List>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/rooms')}
            sx={{ mr: 2 }}
          >
            К списку комнат
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
          >
            Выйти
          </Button>
        </Box>
      </Box>
    </Container>
  );
}; 