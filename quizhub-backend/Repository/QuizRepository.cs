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

            var questions = await _context.Questions.Where(u => u.Id == id).ToArrayAsync();

            return new QuizDTO { Id = quiz.Id, Title = quiz.Title, Time = quiz.Time, Description = quiz.Description, Difficulty = quiz.Difficulty.ToString() };
        }
    }
}
