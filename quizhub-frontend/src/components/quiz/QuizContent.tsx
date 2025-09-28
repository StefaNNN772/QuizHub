import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, Box, Button, CircularProgress, LinearProgress, Paper, Alert
} from '@mui/material';
import { getQuizById, getQuestions, getAnswers, submitQuizAnswers } from '../../api/quizService';
import { Quiz, Question, Answer, QuestionType } from '../../types/models';
import QuestionCard from './QuestionCard';

const QuizContent: React.FC = () => {
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
      
      const quizData = await getQuizById(parseInt(id));
      setQuiz(quizData);
      setTimeLeft(quizData.time * 60);

      const questionsData = await getQuestions(parseInt(id));
      setQuestions(questionsData);

      const answersMapData = new Map<number, Answer[]>();
      await Promise.all(
        questionsData.map(async (question) => {
          const answers = await getAnswers(question.id);
          answersMapData.set(question.id, answers);
        })
      );
      setAnswersMap(answersMapData);

      const initialUserAnswers = new Map<number, string[]>();
      questionsData.forEach(q => initialUserAnswers.set(q.id, []));
      setUserAnswers(initialUserAnswers);

    } catch (err) {
      console.error('Error fetching quiz data:', err);
      setError('Failed to load quiz. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchQuizData(); }, [fetchQuizData]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || loading) return;
    const timer = setInterval(() => setTimeLeft(prev => prev !== null && prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0) handleSubmitQuiz();
  }, [timeLeft]);

  const handleAnswerChange = (questionId: number, value: string, isMultiple: boolean = false) => {
    setUserAnswers(prev => {
      const newMap = new Map(prev);
      if (isMultiple) {
        const current = prev.get(questionId) || [];
        newMap.set(questionId, current.includes(value) ? current.filter(a => a !== value) : [...current, value]);
      } else {
        newMap.set(questionId, [value]);
      }
      return newMap;
    });
  };

  const handleNextQuestion = () => { if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1); };
  const handlePrevQuestion = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1); };

  const handleSubmitQuiz = async () => {
    if (!id || submitting) return;
    try {
      setSubmitting(true);
      setError(null);

      const formattedAnswers = Array.from(userAnswers.entries()).map(([qid, answers]) => ({
        questionId: qid,
        answerBody: answers.join('|')
      }));

      const result = await submitQuizAnswers(parseInt(id), formattedAnswers);
      navigate(`/quiz/${id}/result`, { state: { result } });

    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}><CircularProgress /></Box>;
  if (error) return (
    <Box sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
      <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>Back to Dashboard</Button>
    </Box>
  );
  if (!quiz || questions.length === 0) return (
    <Box sx={{ mt: 4 }}>
      <Alert severity="warning">Quiz not found or has no questions.</Alert>
      <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>Back to Dashboard</Button>
    </Box>
  );

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

      <LinearProgress variant="determinate" value={(currentQuestionIndex / questions.length) * 100} sx={{ mb: 3, height: 10, borderRadius: 5 }} />

      <Typography variant="body2" sx={{ mb: 2 }}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Typography>

      <QuestionCard 
        question={currentQuestion} 
        answers={currentAnswers} 
        userAnswer={currentUserAnswer} 
        handleAnswerChange={handleAnswerChange} 
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>Previous</Button>
        {currentQuestionIndex < questions.length - 1 ? (
          <Button variant="contained" onClick={handleNextQuestion}>Next</Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSubmitQuiz} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default QuizContent;
