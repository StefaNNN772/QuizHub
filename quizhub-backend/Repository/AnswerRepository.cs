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
                await _context.SaveChangesAsync();

                return true;
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
    }
}
