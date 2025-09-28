import React from 'react';
import { 
  Box, Grid, Paper, Typography, CircularProgress, Divider,
  List, ListItem, ListItemText, Avatar, Card, CardContent
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Quiz, Result } from '../../types/models';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface AdminDashboardProps {
  quizzes: Quiz[];
  results: Result[];
  loading: boolean;
}

const AdminDashboardComponent: React.FC<AdminDashboardProps> = ({ quizzes, results, loading }) => {

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Unique users
  const userMap = new Map();
  results.forEach(result => result.user && userMap.set(result.user.id, result.user));
  const uniqueUsers = Array.from(userMap.values());

  // Recent results
  const recentResults = [...results]
    .sort((a, b) => new Date(b.dateOfPlay).getTime() - new Date(a.dateOfPlay).getTime())
    .slice(0, 5);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <DashboardCard icon={<QuizIcon />} label="Total Quizzes" value={quizzes.length} />
        <DashboardCard icon={<PeopleIcon />} label="Active Users" value={uniqueUsers.length} />
        <DashboardCard icon={<AssessmentIcon />} label="Quiz Completions" value={results.length} />
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
                            <Avatar src={`${API_BASE_URL}${result.user?.profileImage}`} sx={{ width: 24, height: 24 }} />
                            <Typography variant="body1">{result.user?.username}</Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {result.quiz?.title} - {formatDate(result.dateOfPlay)}
                            </Typography>
                            <Typography variant="body2" component="span" sx={{ ml: 1, fontWeight: 'bold' }}>
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
                  <ListItemText primary="Most Popular Quiz" secondary={getMostPopularQuiz(results, quizzes)} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Highest Scoring Quiz" secondary={getHighestScoringQuiz(results, quizzes)} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Lowest Scoring Quiz" secondary={getLowestScoringQuiz(results, quizzes)} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Dashboard card
const DashboardCard: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
  <Grid item xs={12} md={4}>
    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      {icon}
      <Typography variant="h4" component="div" sx={{ mb: 1 }}>{value}</Typography>
      <Typography variant="body1" color="text.secondary">{label}</Typography>
    </Paper>
  </Grid>
);

// Stats helper functions
const getMostPopularQuiz = (results: Result[], quizzes: Quiz[]): string => {
  if (results.length === 0) return "No data available";
  const quizCounts = results.reduce((acc, r) => { acc[r.quizId] = (acc[r.quizId] || 0) + 1; return acc; }, {} as Record<number, number>);
  const mostPopularId = parseInt(Object.entries(quizCounts).sort((a,b)=>b[1]-a[1])[0][0]);
  const quiz = quizzes.find(q=>q.id===mostPopularId);
  return quiz ? `${quiz.title} (${quizCounts[mostPopularId]} completions)` : "Unknown";
};
const getHighestScoringQuiz = (results: Result[], quizzes: Quiz[]): string => {
  if (results.length===0) return "No data available";
  const quizScores = results.reduce((acc,r)=>{ if(!acc[r.quizId]) acc[r.quizId]={total:0,count:0}; acc[r.quizId].total+=(r.points/r.maxPoints)*100; acc[r.quizId].count+=1; return acc; }, {} as Record<number,{total:number,count:number}>);
  const avgScores = Object.entries(quizScores).map(([quizId,data])=>({quizId:parseInt(quizId),average:data.total/data.count}));
  const highest = avgScores.sort((a,b)=>b.average-a.average)[0];
  const quiz = quizzes.find(q=>q.id===highest.quizId);
  return quiz ? `${quiz.title} (${Math.round(highest.average)}% avg)` : "Unknown";
};
const getLowestScoringQuiz = (results: Result[], quizzes: Quiz[]): string => {
  if (results.length===0) return "No data available";
  const quizScores = results.reduce((acc,r)=>{ if(!acc[r.quizId]) acc[r.quizId]={total:0,count:0}; acc[r.quizId].total+=(r.points/r.maxPoints)*100; acc[r.quizId].count+=1; return acc; }, {} as Record<number,{total:number,count:number}>);
  const avgScores = Object.entries(quizScores).map(([quizId,data])=>({quizId:parseInt(quizId),average:data.total/data.count}));
  const lowest = avgScores.sort((a,b)=>a.average-b.average)[0];
  const quiz = quizzes.find(q=>q.id===lowest.quizId);
  return quiz ? `${quiz.title} (${Math.round(lowest.average)}% avg)` : "Unknown";
};

export default AdminDashboardComponent;
