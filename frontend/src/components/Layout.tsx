import React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatedButton } from './AnimatedButton';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cloudany
          </Typography>
          {isAuthenticated && (
            <>
              <Button color="inherit" onClick={() => navigate('/rooms')}>
                Комнаты
              </Button>
              <Button color="inherit" onClick={() => navigate('/profile')}>
                Профиль
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
    </Box>
  );
}; 