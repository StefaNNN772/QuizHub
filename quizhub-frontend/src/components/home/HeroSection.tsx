import React from 'react';
import { Box, Paper, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  isAuthenticated: boolean;
}

const HeroSection: React.FC<Props> = ({ isAuthenticated }) => {
  return (
    <Paper 
      sx={{ 
        py: 8, 
        px: 4, 
        mb: 6, 
        borderRadius: 2,
        background: 'linear-gradient(135deg, #2196f3 0%, #1769aa 100%)',
        color: 'white',
        textAlign: 'center'
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to QuizHub
        </Typography>
        <Typography variant="h6" paragraph>
          Test your knowledge with interactive quizzes from various topics and compare your results with others!
        </Typography>
        {isAuthenticated ? (
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/dashboard" 
            size="large"
            sx={{ 
              bgcolor: 'white', 
              color: '#1769aa',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
            }}
          >
            Go to Dashboard
          </Button>
        ) : (
          <Box>
            <Button 
              variant="contained" 
              component={RouterLink} 
              to="/login" 
              size="large"
              sx={{ mr: 2, bgcolor: 'white', color: '#1769aa', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' } }}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              component={RouterLink} 
              to="/register" 
              size="large"
              sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'rgba(255, 255, 255, 0.9)', bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              Register
            </Button>
          </Box>
        )}
      </Container>
    </Paper>
  );
};

export default HeroSection;
