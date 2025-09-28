using quizhub_backend.DTOs;

namespace quizhub_backend.Services.ServiceInterfaces
{
    public interface IQuestionService
    {
        Task<List<QuestionDTO>> GetQuestions(long id);
        Task<QuestionDTO> CreateQuestion(QuestionDTO questionDTO);
        Task<List<AnswerDTO>> GetQuestionAnswers(long id);
        Task<bool> DeleteQuestion(long id);
        Task<QuestionDTO> UpdateQuestion(long id, QuestionDTO questionDTO);
    }
}
