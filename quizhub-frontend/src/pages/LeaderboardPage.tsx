import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, Quiz } from '../types';
import { resultAPI, quizAPI } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Trophy, Medal, Award, Crown} from 'lucide-react';
import toast from 'react-hot-toast';

export const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<number | undefined>();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedQuiz, selectedPeriod]);

  const loadQuizzes = async () => {
    try {
      const data = await quizAPI.getQuizzes();
      setQuizzes(data);
    } catch (error) {
      toast.error('Greška pri učitavanju kvizova');
    }
  };

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await resultAPI.getLeaderboard(selectedQuiz, selectedPeriod);
      setLeaderboard(data);
    } catch (error) {
      toast.error('Greška pri učitavanju rang liste');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-amber-600" size={24} />;
      default:
        return <span className="text-lg font-bold text-gray-600">{position}</span>;
    }
  };

  const getRankBg = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rang lista</h1>
        <p className="text-gray-600">Pogledajte najbolje rezultate i vidite gde se nalazite</p>
      </div>

      {/* Filteri */}
      <Card>
        <CardHeader>
          <CardTitle>Filteri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kviz
              </label>
              <select
                value={selectedQuiz || ''}
                onChange={(e) => setSelectedQuiz(e.target.value ? Number(e.target.value) : undefined)}
                className="input"
              >
                <option value="">Svi kvizovi</option>
                {quizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'all')}
                className="input"
              >
                <option value="all">Svi rezultati</option>
                <option value="month">Poslednji mesec</option>
                <option value="week">Poslednja nedelja</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rang lista */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="text-yellow-500" size={24} />
            <span>Najbolji rezultati</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nema rezultata
              </h3>
              <p className="text-gray-600">
                Budite prvi koji će se pojaviti na ovoj rang listi!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={`${entry.user.id}-${entry.result.id}`}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md ${getRankBg(entry.position)}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(entry.position)}
                    </div>
                    <div className="flex items-center space-x-3">
                      <img
                        src={entry.user.profileImage || `https://ui-avatars.com/api/?name=${entry.user.username}&background=3b82f6&color=fff`}
                        alt={entry.user.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{entry.user.username}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(entry.result.dateOfPlay).toLocaleDateString('sr-RS')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary-600">
                      {Math.round((entry.result.points / entry.result.maxPoints) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {entry.result.points}/{entry.result.maxPoints} poena
                    </div>
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