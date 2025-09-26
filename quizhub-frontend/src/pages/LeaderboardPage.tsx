import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { getLeaderboard, getQuizzes } from '../api/quizService';
import { Result, Quiz } from '../types/models';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:5143/';

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzes();
        setQuizzes(data);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const quizId = selectedQuiz ? parseInt(selectedQuiz) : undefined;
        const data = await getLeaderboard(quizId, period);
        setResults(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedQuiz, period]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculatePercentage = (points: number, maxPoints: number) => {
    return maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Leaderboard
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Quiz</InputLabel>
          <Select
            value={selectedQuiz}
            label="Quiz"
            onChange={(e) => setSelectedQuiz(e.target.value as string)}
          >
            <MenuItem value="">All Quizzes</MenuItem>
            {quizzes.map((quiz) => (
              <MenuItem key={quiz.id} value={quiz.id.toString()}>
                {quiz.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={period}
            label="Time Period"
            onChange={(e) => setPeriod(e.target.value as string)}
          >
            <MenuItem value="">All Time</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : results.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="subtitle2">Rank</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">User</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Quiz</Typography></TableCell>
                <TableCell align="center"><Typography variant="subtitle2">Score</Typography></TableCell>
                <TableCell align="center"><Typography variant="subtitle2">Percentage</Typography></TableCell>
                <TableCell align="right"><Typography variant="subtitle2">Date</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result, index) => {
                const percentage = calculatePercentage(result.points, result.maxPoints);
                const isCurrentUser = user?.id === result.userId;
                
                return (
                  <TableRow 
                    key={result.id}
                    sx={{ 
                      backgroundColor: isCurrentUser ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                    }}
                  >
                    <TableCell>
                      {index === 0 ? (
                        <Chip label="1" color="primary" size="small" />
                      ) : index === 1 ? (
                        <Chip label="2" color="secondary" size="small" />
                      ) : index === 2 ? (
                        <Chip label="3" color="warning" size="small" />
                      ) : (
                        <Typography>{index + 1}</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          src={`${API_BASE_URL}${result.user?.profileImage}`} 
                          alt={result.user?.username}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography>
                          {result.user?.username}
                          {isCurrentUser && (
                            <Chip 
                              label="You" 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{result.quiz?.title}</TableCell>
                    <TableCell align="center">
                      {result.points} / {result.maxPoints}
                    </TableCell>
                    <TableCell align="center">
                      <Typography 
                        variant="body2"
                        color={percentage >= 70 ? 'success.main' : percentage >= 50 ? 'warning.main' : 'error.main'}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {percentage}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{formatDate(result.dateOfPlay)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No results found for the selected filters.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default LeaderboardPage;