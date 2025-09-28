using quizhub_backend.DTOs;

namespace quizhub_backend.Services.ServiceInterfaces
{
    public interface IAnswerService
    {
        Task<AnswerDTO> AddAnswer(AnswerDTO answerDTO);
        Task<bool> DeleteAnswer(long id);
        Task<bool> UpdateAnswer(AnswerDTO answerDTO);
        Task<List<AnswerDTO>> GetAnswers(long id);
        Task<bool> SaveUserAnswers(List<UserAnswerDTO> answers, long id);
    }
}
