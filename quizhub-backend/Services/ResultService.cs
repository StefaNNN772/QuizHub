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

        public async Task<bool> SaveUserResult(ResultDTO resultDTO)
        {
            return await _resultRepository.SaveUserResult(resultDTO);
        }
    }
}
