import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import QuizResultPage from './pages/QuizResultPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminQuizzes from './pages/admin/AdminQuizzes';
import AdminQuizForm from './pages/admin/AdminQuizForm';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminResults from './pages/admin/AdminResults';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './context/AuthContext';

// Route protection components
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAdmin, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { 
        path: '/dashboard', 
        element: <PrivateRoute><DashboardPage /></PrivateRoute> 
      },
      { 
        path: '/quiz/:id', 
        element: <PrivateRoute><QuizPage /></PrivateRoute> 
      },
      { 
        path: '/results', 
        element: <PrivateRoute><ResultsPage /></PrivateRoute> 
      },
      { 
        path: '/quiz/:id/result', 
        element: <PrivateRoute><QuizResultPage /></PrivateRoute> 
      },
      { 
        path: '/leaderboard', 
        element: <PrivateRoute><LeaderboardPage /></PrivateRoute> 
      },
      {
        path: '/admin',
        element: <AdminRoute><AdminLayout /></AdminRoute>,
        children: [
          { path: '', element: <AdminDashboard /> },
          { path: 'quizzes', element: <AdminQuizzes /> },
          { path: 'quizzes/new', element: <AdminQuizForm /> },
          { path: 'quizzes/:id/edit', element: <AdminQuizForm /> },
          { path: 'quizzes/:id/questions', element: <AdminQuestions /> },
          { path: 'results', element: <AdminResults /> },
        ]
      },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
]);