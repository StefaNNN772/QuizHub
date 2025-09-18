import api from './axiosConfig';
import { AuthResponse } from '../types/models';

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', { username, password });
  return response.data;
};

export const register = async (
  username: string, 
  email: string, 
  password: string, 
  profileImage: string // This now accepts base64 image data
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', { 
    username, 
    email, 
    password,
    profileImage, // Send the base64 image data
    role: "User" // Default role for new registrations
  });
  return response.data;
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>('/auth/me');
  return response.data;
};