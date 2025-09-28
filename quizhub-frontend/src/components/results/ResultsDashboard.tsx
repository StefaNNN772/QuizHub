import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import { getUserResults } from '../../api/quizService';
import { Result } from '../../types/models';
import ResultsChart from './ResultsChart';
import ResultsTable from './ResultsTable';

const ResultsDashboard: React.FC = () => {
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

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>My Quiz Results</Typography>

      {results.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <ResultsChart results={results} />
        </Paper>
      )}

      <ResultsTable results={results} />
    </Box>
  );
};

export default ResultsDashboard;
