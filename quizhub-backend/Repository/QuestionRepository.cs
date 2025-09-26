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
            var questions = await _context.Questions.Where(u => u.QuizId == id).ToListAsync();

            List<QuestionDTO> questionsDTO = new List<QuestionDTO>();

            foreach (var q in questions)
            {
                var answers = await _context.Answers.Where(a => a.QuestionId == q.Id).ToArrayAsync();

                questionsDTO.Add(new QuestionDTO { Id = q.Id, QuizId = q.QuizId, Body = q.Body, Type = q.Type.ToString(), Points = q.Points, Answers = answers });
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

        public async Task<bool> DeleteQuestion(long id)
        {
            var question = await _context.Questions.FirstOrDefaultAsync(q => q.Id == id);

            if (question != null)
            {
                _context.Questions.Remove(question);
                return await _context.SaveChangesAsync() > 0;
            }

            return false;
        }

        public async Task<QuestionDTO> UpdateQuestion(long id, QuestionDTO questionDTO)
        {
            var question = await _context.Questions.Where(q => q.Id == id).FirstOrDefaultAsync();

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

            if (question.Type != type)
            {
                question.Type = type;
            }

            if (!String.IsNullOrEmpty(questionDTO.Body) && !question.Body.Equals(questionDTO.Body))
            {
                question.Body = questionDTO.Body;
            }

            if (question.Points != questionDTO.Points)
            {
                question.Points = questionDTO.Points;
            }

            _context.Questions.Update(question);
            await _context.SaveChangesAsync();

            var answers = await _context.Answers.Where(a => a.QuestionId == id).ToArrayAsync();

            questionDTO.Answers = answers;
            questionDTO.Id = question.Id;

            return questionDTO;
        }
    }
}
