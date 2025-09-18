import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { router } from './router';

// A wrapper component that shows loading state during auth initialization
const AuthLoader = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <RouterProvider router={router} />;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AuthLoader />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;