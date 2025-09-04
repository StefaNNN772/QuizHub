import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Quiz, Question, QuestionType, Answer } from '../types';
import { quizAPI } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Clock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: string | string[] }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (id) {
      loadQuiz();
    }
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (quizStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [quizStarted, timeLeft]);

  const loadQuiz = async () => {
    try {
      const quizData = await quizAPI.getQuiz(Number(id));
      const questionsData = await quizAPI.getQuizQuestions(Number(id));
      
      setQuiz(quizData);
      setQuestions(questionsData);
      setTimeLeft(quizData.time * 60); // Konvertuj minute u sekunde
    } catch (error) {
      toast.error('Greška pri učitavanju kviza');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    toast.success('Kviz je počeo! Srećno!');
  };

  const handleAnswerChange = (questionId: number, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitQuiz = useCallback(async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        answerBody: Array.isArray(answer) ? answer.join(',') : answer
      }));

      const result = await quizAPI.submitQuiz(Number(id), formattedAnswers);
      navigate(`/quiz/${id}/result`, { state: { result } });
    } catch (error) {
      toast.error('Greška pri slanju odgovora');
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, id, navigate, isSubmitting]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!quiz || !questions.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Kviz nije pronađen</h2>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Nazad na početnu
        </Button>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600">{quiz.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{questions.length}</div>
                <div className="text-sm text-gray-600">Pitanja</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{quiz.time}</div>
                <div className="text-sm text-gray-600">Minuta</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">
                  {quiz.difficulty === 'EASY' ? 'Lako' : 
                   quiz.difficulty === 'MEDIUM' ? 'Srednje' : 'Teško'}
                </div>
                <div className="text-sm text-gray-600">Težina</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-yellow-800">Važne napomene:</h4>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    <li>• Kada započnete kviz, tajmer će početi da se otkucava</li>
                    <li>• Kviz će se automatski završiti kada istekne vreme</li>
                    <li>• Možete se kretati između pitanja</li>
                    <li>• Odgovore možete menjati dok ne završite kviz</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button onClick={startQuiz} className="w-full" size="lg">
              Započni kviz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header sa vremenom i napretkom */}
      <Card>
        <CardContent className="py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold">{quiz.title}</h2>
              <span className="text-gray-500">
                Pitanje {currentQuestionIndex + 1} od {questions.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className={timeLeft < 300 ? 'text-red-500' : 'text-gray-500'} size={20} />
              <span className={`font-mono text-lg ${timeLeft < 300 ? 'text-red-500' : 'text-gray-700'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pitanje */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestion.body}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionComponent
            question={currentQuestion}
            answer={answers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        </CardContent>
      </Card>

      {/* Navigacija */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Prethodno pitanje
        </Button>

        <div className="space-x-2">
          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Završi kviz
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
            >
              Sledeće pitanje
            </Button>
          )}
        </div>
      </div>

      {/* Pregled pitanja */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pregled pitanja</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`
                  w-10 h-10 rounded-lg border-2 text-sm font-medium transition-colors
                  ${index === currentQuestionIndex 
                    ? 'border-primary-600 bg-primary-600 text-white' 
                    : answers[questions[index].id]
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }
                `}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Komponenta za renderovanje pitanja na osnovu tipa
interface QuestionComponentProps {
  question: Question;
  answer: string | string[] | undefined;
  onAnswerChange: (answer: string | string[]) => void;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({ question, answer, onAnswerChange }) => {
  const [questionAnswers, setQuestionAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    // Ovde biste normalno učitali odgovore za pitanje iz API-ja
    // Za demonstraciju, koristim mock podatke
    const mockAnswers: Answer[] = [
      { id: 1, questionId: question.id, answerBody: 'Odgovor A', isTrue: false },
      { id: 2, questionId: question.id, answerBody: 'Odgovor B', isTrue: true },
      { id: 3, questionId: question.id, answerBody: 'Odgovor C', isTrue: false },
      { id: 4, questionId: question.id, answerBody: 'Odgovor D', isTrue: false },
    ];
    setQuestionAnswers(mockAnswers);
  }, [question.id]);

  switch (question.type) {
    case QuestionType.SINGLE_CHOICE:
      return (
        <div className="space-y-3">
          {questionAnswers.map((ans) => (
            <label key={ans.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={ans.answerBody}
                checked={answer === ans.answerBody}
                onChange={(e) => onAnswerChange(e.target.value)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-gray-700">{ans.answerBody}</span>
            </label>
          ))}
        </div>
      );

    case QuestionType.MULTIPLE_CHOICE:
      const selectedAnswers = Array.isArray(answer) ? answer : [];
      return (
        <div className="space-y-3">
          {questionAnswers.map((ans) => (
            <label key={ans.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                value={ans.answerBody}
                checked={selectedAnswers.includes(ans.answerBody)}
                onChange={(e) => {
                  const newAnswers = e.target.checked
                    ? [...selectedAnswers, ans.answerBody]
                    : selectedAnswers.filter(a => a !== ans.answerBody);
                  onAnswerChange(newAnswers);
                }}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-gray-700">{ans.answerBody}</span>
            </label>
          ))}
        </div>
      );

    case QuestionType.TRUE_FALSE:
      return (
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name={`question-${question.id}`}
              value="true"
              checked={answer === 'true'}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <span className="text-gray-700">Tačno</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name={`question-${question.id}`}
              value="false"
              checked={answer === 'false'}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <span className="text-gray-700">Netačno</span>
          </label>
        </div>
      );

    case QuestionType.FILL_IN_BLANK:
      return (
        <div>
          <input
            type="text"
            value={typeof answer === 'string' ? answer : ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Unesite vaš odgovor..."
            className="input w-full"
          />
        </div>
      );

    default:
      return <div>Nepoznat tip pitanja</div>;
  }
};