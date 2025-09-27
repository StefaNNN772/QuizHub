using Microsoft.EntityFrameworkCore;
using quizhub_backend.Data;
using quizhub_backend.DTOs;
using quizhub_backend.Models;

namespace quizhub_backend.Repository
{
    public class AnswerRepository
    {
        private readonly AppDbContext _context;

        public AnswerRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AnswerDTO> AddAnswer(AnswerDTO answerDTO)
        {
            Answer answer = new Answer
            {
                QuestionId = answerDTO.QuestionId,
                AnswerBody = answerDTO.AnswerBody,
                IsTrue = answerDTO.IsTrue
            };

            _context.Answers.Add(answer);
            await _context.SaveChangesAsync();

            answerDTO.Id = answer.Id;

            return answerDTO;
        }

        public async Task<bool> DeleteAnswer(long id)
        {
            var answer = await _context.Answers.Where(a => a.Id == id).FirstOrDefaultAsync();

            if (answer != null)
            {
                _context.Answers.Remove(answer);
                return await _context.SaveChangesAsync() > 0;
            }

            return false;
        }

        public async Task<bool> UpdateAnswer(AnswerDTO answerDTO)
        {
            var answer = await _context.Answers.Where(a => a.Id == answerDTO.Id).FirstOrDefaultAsync();

            if(answer != null)
            {
                answer.AnswerBody = answerDTO.AnswerBody;
                answer.IsTrue = answerDTO.IsTrue;

                _context.Answers.Update(answer);
                return await _context.SaveChangesAsync() > 0;
            }

            return false;
        }

        public async Task<List<AnswerDTO>> GetAnswers(long id)
        {
            var answers = await _context.Answers
                                            .Where(a => a.QuestionId == id)
                                            .Include(a => a.Question)
                                            .ToListAsync();

            List<AnswerDTO> answersDTO = new List<AnswerDTO>();

            foreach (var a in answers)
            {
                answersDTO.Add(new AnswerDTO { Id = a.Id, AnswerBody = a.AnswerBody, IsTrue = a.IsTrue, QuestionId = a.QuestionId, QuestionDTO = a.Question });
            }

            return answersDTO;
        }

        public async Task<bool> SaveUserAnswers(List<UserAnswerDTO> answers, long id)
        {
            List<UserAnswer> userAnswers = new List<UserAnswer>();

            foreach (var answer in answers)
            {
                UserAnswer userAnswer = new UserAnswer
                {
                    UserId = answer.UserId,
                    QuestionId = answer.QuestionId,
                    AnswerBody = answer.AnswerBody,
                    IsTrue = answer.IsTrue,
                    ResultId = id
                };

                userAnswers.Add(userAnswer);
            }

            _context.UserAnswers.AddRange(userAnswers);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
