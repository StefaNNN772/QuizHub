import React from 'react';
import { Grid, Card, CardContent, CardActions, Typography, Button, Container } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  isAuthenticated: boolean;
}

const FeaturesSection: React.FC<Props> = ({ isAuthenticated }) => {
  const features = [
    {
      icon: <QuizIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />,
      title: 'Diverse Quizzes',
      description: 'Take quizzes on various topics with different difficulty levels. Answer multiple-choice, true/false, and fill-in-the-blank questions.',
      link: '/dashboard',
      buttonText: 'Browse Quizzes',
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />,
      title: 'Leaderboards',
      description: "Compare your scores with other users. See who's the best in each quiz and try to reach the top of the leaderboard.",
      link: '/leaderboard',
      buttonText: 'View Leaderboard',
    },
    {
      icon: <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />,
      title: 'Track Progress',
      description: 'View your quiz history and track your progress over time. See detailed results and areas for improvement.',
      link: '/results',
      buttonText: 'My Results',
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mb: 6 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        Key Features
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item xs={12} md={4} key={feature.title}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                {feature.icon}
                <Typography variant="h5" component="h3" gutterBottom>{feature.title}</Typography>
                <Typography variant="body1" color="text.secondary">{feature.description}</Typography>
              </CardContent>
              {isAuthenticated && (
                <CardActions>
                  <Button size="small" component={RouterLink} to={feature.link} fullWidth>
                    {feature.buttonText}
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeaturesSection;
