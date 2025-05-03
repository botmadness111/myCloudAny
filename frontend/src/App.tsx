import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Layout } from './components/Layout';
import { LoginForm } from './components/LoginForm';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { RoomsPage } from './pages/RoomsPage';
import { RoomPage } from './pages/RoomPage';
import { CreateRoomPage } from './pages/CreateRoomPage';
import { EditRoomPage } from './pages/EditRoomPage';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log('PrivateRoute: isAuthenticated =', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('Перенаправление на /login');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  console.log('App: Rendering...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Outlet />
                    </Layout>
                  </PrivateRoute>
                }
              >
                <Route index element={<Navigate to="/rooms" replace />} />
                <Route path="rooms" element={<RoomsPage />} />
                <Route path="rooms/create" element={<CreateRoomPage />} />
                <Route path="rooms/edit/:id" element={<EditRoomPage />} />
                <Route path="room/:id" element={<RoomPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
