import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Result} from '../types';
import { resultAPI } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Trophy, Calendar, BarChart3} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('all');

  useEffect(() => {
    loadUserResults();
  }, []);

  const loadUserResults = async () => {
    try {
      const data = await resultAPI.getUserResults();
      setResults(data);
    } catch (error) {
      toast.error('Greška pri učitavanju rezultata');
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = () => {
    if (!results.length) return { totalQuizzes: 0, averageScore: 0, bestScore: 0, totalPoints: 0 };

    const totalQuizzes = results.length;
    const totalPoints = results.reduce((sum, result) => sum + result.points, 0);
    const totalMaxPoints = results.reduce((sum, result) => sum + result.maxPoints, 0);
    const averageScore = totalMaxPoints > 0 ? Math.round((totalPoints / totalMaxPoints) * 100) : 0;
    const bestScore = Math.max(...results.map(result => Math.round((result.points / result.maxPoints) * 100)));

    return { totalQuizzes, averageScore, bestScore, totalPoints };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profil header */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center space-x-6">
            <img
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.username}&background=3b82f6&color=fff`}
              alt={user?.username}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <User size={16} />
                  <span>Korisnik od {new Date().getFullYear()}</span>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistike */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">{stats.totalQuizzes}</div>
            <div className="text-sm text-gray-600">Ukupno kvizova</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.averageScore}%</div>
            <div className="text-sm text-gray-600">Prosečan rezultat</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.bestScore}%</div>
            <div className="text-sm text-gray-600">Najbolji rezultat</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalPoints}</div>
            <div className="text-sm text-gray-600">Ukupno poena</div>
          </CardContent>
        </Card>
      </div>

      {/* Istorija rezultata */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Moji rezultati</CardTitle>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'all')}
              className="input w-auto"
            >
              <option value="all">Svi rezultati</option>
              <option value="month">Poslednji mesec</option>
              <option value="week">Poslednja nedelja</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Još nema rezultata
              </h3>
              <p className="text-gray-600 mb-4">
                Počnite sa rešavanjem kvizova da vidite svoje rezultate ovde.
              </p>
              <Button>Idite na kvizove</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {result.quiz?.title || 'Kviz'}
                    </h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(result.dateOfPlay).toLocaleDateString('sr-RS')}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <BarChart3 size={14} />
                        <span>{result.points}/{result.maxPoints} poena</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">
                        {Math.round((result.points / result.maxPoints) * 100)}%
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Detalji
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};