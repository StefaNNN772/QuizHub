import React, { useState, useEffect } from 'react';
import AdminDashboardComponent from '../../components/admin/AdminDashboardComponent';
import { getQuizzes, getAllResults } from '../../api/quizService';
import { Quiz, Result } from '../../types/models';

const AdminDashboardPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [quizzesData, resultsData] = await Promise.all([getQuizzes(), getAllResults()]);
        setQuizzes(quizzesData);
        setResults(resultsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return <AdminDashboardComponent quizzes={quizzes} results={results} loading={loading} />;
};

export default AdminDashboardPage;
