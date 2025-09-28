import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Result } from '../../types/models';

interface ResultsTableProps {
  results: Result[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const calculatePercentage = (points: number, maxPoints: number) => {
    return maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
  };

  if (results.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>You haven't completed any quizzes yet.</Typography>
        <Button variant="contained" component={RouterLink} to="/dashboard">Browse Quizzes</Button>
      </Paper>
    );
  }

  return (
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
                <TableCell align="center">{result.points} / {result.maxPoints}</TableCell>
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
                  <Button size="small" variant="outlined" component={RouterLink} to={`/quiz/${result.quizId}/result`} state={{ result }}>
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultsTable;
