import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Grid, 
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { getQuizById, getQuestions, getAnswers } from '../api/quizService';
import { Result, Quiz, Question, Answer } from '../types/models';

const QuizResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<Result | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answersMap, setAnswersMap] = useState<Map<number, Answer[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Check if result was passed via location state
        if (location.state?.result) {
          setResult(location.state.result);
        }
        
        // Fetch quiz details
        const quizData = await getQuizById(parseInt(id));
        setQuiz(quizData);
        
        // Fetch questions
        const questionsData = await getQuestions(parseInt(id));
        setQuestions(questionsData);
        
        // Fetch answers for each question
        const answersMapData = new Map<number, Answer[]>();
        await Promise.all(
          questionsData.map(async (question) => {
            const answers = await getAnswers(question.id);
            answersMapData.set(question.id, answers);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/dashboard')} 
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  if (!quiz || !result) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="warning">Quiz result not found.</Alert>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/dashboard')} 
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const percentage = (result.points / result.maxPoints) * 100;
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Quiz Results: {quiz.title}
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box 
                sx={{ 
                  position: 'relative', 
                  display: 'inline-flex',
                  mb: 2
                }}
              >
                <CircularProgress 
                  variant="determinate" 
                  value={percentage} 
                  size={120}
                  thickness={5}
                  color={percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'error'}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5" component="div" color="text.secondary">
                    {Math.round(percentage)}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Your Score
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Points" 
                  secondary={`${result.points} / ${result.maxPoints}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Date Completed" 
                  secondary={new Date(result.dateOfPlay).toLocaleString()}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Difficulty" 
                  secondary={quiz.difficulty}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        Question Breakdown
      </Typography>
      
      {questions.map((question, index) => {
        const answers = answersMap.get(question.id) || [];
        const correctAnswers = answers.filter(a => a.isTrue);
        
        return (
          <Card key={question.id} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                  {index + 1}.
                </Typography>
                <Typography variant="body1">
                  {question.body}
                </Typography>
              </Box>
              
              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
                {question.points} points
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Correct Answer:
              </Typography>
              
              <Box sx={{ pl: 2, mb: 2 }}>
                {correctAnswers.map(answer => (
                  <Box key={answer.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleIcon color="success" sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">
                      {answer.answerBody}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        );
      })}
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/dashboard')} 
          sx={{ mr: 2 }}
        >
          Go to Dashboard
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/results')}
        >
          View All Results
        </Button>
      </Box>
    </Box>
  );
};

export default QuizResultPage;