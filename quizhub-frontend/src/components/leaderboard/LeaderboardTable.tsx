import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Paper,
  Chip, Box, Avatar
} from '@mui/material';
import { Result } from '../../types/models';

const API_BASE_URL = 'http://localhost:5143/';

interface Props {
  results: Result[];
  currentUserId?: number;
}

const LeaderboardTable: React.FC<Props> = ({ results, currentUserId }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculatePercentage = (points: number, maxPoints: number) => {
    return maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
  };

  return (
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
            const isCurrentUser = currentUserId === result.userId;

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
  );
};

export default LeaderboardTable;
