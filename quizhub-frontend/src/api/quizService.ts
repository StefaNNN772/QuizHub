import api from './axiosConfig';
import { Quiz, Question, Answer, Result, Topic } from '../types/models';

// Quiz API calls
export const getQuizzes = async (search?: string, difficulty?: string, topic?: string): Promise<Quiz[]> => {
  const response = await api.get<Quiz[]>('/quizzes', { 
    params: { search, difficulty, topic } 
  });
  return response.data;
};

export const getQuizById = async (id: number): Promise<Quiz> => {
  const response = await api.get<Quiz>(`/quizzes/${id}`);
  return response.data;
};

export const createQuiz = async (quiz: Omit<Quiz, 'id'>): Promise<Quiz> => {
  const response = await api.post<Quiz>('/quizzes', quiz);
  return response.data;
};

export const updateQuiz = async (id: number, quiz: Partial<Quiz>): Promise<Quiz> => {
  const response = await api.put<Quiz>(`/quizzes/${id}`, quiz);
  return response.data;
};

export const deleteQuiz = async (id: number): Promise<void> => {
  await api.delete(`/quizzes/${id}`);
};

// Question API calls
export const getQuestions = async (quizId: number): Promise<Question[]> => {
  const response = await api.get<Question[]>(`/quizzes/${quizId}/questions`);
  return response.data;
};

export const createQuestion = async (question: Omit<Question, 'id'>): Promise<Question> => {
  const response = await api.post<Question>('/questions', question);
  return response.data;
};

export const updateQuestion = async (id: number, question: Partial<Question>): Promise<Question> => {
  const response = await api.put<Question>(`/questions/${id}`, question);
  return response.data;
};

export const deleteQuestion = async (id: number): Promise<void> => {
  await api.delete(`/questions/${id}`);
};

// Answer API calls
export const getAnswers = async (questionId: number): Promise<Answer[]> => {
  const response = await api.get<Answer[]>(`/questions/${questionId}/answers`);
  return response.data;
};

export const createAnswer = async (answer: Omit<Answer, 'id'>): Promise<Answer> => {
  console.log(answer);
  const response = await api.post<Answer>('/answers', answer);
  return response.data;
};

export const updateAnswer = async (id: number, answer: Partial<Answer>): Promise<Answer> => {
  const response = await api.put<Answer>(`/answers/${id}`, answer);
  return response.data;
};

export const deleteAnswer = async (id: number): Promise<void> => {
  await api.delete(`/answers/${id}`);
};

// Results API calls
export const submitQuizAnswers = async (quizId: number, answers: { questionId: number, answerBody: string }[]): Promise<Result> => {
  const response = await api.post<Result>(`/quizzes/${quizId}/submit`, { answers });
  return response.data;
};

export const getUserResults = async (): Promise<Result[]> => {
  const response = await api.get<Result[]>('/results/user');
  return response.data;
};

export const getLeaderboard = async (quizId?: number, period?: string): Promise<Result[]> => {
  const response = await api.get<Result[]>('/results/leaderboard', {
    params: { quizId, period }
  });
  return response.data;
};

export const getAllResults = async (): Promise<Result[]> => {
  const response = await api.get<Result[]>('/results');
  return response.data;
};

// Topic API calls
export const getTopics = async (): Promise<Topic[]> => {
  const response = await api.get<Topic[]>('/topics');
  return response.data;
};