import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import { login } from '../api/authService';

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    try {
      setError(null);
      const response = await login(username, password);
      authLogin(response.token, response.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 8,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <LoginForm onLogin={handleLogin} />
      </Paper>
    </Box>
  );
};

export default LoginPage;
