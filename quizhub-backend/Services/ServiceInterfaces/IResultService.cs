using quizhub_backend.DTOs;

namespace quizhub_backend.Services.ServiceInterfaces
{
    public interface IResultService
    {
        Task<ResultDTO> SaveUserResult(ResultDTO resultDTO);
        Task<List<ResultDTO>> GetUserResults(long userId);
        Task<List<ResultDTO>> GetResults();
        Task<List<ResultDTO>> GetResultsLeaderboard(long? quizId = null, string period = null);
        Task<List<UserAnswerDTO>> GetUserAnswers(long id);
    }
}
