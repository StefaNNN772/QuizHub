import { useState, useEffect, useCallback } from 'react';
import { Quiz, Question, QuizSession } from '../types';
import { quizAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useQuiz = (quizId: number) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [quizData, questionsData] = await Promise.all([
        quizAPI.getQuiz(quizId),
        quizAPI.getQuizQuestions(quizId)
      ]);
      
      setQuiz(quizData);
      setQuestions(questionsData);
    } catch (err: any) {
      setError(err.message || 'Greška pri učitavanju kviza');
      toast.error('Greška pri učitavanju kviza');
    } finally {
      setIsLoading(false);
    }
  };

  const startQuiz = useCallback(() => {
    if (!quiz || !questions.length) return;

    const now = Date.now();
    const newSession: QuizSession = {
      quiz,
      questions,
      startTime: now,
      endTime: now + (quiz.time * 60 * 1000),
      userAnswers: {}
    };

    setSession(newSession);
    
    // Sačuvaj sesiju u localStorage za slučaj da se stranica osveži
    localStorage.setItem(`quiz-session-${quizId}`, JSON.stringify(newSession));
  }, [quiz, questions, quizId]);

  const updateAnswer = useCallback((questionId: number, answer: string | string[]) => {
    if (!session) return;

    const updatedSession = {
      ...session,
      userAnswers: {
        ...session.userAnswers,
        [questionId]: answer
      }
    };

    setSession(updatedSession);
    localStorage.setItem(`quiz-session-${quizId}`, JSON.stringify(updatedSession));
  }, [session, quizId]);

  const submitQuiz = useCallback(async () => {
    if (!session) return null;

    try {
      const answers = Object.entries(session.userAnswers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        answerBody: Array.isArray(answer) ? answer.join(',') : answer
      }));

      const result = await quizAPI.submitQuiz(quizId, answers);
      
      // Ukloni sesiju iz localStorage
      localStorage.removeItem(`quiz-session-${quizId}`);
      setSession(null);
      
      return result;
    } catch (err: any) {
      toast.error('Greška pri slanju odgovora');
      throw err;
    }
  }, [session, quizId]);

  const getTimeLeft = useCallback(() => {
    if (!session) return 0;
    return Math.max(0, Math.floor((session.endTime - Date.now()) / 1000));
  }, [session]);

  const getProgress = useCallback(() => {
    if (!session || !questions.length) return 0;
    const answeredQuestions = Object.keys(session.userAnswers).length;
    return (answeredQuestions / questions.length) * 100;
  }, [session, questions]);

  return {
    quiz,
    questions,
    session,
    isLoading,
    error,
    startQuiz,
    updateAnswer,
    submitQuiz,
    getTimeLeft,
    getProgress
  };
};