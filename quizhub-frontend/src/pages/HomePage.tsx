import React from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Container,
  Paper
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import QuizIcon from '@mui/icons-material/Quiz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
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
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                }
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
                sx={{ 
                  mr: 2,
                  bgcolor: 'white', 
                  color: '#1769aa',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              >
                Login
              </Button>
              <Button 
                variant="outlined" 
                component={RouterLink} 
                to="/register" 
                size="large"
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.9)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Key Features
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <QuizIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Diverse Quizzes
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Take quizzes on various topics with different difficulty levels. Answer multiple-choice, true/false, and fill-in-the-blank questions.
                </Typography>
              </CardContent>
              {isAuthenticated && (
                <CardActions>
                  <Button 
                    size="small" 
                    component={RouterLink} 
                    to="/dashboard"
                    fullWidth
                  >
                    Browse Quizzes
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <EmojiEventsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Leaderboards
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Compare your scores with other users. See who's the best in each quiz and try to reach the top of the leaderboard.
                </Typography>
              </CardContent>
              {isAuthenticated && (
                <CardActions>
                  <Button 
                    size="small" 
                    component={RouterLink} 
                    to="/leaderboard"
                    fullWidth
                  >
                    View Leaderboard
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Track Progress
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  View your quiz history and track your progress over time. See detailed results and areas for improvement.
                </Typography>
              </CardContent>
              {isAuthenticated && (
                <CardActions>
                  <Button 
                    size="small" 
                    component={RouterLink} 
                    to="/results"
                    fullWidth
                  >
                    My Results
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;