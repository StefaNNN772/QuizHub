import axios from 'axios';
import { AuthResponse, User, Quiz, Question, Result, LeaderboardEntry, RegisterUserDTO, UserCredentials } from '../types/index.ts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5143/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor za dodavanje token-a u svaki zahtev
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor za obradu grešaka
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: UserCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (form: {
    username: string;
    email: string;
    password: string;
    profileImageFile: File;
  }): Promise<AuthResponse> => {
    const fd = new FormData();
    fd.append('username', form.username);
    fd.append('email', form.email);
    fd.append('password', form.password);
    fd.append('profileImage', form.profileImageFile);

    const response = await api.post('/auth/register', fd, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export const quizAPI = {
  getQuizzes: async (filters?: { difficulty?: string; topic?: string; search?: string }): Promise<Quiz[]> => {
    const response = await api.get('/quizzes', { params: filters });
    return response.data;
  },

  getQuiz: async (id: number): Promise<Quiz> => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  getQuizQuestions: async (id: number): Promise<Question[]> => {
    const response = await api.get(`/quizzes/${id}/questions`);
    return response.data;
  },

  createQuiz: async (quiz: Omit<Quiz, 'id'>): Promise<Quiz> => {
    const response = await api.post('/quizzes', quiz);
    return response.data;
  },

  updateQuiz: async (id: number, quiz: Partial<Quiz>): Promise<Quiz> => {
    const response = await api.put(`/quizzes/${id}`, quiz);
    return response.data;
  },

  deleteQuiz: async (id: number): Promise<void> => {
    await api.delete(`/quizzes/${id}`);
  },

  submitQuiz: async (quizId: number, answers: { questionId: number; answerBody: string }[]): Promise<Result> => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return response.data;
  },
};

export const resultAPI = {
  getUserResults: async (): Promise<Result[]> => {
    const response = await api.get('/results/user');
    return response.data;
  },

  getQuizResults: async (quizId: number): Promise<Result[]> => {
    const response = await api.get(`/results/quiz/${quizId}`);
    return response.data;
  },

  getResultDetails: async (resultId: number): Promise<any> => {
    const response = await api.get(`/results/${resultId}/details`);
    return response.data;
  },

  getLeaderboard: async (quizId?: number, period?: 'week' | 'month' | 'all'): Promise<LeaderboardEntry[]> => {
    const response = await api.get('/results/leaderboard', { 
      params: { quizId, period } 
    });
    return response.data;
  },
};

export default api;