import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Quiz, DifficultyEnum } from '../types';
import { quizAPI } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Clock, BarChart3, User } from 'lucide-react';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [quizzes, searchTerm, difficultyFilter]);

  const loadQuizzes = async () => {
    try {
      const data = await quizAPI.getQuizzes();
      setQuizzes(data);
    } catch (error) {
      toast.error('Greška pri učitavanju kvizova');
    } finally {
      setIsLoading(false);
    }
  };

  const filterQuizzes = () => {
    let filtered = quizzes;

    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (difficultyFilter) {
      filtered = filtered.filter(quiz => quiz.difficulty === difficultyFilter);
    }

    setFilteredQuizzes(filtered);
  };

  const getDifficultyBadge = (difficulty: DifficultyEnum) => {
    const styles = {
      [DifficultyEnum.EASY]: 'bg-green-100 text-green-800',
      [DifficultyEnum.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [DifficultyEnum.HARD]: 'bg-red-100 text-red-800',
    };

    const labels = {
      [DifficultyEnum.EASY]: 'Lako',
      [DifficultyEnum.MEDIUM]: 'Srednje',
      [DifficultyEnum.HARD]: 'Teško',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[difficulty]}`}>
        {labels[difficulty]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dobrodošlica */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Dobrodošli, {user?.username}!
        </h1>
        <p className="text-primary-100">
          Spremni ste za novo izazove? Odaberite kviz i testirajte svoje znanje.
        </p>
      </div>

      {/* Filteri */}
      <Card>
        <CardHeader>
          <CardTitle>Pronađite kviz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Pretražite kvizove..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="input"
              >
                <option value="">Svi nivoi</option>
                <option value={DifficultyEnum.EASY}>Lako</option>
                <option value={DifficultyEnum.MEDIUM}>Srednje</option>
                <option value={DifficultyEnum.HARD}>Teško</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista kvizova */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
                {getDifficultyBadge(quiz.difficulty)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm line-clamp-3">
                {quiz.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{quiz.time} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BarChart3 size={16} />
                  <span>{quiz.questionCount || 'N/A'} pitanja</span>
                </div>
              </div>

              <Link to={`/quiz/${quiz.id}`} className="block">
                <Button className="w-full">
                  Započni kviz
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nema rezultata
          </h3>
          <p className="text-gray-600">
            Pokušajte sa drugim kriterijumima pretrage.
          </p>
        </div>
      )}

      {/* Brzi linkovi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User size={20} />
              <span>Moji rezultati</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Pogledajte istoriju svojih rezultata i napredak.
            </p>
            <Link to="/profile">
              <Button variant="outline" className="w-full">
                Pogledaj rezultate
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 size={20} />
              <span>Rang lista</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Vidite kako stojite u odnosu na ostale igrače.
            </p>
            <Link to="/leaderboard">
              <Button variant="outline" className="w-full">
                Pogledaj rang listu
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};