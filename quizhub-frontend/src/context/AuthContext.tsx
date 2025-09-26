import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/models';
import { getCurrentUser } from '../api/authService';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Login function to set token and user
  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  // Logout function to clear token and user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Clear user from localStorage
    setToken(null);
    setUser(null);
  };

  // Effect to initialize auth state on page load
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get token from localStorage
        const storedToken = localStorage.getItem('token');
        
        if (!storedToken) {
          setLoading(false);
          return; // No token, not authenticated
        }
        
        // Check if token is expired
        try {
          const decodedToken: any = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            console.log('Token expired');
            logout();
            setLoading(false);
            return;
          }
          
          // Token is valid, set it
          setToken(storedToken);
          
          // Try to get cached user first
          const cachedUser = localStorage.getItem('user');
          if (cachedUser) {
            setUser(JSON.parse(cachedUser));
            setLoading(false);
          }
          
          // Always verify with backend
          try {
            console.log(localStorage)
            const userData = await getCurrentUser();
            if (userData && userData.user) {
              setUser(userData.user);
              // Update cached user with fresh data
              localStorage.setItem('user', JSON.stringify(userData.user));
            } else {
              // Backend didn't recognize the token
              logout();
            }
          } catch (apiError) {
            console.error('Error refreshing user data:', apiError);
            // We don't logout here because we might be offline
            // Just use the cached user data
          }
        } catch (jwtError) {
          console.error('Invalid token format:', jwtError);
          logout();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication');
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated, 
      isAdmin,
      login, 
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);