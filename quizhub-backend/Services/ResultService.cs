using quizhub_backend.DTOs;
using quizhub_backend.Repository;

namespace quizhub_backend.Services
{
    public class ResultService
    {
        private readonly ResultRepository _resultRepository;

        public ResultService(ResultRepository resultRepository)
        {
            this._resultRepository = resultRepository;
        }

        public async Task<ResultDTO> SaveUserResult(ResultDTO resultDTO)
        {
            return await _resultRepository.SaveUserResult(resultDTO);
        }

        public async Task<List<ResultDTO>> GetUserResults(long userId)
        {
            return await _resultRepository.GetUserResults(userId);
        }

        public async Task<List<ResultDTO>> GetResults()
        {
            return await _resultRepository.GetResults();
        }

        public async Task<List<ResultDTO>> GetResultsLeaderboard(long? quizId = null, string period = null)
        {
            return await _resultRepository.GetResultsLeaderboard(quizId, period);
        }

        public async Task<List<UserAnswerDTO>> GetUserAnswers(long id)
        {
            return await _resultRepository.GetUserAnswers(id);
        }
    }
}
