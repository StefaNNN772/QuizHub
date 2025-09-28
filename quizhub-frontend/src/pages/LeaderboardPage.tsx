import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Alert, Paper } from '@mui/material';
import { getLeaderboard, getQuizzes } from '../api/quizService';
import { Result, Quiz } from '../types/models';
import { useAuth } from '../context/AuthContext';
import LeaderboardFilters from '../components/leaderboard/LeaderboardFilters';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';

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

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Leaderboard
      </Typography>

      <LeaderboardFilters
        quizzes={quizzes}
        selectedQuiz={selectedQuiz}
        onQuizChange={setSelectedQuiz}
        period={period}
        onPeriodChange={setPeriod}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : results.length > 0 ? (
        <LeaderboardTable results={results} currentUserId={user?.id} />
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
