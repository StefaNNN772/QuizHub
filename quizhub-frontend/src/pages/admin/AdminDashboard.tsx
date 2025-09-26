import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Card,
  CardContent
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { getQuizzes, getAllResults } from '../../api/quizService';
import { Quiz, Result } from '../../types/models';

const API_BASE_URL = 'http://localhost:5143/';

const AdminDashboard: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [quizzesData, resultsData] = await Promise.all([
          getQuizzes(),
          getAllResults()
        ]);
        setQuizzes(quizzesData);
        setResults(resultsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Get unique users
  const userMap = new Map();
  results.forEach(result => {
    if (result.user) {
      userMap.set(result.user.id, result.user);
    }
  });
  const uniqueUsers = Array.from(userMap.values());

  // Get recent results (last 5)
  const recentResults = [...results]
    .sort((a, b) => new Date(b.dateOfPlay).getTime() - new Date(a.dateOfPlay).getTime())
    .slice(0, 5);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              height: '100%'
            }}
          >
            <QuizIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {quizzes.length}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total Quizzes
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              height: '100%'
            }}
          >
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {uniqueUsers.length}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Active Users
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              height: '100%'
            }}
          >
            <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {results.length}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Quiz Completions
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Quiz Completions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {recentResults.length > 0 ? (
                <List>
                  {recentResults.map(result => (
                    <ListItem key={result.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar 
                              src={`${API_BASE_URL}${result.user?.profileImage}`} 
                              alt={result.user?.username}
                              sx={{ width: 24, height: 24 }}
                            />
                            <Typography variant="body1">
                              {result.user?.username}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {result.quiz?.title} - {formatDate(result.dateOfPlay)}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              component="span" 
                              sx={{ ml: 1, fontWeight: 'bold' }}
                            >
                              Score: {Math.round((result.points / result.maxPoints) * 100)}%
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No quiz completions yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quiz Statistics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Most Popular Quiz"
                    secondary={getMostPopularQuiz(results, quizzes)}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Highest Scoring Quiz"
                    secondary={getHighestScoringQuiz(results, quizzes)}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Lowest Scoring Quiz"
                    secondary={getLowestScoringQuiz(results, quizzes)}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Helper functions for quiz statistics
const getMostPopularQuiz = (results: Result[], quizzes: Quiz[]): string => {
  if (results.length === 0) return "No data available";
  
  const quizCounts = results.reduce((acc, result) => {
    acc[result.quizId] = (acc[result.quizId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const mostPopularQuizId = Object.entries(quizCounts)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  const quiz = quizzes.find(q => q.id === parseInt(mostPopularQuizId));
  return quiz ? `${quiz.title} (${quizCounts[parseInt(mostPopularQuizId)]} completions)` : "Unknown";
};

const getHighestScoringQuiz = (results: Result[], quizzes: Quiz[]): string => {
  if (results.length === 0) return "No data available";
  
  const quizScores = results.reduce((acc, result) => {
    if (!acc[result.quizId]) {
      acc[result.quizId] = { total: 0, count: 0 };
    }
    acc[result.quizId].total += (result.points / result.maxPoints) * 100;
    acc[result.quizId].count += 1;
    return acc;
  }, {} as Record<number, { total: number, count: number }>);
  
  const averageScores = Object.entries(quizScores).map(([quizId, data]) => ({
    quizId: parseInt(quizId),
    average: data.total / data.count
  }));
  
  const highestScoring = averageScores.sort((a, b) => b.average - a.average)[0];
  const quiz = quizzes.find(q => q.id === highestScoring.quizId);
  
  return quiz ? `${quiz.title} (${Math.round(highestScoring.average)}% avg)` : "Unknown";
};

const getLowestScoringQuiz = (results: Result[], quizzes: Quiz[]): string => {
  if (results.length === 0) return "No data available";
  
  const quizScores = results.reduce((acc, result) => {
    if (!acc[result.quizId]) {
      acc[result.quizId] = { total: 0, count: 0 };
    }
    acc[result.quizId].total += (result.points / result.maxPoints) * 100;
    acc[result.quizId].count += 1;
    return acc;
  }, {} as Record<number, { total: number, count: number }>);
  
  const averageScores = Object.entries(quizScores).map(([quizId, data]) => ({
    quizId: parseInt(quizId),
    average: data.total / data.count
  }));
  
  const lowestScoring = averageScores.sort((a, b) => a.average - b.average)[0];
  const quiz = quizzes.find(q => q.id === lowestScoring.quizId);
  
  return quiz ? `${quiz.title} (${Math.round(lowestScoring.average)}% avg)` : "Unknown";
};

export default AdminDashboard;