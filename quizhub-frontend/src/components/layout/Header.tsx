import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { LogOut, User, Trophy, Home } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <span className="text-xl font-bold text-gray-900">QuizHub</span>
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <Home size={20} />
                  <span>Početna</span>
                </Link>
                <Link to="/leaderboard" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <Trophy size={20} />
                  <span>Rang lista</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <User size={20} />
                  <span>{user?.username}</span>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span className="ml-1">Odjavi se</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">Prijavi se</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Registruj se</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};