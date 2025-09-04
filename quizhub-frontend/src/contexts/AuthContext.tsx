import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserCredentials, RegisterRequest } from '../types';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper za normalizaciju backend odgovora (podržava i PascalCase i camelCase)
function normalizeAuthResponse(raw: any) {
  const accessToken = raw.accessToken ?? raw.AccessToken;
  const expiresIn = raw.expiresIn ?? raw.ExpiresIn;
  const user: User = raw.user ?? raw.User;

  if (!accessToken || !expiresIn || !user) {
    throw new Error('Neispravan format auth odgovora (nedostaju AccessToken/ExpiresIn/User).');
  }

  return { accessToken, expiresIn, user };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const expiresIn = localStorage.getItem('expiresin');
      const storedUser = localStorage.getItem('user');

      if (token && expiresIn && storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
            // (Opcionalno: možeš proveriti da li je token istekao ako čuvaš expiresAt.)
          setUser(parsedUser);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('expiresin');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: UserCredentials) => {
    try {
      const raw = await authAPI.login(credentials);
      const { accessToken, expiresIn, user } = normalizeAuthResponse(raw);

      localStorage.setItem('token', accessToken);
      localStorage.setItem('expiresin', JSON.stringify(expiresIn));
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      toast.success('Uspešno ste se prijavili!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Greška pri prijavi');
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      if (!userData.profileImageFile) {
        toast.error('Slika profila je obavezna.');
        throw new Error('Profile image is required');
      }

      const raw = await authAPI.register({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        profileImageFile: userData.profileImageFile
      });

      const { accessToken, expiresIn, user } = normalizeAuthResponse(raw);

      localStorage.setItem('token', accessToken);
      localStorage.setItem('expiresin', JSON.stringify(expiresIn));
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      toast.success('Uspešno ste se registrovali!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Greška pri registraciji');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresin');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Uspešno ste se odjavili!');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};