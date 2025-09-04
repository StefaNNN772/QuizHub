import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, BarChart3, FileText } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">24</div>
            <div className="text-sm text-gray-600">Ukupno kvizova</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">156</div>
            <div className="text-sm text-gray-600">Ukupno korisnika</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">1,234</div>
            <div className="text-sm text-gray-600">Ukupno rezultata</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">78%</div>
            <div className="text-sm text-gray-600">Prosečan rezultat</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus size={20} />
              <span>Kreiraj kviz</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Kreirajte novi kviz sa pitanjima i odgovorima.
            </p>
            <Link to="/admin/quiz/create">
              <Button className="w-full">
                Kreiraj novi kviz
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText size={20} />
              <span>Upravljaj kvizovima</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Pregledajte, uredite ili obrišite postojeće kvizove.
            </p>
            <Link to="/admin/quizzes">
              <Button variant="outline" className="w-full">
                Upravljaj kvizovima
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 size={20} />
              <span>Statistike</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Pregledajte detaljne statistike i rezultate.
            </p>
            <Link to="/admin/statistics">
              <Button variant="outline" className="w-full">
                Pogledaj statistike
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};