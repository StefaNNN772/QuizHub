import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Button, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  FormLabel, 
  Checkbox, 
  TextField,
  Paper,
  CircularProgress,
  LinearProgress,
  Card,
  CardContent,
  Alert,
  Divider
} from '@mui/material';
import { getQuizById, getQuestions, getAnswers, submitQuizAnswers } from '../api/quizService';
import { Quiz, Question, Answer, QuestionType } from '../types/models';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answersMap, setAnswersMap] = useState<Map<number, Answer[]>>(new Map());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<number, string[]>>(new Map());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizData = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch quiz details
      const quizData = await getQuizById(parseInt(id));
      setQuiz(quizData);
      setTimeLeft(quizData.time * 60); // Convert minutes to seconds
      
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
      
      // Initialize user answers map
      const initialUserAnswers = new Map<number, string[]>();
      questionsData.forEach(question => {
        initialUserAnswers.set(question.id, []);
      });
      setUserAnswers(initialUserAnswers);
      
    } catch (err) {
      console.error('Error fetching quiz data:', err);
      setError('Failed to load quiz. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || loading) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev !== null && prev > 0) {
          return prev - 1;
        }
        return 0;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft]);

  const handleAnswerChange = (questionId: number, value: string, isMultiple: boolean = false) => {
    setUserAnswers(prev => {
      const newMap = new Map(prev);
      if (isMultiple) {
        const currentAnswers = prev.get(questionId) || [];
        if (currentAnswers.includes(value)) {
          // Remove if already selected
          newMap.set(
            questionId, 
            currentAnswers.filter(answer => answer !== value)
          );
        } else {
          // Add if not selected
          newMap.set(
            questionId, 
            [...currentAnswers, value]
          );
        }
      } else {
        // Single answer (radio or text input)
        newMap.set(questionId, [value]);
      }
      return newMap;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!id || submitting) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Format answers for submission
      const formattedAnswers = Array.from(userAnswers.entries()).map(([questionId, answers]) => {
        return {
          questionId,
          answerBody: answers.join('|') // Join multiple answers with pipe
        };
      });
      
      // Submit answers
      const result = await submitQuizAnswers(parseInt(id), formattedAnswers);
      
      // Navigate to results page
      navigate(`/quiz/${id}/result`, { state: { result } });
      
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

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

  if (!quiz || questions.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="warning">Quiz not found or has no questions.</Alert>
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

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswers = answersMap.get(currentQuestion.id) || [];
  const currentUserAnswer = userAnswers.get(currentQuestion.id) || [];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">{quiz.title}</Typography>
        <Paper sx={{ p: 2, bgcolor: timeLeft && timeLeft < 60 ? '#fff4e5' : undefined }}>
          <Typography variant="h6" color={timeLeft && timeLeft < 60 ? 'error' : 'textPrimary'}>
            Time Left: {timeLeft !== null ? formatTime(timeLeft) : 'N/A'}
          </Typography>
        </Paper>
      </Box>

      <LinearProgress 
        variant="determinate" 
        value={(currentQuestionIndex / questions.length) * 100} 
        sx={{ mb: 3, height: 10, borderRadius: 5 }}
      />

      <Typography variant="body2" sx={{ mb: 2 }}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Typography>

      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {currentQuestion.points} points • {currentQuestion.type.replace(/([A-Z])/g, ' $1').trim()}
            </Typography>
            <Typography variant="h6" component="h2" sx={{ mt: 1 }}>
              {currentQuestion.body}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />
          
          {currentQuestion.type === QuestionType.OneAnswer && (
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Select one answer:</FormLabel>
              <RadioGroup 
                value={currentUserAnswer[0] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              >
                {currentAnswers.map(answer => (
                  <FormControlLabel 
                    key={answer.id} 
                    value={answer.answerBody} 
                    control={<Radio />} 
                    label={answer.answerBody} 
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}

          {currentQuestion.type === QuestionType.MultipleAnswer && (
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Select all correct answers:</FormLabel>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                {currentAnswers.map(answer => (
                  <FormControlLabel
                    key={answer.id}
                    control={
                      <Checkbox 
                        checked={currentUserAnswer.includes(answer.answerBody)} 
                        onChange={() => handleAnswerChange(currentQuestion.id, answer.answerBody, true)}
                      />
                    }
                    label={answer.answerBody}
                  />
                ))}
              </Box>
            </FormControl>
          )}

          {currentQuestion.type === QuestionType.TrueOrFalse && (
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Is this statement true or false?</FormLabel>
              <RadioGroup 
                value={currentUserAnswer[0] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              >
                <FormControlLabel value="True" control={<Radio />} label="True" />
                <FormControlLabel value="False" control={<Radio />} label="False" />
              </RadioGroup>
            </FormControl>
          )}

          {currentQuestion.type === QuestionType.FillInTheBlank && (
            <FormControl fullWidth>
              <FormLabel component="legend">Fill in the blank:</FormLabel>
              <TextField
                fullWidth
                value={currentUserAnswer[0] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                margin="normal"
                placeholder="Your answer..."
                variant="outlined"
              />
            </FormControl>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={handlePrevQuestion} 
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        {currentQuestionIndex < questions.length - 1 ? (
          <Button 
            variant="contained" 
            onClick={handleNextQuestion}
          >
            Next
          </Button>
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmitQuiz}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default QuizPage;