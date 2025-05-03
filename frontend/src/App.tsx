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

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
              <Route path="rooms/:id" element={<RoomPage />} />
              <Route path="rooms/:id/edit" element={<EditRoomPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
