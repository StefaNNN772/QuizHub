using Microsoft.EntityFrameworkCore;
using quizhub_backend.Data;
using quizhub_backend.DTOs;
using quizhub_backend.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace quizhub_backend.Repository
{
    public class QuizRepository
    {
        private readonly AppDbContext _context;

        public QuizRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<QuizDTO> CreateQuiz(QuizDTO quizDTO)
        {
            DifficultyEnum difficulty;

            switch (quizDTO.Difficulty)
            {
                case "Easy":
                    difficulty = DifficultyEnum.Easy;
                    break;
                case "Medium":
                    difficulty = DifficultyEnum.Medium;
                    break;
                case "Hard":
                    difficulty = DifficultyEnum.Hard;
                    break;
                default:
                    difficulty = DifficultyEnum.Easy;
                    break;
            }

            Quiz newQuiz = new Quiz
            {
                Title = quizDTO.Title,
                Description = quizDTO.Description,
                Time = quizDTO.Time,
                Difficulty = difficulty
            };

            _context.Quizes.Add(newQuiz);
            await _context.SaveChangesAsync();

            foreach (var topic in quizDTO.Topics)
            {
                Topic newTopic = new Topic
                {
                    About = topic,
                    QuizId = newQuiz.Id
                };

                _context.Topics.Add(newTopic);
                await _context.SaveChangesAsync();
            }

            quizDTO.Id = newQuiz.Id;

            return quizDTO;
        }

        public async Task<List<QuizDTO>> GetQuizzes(string search = null, string difficulty = null, string topic = null)
        {
            IQueryable<Quiz> quizzes = _context.Quizes;

            if (!string.IsNullOrEmpty(search))
            {
                var lowered = search.ToLower();
                quizzes = quizzes.Where(q =>
                    q.Title.ToLower().Contains(lowered) ||
                    q.Description.ToLower().Contains(lowered));
            }

            if (!string.IsNullOrEmpty(difficulty))
            {
                if (Enum.TryParse<DifficultyEnum>(difficulty, true, out var difficultyEnum))
                {
                    quizzes = quizzes.Where(q => q.Difficulty == difficultyEnum);
                }
            }

            var quizzesList = await quizzes.ToListAsync();

            List<QuizDTO> quizzesDto = new List<QuizDTO>();

            foreach (var q in quizzesList)
            {
                string[] topicList = await _context.Topics
                    .Where(t => t.QuizId == q.Id)
                    .Select(t => t.About)
                    .ToArrayAsync();

                quizzesDto.Add(new QuizDTO
                {
                    Id = q.Id,
                    Title = q.Title,
                    Description = q.Description,
                    Time = q.Time,
                    Difficulty = q.Difficulty.ToString(),
                    Topics = topicList
                });
            }

            // Filtriranje po temi
            if (!string.IsNullOrEmpty(topic))
            {
                quizzesDto = quizzesDto
                    .Where(q => q.Topics.Any(t => t.Equals(topic, StringComparison.OrdinalIgnoreCase)))
                    .ToList();
            }

            return quizzesDto;
        }

        public async Task<QuizDTO> GetQuizById(long id)
        {
            var quiz = await _context.Quizes.FirstOrDefaultAsync(u => u.Id == id);

            var questions = await _context.Questions.Where(q => q.QuizId == id).ToArrayAsync();

            var topics = await _context.Topics.Where(t => t.QuizId == id).Select(t => t.About).ToArrayAsync();

            return new QuizDTO { Id = quiz.Id, Title = quiz.Title, Time = quiz.Time, Description = quiz.Description, Difficulty = quiz.Difficulty.ToString(), Questions = questions, Topics = topics };
        }

        public async Task<bool> DeleteQuiz(long id)
        {
            var quiz = await _context.Quizes.FirstOrDefaultAsync(q => q.Id == id);

            if (quiz != null)
            {
                _context.Quizes.Remove(quiz);
                return await _context.SaveChangesAsync() > 0;
            }

            return false;
        }

        public async Task<QuizDTO> UpdateQuiz(long id, QuizDTO quizDTO)
        {
            var quiz = await _context.Quizes.FirstOrDefaultAsync(q => q.Id == id);

            DifficultyEnum difficulty;

            switch (quizDTO.Difficulty)
            {
                case "Easy":
                    difficulty = DifficultyEnum.Easy;
                    break;
                case "Medium":
                    difficulty = DifficultyEnum.Medium;
                    break;
                case "Hard":
                    difficulty = DifficultyEnum.Hard;
                    break;
                default:
                    difficulty = DifficultyEnum.Easy;
                    break;
            }

            if (quiz.Difficulty != difficulty)
            {
                quiz.Difficulty = difficulty;
            }

            if (!String.IsNullOrEmpty(quizDTO.Title))
            {
                quiz.Title = quizDTO.Title;
            }

            if (!String.IsNullOrEmpty(quizDTO.Description))
            {
                quiz.Description = quizDTO.Description;
            }

            if (quiz.Time != quizDTO.Time)
            {
                quiz.Time = quizDTO.Time;
            }

            _context.Quizes.Update(quiz);
            await _context.SaveChangesAsync();

            if (quizDTO.Topics.Count() != 0)
            {
                var topics = await _context.Topics.Where(t => t.QuizId == id).ToListAsync();

                _context.Topics.RemoveRange(topics);
                await _context.SaveChangesAsync();

                foreach (var topic in quizDTO.Topics)
                {
                    Topic newTopic = new Topic
                    {
                        About = topic,
                        QuizId = quiz.Id
                    };

                    _context.Topics.Add(newTopic);
                    await _context.SaveChangesAsync();
                }
            }

            quizDTO.Id = quiz.Id;

            return quizDTO;
        }
    }
}
