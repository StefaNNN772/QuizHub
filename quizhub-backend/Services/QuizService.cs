using quizhub_backend.DTOs;
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

        public async Task<QuizDTO> CreateQuiz(QuizDTO quizDTO)
        {
            return await _quizRepository.CreateQuiz(quizDTO);
        }

        public async Task<List<QuizDTO>> GetQuizzes(string search = null, string difficulty = null, string topic = null)
        {
            return await _quizRepository.GetQuizzes(search, difficulty, topic);
        }

        public async Task<QuizDTO> GetQuizById(long id)
        {
            return await _quizRepository.GetQuizById(id);
        }

        public async Task<bool> DeleteQuiz(long id)
        {
            return await _quizRepository.DeleteQuiz(id);
        }

        public async Task<QuizDTO> UpdateQuiz(long id, QuizDTO quizDTO)
        {
            return await _quizRepository.UpdateQuiz(id, quizDTO);
        }
    }
}
