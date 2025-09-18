using Microsoft.EntityFrameworkCore;
using quizhub_backend.Data;
using quizhub_backend.DTOs;
using quizhub_backend.Models;

namespace quizhub_backend.Repository
{
    public class QuestionRepository
    {
        private readonly AppDbContext _context;

        public QuestionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<QuestionDTO>> GetQuestions(long id)
        {
            var questions = await _context.Questions.Where(u => u.Id == id).ToArrayAsync();

            List<QuestionDTO> questionsDTO = new List<QuestionDTO>();

            foreach (var q in questions)
            {
                questionsDTO.Add(new QuestionDTO { Id = q.Id, QuizId = q.QuizId, Body = q.Body, Type = q.Type.ToString(), Points = q.Points });
            }

            return questionsDTO;
        }

        public async Task<QuestionDTO> CreateQuestion(QuestionDTO questionDTO)
        {
            QuestionType type;

            switch (questionDTO.Type)
            {
                case "OneAnswer":
                    type = QuestionType.OneAnswer;
                    break;
                case "MultipleAnswer":
                    type = QuestionType.MultipleAnswer;
                    break;
                case "TrueOrFalse":
                    type = QuestionType.TrueOrFalse;
                    break;
                case "FillInTheBlank":
                    type = QuestionType.FillInTheBlank;
                    break;
                default:
                    type = QuestionType.OneAnswer;
                    break;
            }

            Question question = new Question
            {
                QuizId = questionDTO.QuizId,
                Body = questionDTO.Body,
                Type = type,
                Points = questionDTO.Points
            };
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();
            questionDTO.Id = question.Id;
            return questionDTO;
        }

        public async Task<List<AnswerDTO>> GetQuestionAnswers(long id)
        {
            var answers = await _context.Answers.Where(a => a.QuestionId == id).ToListAsync();

            List<AnswerDTO> answersDTO = new List<AnswerDTO>();

            foreach (var a in answers)
            {
                answersDTO.Add(new AnswerDTO { Id = a.Id, AnswerBody = a.AnswerBody, IsTrue = a.IsTrue, QuestionId = a.QuestionId });
            }

            return answersDTO;
        }
    }
}
