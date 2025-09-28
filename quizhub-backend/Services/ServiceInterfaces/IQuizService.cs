using quizhub_backend.DTOs;

namespace quizhub_backend.Services.ServiceInterfaces
{
    public interface IQuizService
    {
        Task<QuizDTO> CreateQuiz(QuizDTO quizDTO);
        Task<List<QuizDTO>> GetQuizzes(string search = null, string difficulty = null, string topic = null);
        Task<QuizDTO> GetQuizById(long id);
        Task<bool> DeleteQuiz(long id);
        Task<QuizDTO> UpdateQuiz(long id, QuizDTO quizDTO);
    }
}
