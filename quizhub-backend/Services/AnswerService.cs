using quizhub_backend.DTOs;
using quizhub_backend.Repository;

namespace quizhub_backend.Services
{
    public class AnswerService
    {
        private readonly AnswerRepository _answerRepository;

        public AnswerService(AnswerRepository answerRepository)
        {
            this._answerRepository = answerRepository;
        }

        public async Task<AnswerDTO> AddAnswer(AnswerDTO answerDTO)
        {
            return await _answerRepository.AddAnswer(answerDTO);
        }

        public async Task<bool> DeleteAnswer(long id)
        {
            return await _answerRepository.DeleteAnswer(id);
        }

        public async Task<bool> UpdateAnswer(AnswerDTO answerDTO)
        {
            return await _answerRepository.UpdateAnswer(answerDTO);
        }

        public async Task<List<AnswerDTO>> GetAnswers(long id)
        {
            return await _answerRepository.GetAnswers(id);
        }

        public async Task<bool> SaveUserAnswers(List<UserAnswerDTO> answers)
        {
            return await _answerRepository.SaveUserAnswers(answers);
        }
    }
}
