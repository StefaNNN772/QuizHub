using quizhub_backend.DTOs;
using quizhub_backend.Repository;

namespace quizhub_backend.Services
{
    public class QuestionService
    {
        private readonly QuestionRepository _questionRepository;

        public QuestionService(QuestionRepository questionRepository)
        {
            this._questionRepository = questionRepository;
        }

        public async Task<List<QuestionDTO>> GetQuestions(long id)
        {
            return await _questionRepository.GetQuestions(id);
        }

        public async Task<QuestionDTO> CreateQuestion(QuestionDTO questionDTO)
        {
            return await _questionRepository.CreateQuestion(questionDTO);
        }

        public async Task<List<AnswerDTO>> GetQuestionAnswers(long id)
        {
            return await _questionRepository.GetQuestionAnswers(id);
        }
    }
}
