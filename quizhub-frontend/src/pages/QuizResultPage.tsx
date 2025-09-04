import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Result } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Trophy, Home, Share2 } from 'lucide-react';

export const QuizResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (location.state?.result) {
      setResult(location.state.result);
    } else {
      navigate('/dashboard');
    }
  }, [location.state, navigate]);

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const percentage = Math.round((result.points / result.maxPoints) * 100);
  const getGradeColor = (percent: number) => {
    if (percent >= 80) return 'text-green-600';
    if (percent >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeMessage = (percent: number) => {
    if (percent >= 90) return 'Odličan rezultat! 🎉';
    if (percent >= 80) return 'Vrlo dobar rezultat! 👏';
    if (percent >= 60) return 'Dobar rezultat! 👍';
    if (percent >= 40) return 'Može bolje! 💪';
    return 'Treba više vežbe! 📚';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Glavni rezultat */}
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-10 h-10 text-primary-600" />
          </div>
          <CardTitle className="text-2xl">Kviz završen!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className={`text-6xl font-bold ${getGradeColor(percentage)} mb-2`}>
              {percentage}%
            </div>
            <p className="text-xl text-gray-600 mb-2">
              {result.points} od {result.maxPoints} poena
            </p>
            <p className="text-lg text-gray-700">
              {getGradeMessage(percentage)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{result.points}</div>
              <div className="text-sm text-gray-600">Osvojeni poeni</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{result.maxPoints}</div>
              <div className="text-sm text-gray-600">Maksimalno poena</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {new Date(result.dateOfPlay).toLocaleDateString('sr-RS')}
              </div>
              <div className="text-sm text-gray-600">Datum</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button variant="primary" className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Nazad na početnu
              </Button>
            </Link>
            <Link to={`/quiz/${id}`}>
              <Button variant="outline" className="w-full sm:w-auto">
                Ponovi kviz
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="outline" className="w-full sm:w-auto">
                <Trophy className="w-4 h-4 mr-2" />
                Rang lista
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Poziv na akciju */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Želite da se takmičite sa prijateljima?
        </p>
        <Button variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Podeli rezultat
        </Button>
      </div>
    </div>
  );
};