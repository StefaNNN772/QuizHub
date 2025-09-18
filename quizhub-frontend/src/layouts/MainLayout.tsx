import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:5143/';

const MainLayout: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={RouterLink} to="/" style={{ textDecoration: 'none', color: 'white', flexGrow: 1 }}>
            QuizHub
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={RouterLink} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={RouterLink} to="/leaderboard">
                  Leaderboard
                </Button>
                <Button color="inherit" component={RouterLink} to="/results">
                  My Results
                </Button>
                {isAdmin && (
                  <Button color="inherit" component={RouterLink} to="/admin">
                    Admin Panel
                  </Button>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar 
                    src={`${API_BASE_URL}${user?.profileImage}`}
                    alt={user?.username}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography variant="body2">
                    {user?.username}
                  </Typography>
                </Box>
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={RouterLink} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;