export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum DifficultyEnum {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_IN_BLANK = 'FILL_IN_BLANK'
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  profileImage: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: DifficultyEnum;
  time: number;
  questionCount?: number;
  topics?: Topic[];
}

export interface Question {
  id: number;
  quizId: number;
  body: string;
  type: QuestionType;
  points: number;
  answers?: Answer[];
}

export interface Answer {
  id: number;
  questionId: number;
  isTrue: boolean;
  answerBody: string;
}

export interface UserAnswer {
  id: number;
  userId: number;
  questionId: number;
  answerBody: string;
  isTrue: boolean;
}

export interface Result {
  id: number;
  quizId: number;
  userId: number;
  dateOfPlay: string;
  points: number;
  maxPoints: number;
  quiz?: Quiz;
  user?: User;
}

export interface Topic {
  id: number;
  quizId: number;
  about: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  user: User;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface RegisterUserDTO {
  username: string;
  email: string;
  password: string;
  profileImage?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  profileImageFile: File;
}

export interface QuizSession {
  quiz: Quiz;
  questions: Question[];
  startTime: number;
  endTime: number;
  userAnswers: { [questionId: number]: string | string[] };
}

export interface QuizResult {
  quiz: Quiz;
  questions: Question[];
  userAnswers: UserAnswer[];
  result: Result;
  correctAnswers: { [questionId: number]: Answer[] };
}

export interface LeaderboardEntry {
  user: User;
  result: Result;
  position: number;
}