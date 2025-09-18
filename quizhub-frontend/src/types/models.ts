export enum UserRole {
  Admin = "Admin",
  User = "User"
}

export enum DifficultyEnum {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard"
}

export enum QuestionType {
  OneAnswer = "OneAnswer",
  MultipleAnswer = "MultipleAnswer",
  TrueOrFalse = "TrueOrFalse",
  FillInTheBlank = "FillInTheBlank"
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
  topics?: string[];
  questions?: Question[];
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
  token: string;
  user: User;
}

export interface LeaderboardEntry {
  position: number;
  username: string;
  points: number;
  maxPoints: number;
  percentage: number;
  dateOfPlay: string;
}