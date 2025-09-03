using quizhub_backend.Models;
using quizhub_backend.Repository;

namespace quizhub_backend.Services
{
    public class QuizService
    {
        private readonly QuizRepository _quizRepository;

        public QuizService(QuizRepository quizRepository)
        {
            this._quizRepository = quizRepository;
        }
    }
}
