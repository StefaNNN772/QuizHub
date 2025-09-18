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
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getUserResults } from '../api/quizService';
import { Result } from '../types/models';

const ResultsPage: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserResults();
        setResults(data);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load your results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const calculatePercentage = (points: number, maxPoints: number) => {
    return maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Quiz Results
      </Typography>

      {results.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="subtitle2">Quiz</Typography></TableCell>
                <TableCell align="center"><Typography variant="subtitle2">Date</Typography></TableCell>
                <TableCell align="center"><Typography variant="subtitle2">Score</Typography></TableCell>
                <TableCell align="center"><Typography variant="subtitle2">Percentage</Typography></TableCell>
                <TableCell align="right"><Typography variant="subtitle2">Actions</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result) => {
                const percentage = calculatePercentage(result.points, result.maxPoints);
                
                return (
                  <TableRow key={result.id}>
                    <TableCell component="th" scope="row">
                      <Typography variant="body1">{result.quiz?.title}</Typography>
                    </TableCell>
                    <TableCell align="center">{formatDate(result.dateOfPlay)}</TableCell>
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
                    <TableCell align="right">
                      <Button 
                        size="small" 
                        variant="outlined"
                        component={RouterLink}
                        to={`/quiz/${result.quizId}/result`}
                        state={{ result }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You haven't completed any quizzes yet.
          </Typography>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/dashboard"
          >
            Browse Quizzes
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ResultsPage;