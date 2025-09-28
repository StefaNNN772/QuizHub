import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, CircularProgress, List, ListItem, ListItemText, Button, Alert } from '@mui/material';
import { getQuizById, getQuestions, getAnswers, getUserAnswers } from '../../api/quizService';
import { Result, Quiz, Question, Answer, UserAnswer } from '../../types/models';
import QuestionResultCard from './QuestionResultCard';
import ScoreCircle from './ScoreCircle';

const QuizResultContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState<Result | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answersMap, setAnswersMap] = useState<Map<number, Answer[]>>(new Map());
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);

        if (location.state?.result) {
          setResult(location.state.result);
          const ua = await getUserAnswers(location.state.result.id);
          setUserAnswers(ua);
        }

        const quizData = await getQuizById(parseInt(id));
        setQuiz(quizData);

        const questionsData = await getQuestions(parseInt(id));
        setQuestions(questionsData);

        const answersMapData = new Map<number, Answer[]>();
        await Promise.all(
          questionsData.map(async q => {
            const answers = await getAnswers(q.id);
            answersMapData.set(q.id, answers);
          })
        );
        setAnswersMap(answersMapData);

      } catch (err) {
        console.error('Error fetching quiz result data:', err);
        setError('Failed to load quiz results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, location.state]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}><CircularProgress /></Box>;
  if (error) return (
    <Box sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
      <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>Back to Dashboard</Button>
    </Box>
  );
  if (!quiz || !result) return (
    <Box sx={{ mt: 4 }}>
      <Alert severity="warning">Quiz result not found.</Alert>
      <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>Back to Dashboard</Button>
    </Box>
  );

  const percentage = (result.points / result.maxPoints) * 100;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Quiz Results: {quiz.title}</Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ScoreCircle percentage={percentage} />
          </Grid>
          <Grid item xs={12} md={8}>
            <List dense>
              <ListItem>
                <ListItemText primary="Points" secondary={`${result.points} / ${result.maxPoints}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Date Completed" secondary={new Date(result.dateOfPlay).toLocaleString()} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Difficulty" secondary={quiz.difficulty} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" gutterBottom>Question Breakdown</Typography>

      {questions.map((question, index) => (
        <QuestionResultCard 
          key={question.id} 
          question={question} 
          index={index} 
          answers={answersMap.get(question.id) || []} 
          userAnswers={userAnswers.filter(ua => ua.questionId === question.id)} 
        />
      ))}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>Go to Dashboard</Button>
        <Button variant="outlined" onClick={() => navigate('/results')}>View All Results</Button>
      </Box>
    </Box>
  );
};

export default QuizResultContent;
