import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  TextField, 
  MenuItem, 
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getQuizzes } from '../api/quizService';
import { getTopics } from '../api/quizService';
import { Quiz, DifficultyEnum, Topic } from '../types/models';

const DashboardPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [quizzesData, topicsData] = await Promise.all([
          getQuizzes(search, difficulty, topic),
          getTopics()
        ]);
        setQuizzes(quizzesData);
        setTopics(topicsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, difficulty, topic]);

  const getDifficultyColor = (difficulty: DifficultyEnum) => {
    switch (difficulty) {
      case DifficultyEnum.Easy: return 'success';
      case DifficultyEnum.Medium: return 'warning';
      case DifficultyEnum.Hard: return 'error';
      default: return 'default';
    }
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Quizzes
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search Quizzes"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />
        
        <FormControl sx={{ minWidth: '150px' }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={difficulty}
            label="Difficulty"
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <MenuItem value="">All Difficulties</MenuItem>
            <MenuItem value={DifficultyEnum.Easy}>Easy</MenuItem>
            <MenuItem value={DifficultyEnum.Medium}>Medium</MenuItem>
            <MenuItem value={DifficultyEnum.Hard}>Hard</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: '150px' }}>
          <InputLabel>Topic</InputLabel>
          <Select
            value={topic}
            label="Topic"
            onChange={(e) => setTopic(e.target.value)}
          >
            <MenuItem value="">All Topics</MenuItem>
            {topics.map((t) => (
              <MenuItem key={t.id} value={t.about}>
                {t.about}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : quizzes.length > 0 ? (
        <Grid container spacing={3}>
          {quizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {quiz.title}
                  </Typography>
                  <Chip 
                    label={quiz.difficulty} 
                    color={getDifficultyColor(quiz.difficulty) as any}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {quiz.description}
                  </Typography>
                  <Typography variant="body2">
                    Time limit: {quiz.time} minutes
                  </Typography>
                  {quiz.topics && (
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {quiz.topics.map(topic => (
                        <Chip 
                          key={topic.id} 
                          label={topic.about} 
                          size="small" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component={RouterLink} 
                    to={`/quiz/${quiz.id}`}
                    variant="contained"
                    fullWidth
                  >
                    Start Quiz
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
          No quizzes found matching your criteria.
        </Typography>
      )}
    </div>
  );
};

export default DashboardPage;