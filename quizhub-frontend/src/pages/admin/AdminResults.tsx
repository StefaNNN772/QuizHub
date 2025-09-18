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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getAllResults, getQuizzes } from '../../api/quizService';
import { Result, Quiz } from '../../types/models';

const AdminResults: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [resultsData, quizzesData] = await Promise.all([
          getAllResults(),
          getQuizzes()
        ]);
        setResults(resultsData);
        setQuizzes(quizzesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load results data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenDetailDialog = (result: Result) => {
    setSelectedResult(result);
    setDetailDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const filterResults = () => {
    let filteredResults = [...results];
    
    // Filter by search term (username)
    if (searchTerm) {
      filteredResults = filteredResults.filter(result => 
        result.user?.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by quiz
    if (selectedQuiz) {
      filteredResults = filteredResults.filter(result => 
        result.quizId === parseInt(selectedQuiz)
      );
    }
    
    // Filter by time period
    if (timePeriod) {
      const now = new Date();
      const startDate = new Date();
      
      if (timePeriod === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (timePeriod === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (timePeriod === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      }
      
      filteredResults = filteredResults.filter(result => 
        new Date(result.dateOfPlay) >= startDate
      );
    }
    
    return filteredResults;
  };

  const calculatePercentage = (points: number, maxPoints: number) => {
    return maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedQuiz('');
    setTimePeriod('');
  };

  const filteredResults = filterResults();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Results
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Filters
          </Typography>
          <Box>
            <Button 
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ mr: 1 }}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            {showFilters && (
              <Button 
                variant="outlined" 
                size="small" 
                onClick={resetFilters}
              >
                Reset
              </Button>
            )}
          </Box>
        </Box>
        
        {showFilters && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search by Username"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Quiz</InputLabel>
                <Select
                  value={selectedQuiz}
                  label="Quiz"
                  onChange={(e) => setSelectedQuiz(e.target.value as string)}
                >
                  <MenuItem value="">All Quizzes</MenuItem>
                  {quizzes.map(quiz => (
                    <MenuItem key={quiz.id} value={quiz.id.toString()}>
                      {quiz.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Time Period</InputLabel>
                <Select
                  value={timePeriod}
                  label="Time Period"
                  onChange={(e) => setTimePeriod(e.target.value as string)}
                >
                  <MenuItem value="">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">Last Week</MenuItem>
                  <MenuItem value="month">Last Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredResults.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Quiz</TableCell>
                <TableCell align="center">Score</TableCell>
                <TableCell align="center">Percentage</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredResults.map((result) => {
                const percentage = calculatePercentage(result.points, result.maxPoints);
                return (
                  <TableRow key={result.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          src={result.user?.profileImage} 
                          alt={result.user?.username}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography>{result.user?.username}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{result.quiz?.title}</TableCell>
                    <TableCell align="center">
                      {result.points} / {result.maxPoints}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={`${percentage}%`}
                        color={percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(result.dateOfPlay)}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDetailDialog(result)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No results found matching your criteria.
          </Typography>
        </Paper>
      )}

      {/* Result Detail Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Result Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedResult && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  User Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Avatar 
                    src={selectedResult.user?.profileImage} 
                    alt={selectedResult.user?.username}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Typography>{selectedResult.user?.username}</Typography>
                </Box>
                <Typography variant="body2" gutterBottom>
                  <strong>Email:</strong> {selectedResult.user?.email}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Quiz Information
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Quiz:</strong> {selectedResult.quiz?.title}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Difficulty:</strong> {selectedResult.quiz?.difficulty}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Time Limit:</strong> {selectedResult.quiz?.time} minutes
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mt: 1 }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Score Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" color="primary.main">
                          {selectedResult.points}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Points Earned
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" color="text.secondary">
                          {selectedResult.maxPoints}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Maximum Points
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography 
                          variant="h4" 
                          color={
                            calculatePercentage(selectedResult.points, selectedResult.maxPoints) >= 70 ? 'success.main' : 
                            calculatePercentage(selectedResult.points, selectedResult.maxPoints) >= 50 ? 'warning.main' : 
                            'error.main'
                          }
                        >
                          {calculatePercentage(selectedResult.points, selectedResult.maxPoints)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Percentage
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  <strong>Date Completed:</strong> {formatDate(selectedResult.dateOfPlay)}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminResults;