import React, { useState, useEffect } from 'react';
import { Typography, Grid, Box, CircularProgress } from '@mui/material';
import { getQuizzes, getTopics } from '../api/quizService';
import { Quiz, DifficultyEnum, Topic } from '../types/models';
import QuizFilters from '../components/dashboard/QuizFilters';
import QuizCard from '../components/dashboard/QuizCard';

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

      <QuizFilters 
        search={search}
        setSearch={setSearch}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        topic={topic}
        setTopic={setTopic}
        topics={topics}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : quizzes.length > 0 ? (
        <Grid container spacing={3}>
          {quizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz.id}>
              <QuizCard quiz={quiz} getDifficultyColor={getDifficultyColor} />
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
