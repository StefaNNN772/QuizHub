using Microsoft.EntityFrameworkCore;
using quizhub_backend.Data;
using quizhub_backend.DTOs;
using quizhub_backend.Models;

namespace quizhub_backend.Repository
{
    public class ResultRepository
    {
        private readonly AppDbContext _context;

        public ResultRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ResultDTO> SaveUserResult(ResultDTO resultDTO)
        {
            Result userResult = new Result
            {
                QuizId = resultDTO.QuizId,
                UserId = resultDTO.UserId,
                MaxPoints = resultDTO.MaxPoints,
                Points = resultDTO.Points,
                DateOfPlay = DateTime.ParseExact(resultDTO.DateOfPlay, "o", null)
            };

            _context.Results.Add(userResult);
            await _context.SaveChangesAsync();

            resultDTO.Id = userResult.Id;

            return resultDTO;
        }

        public async Task<List<ResultDTO>> GetUserResults(long userId)
        {
            var userResults = await _context.Results.Where(r => r.UserId == userId)
                                                    .Include(q => q.Quiz)
                                                    .Include(u => u.User)
                                                    .ToListAsync();

            List<ResultDTO> resultsDTO = new List<ResultDTO>();

            foreach (var userResult in userResults)
            {
                resultsDTO.Add(new ResultDTO
                {
                    Id = userResult.Id,
                    DateOfPlay = userResult.DateOfPlay.ToString("o"),
                    MaxPoints = userResult.MaxPoints,
                    Points = userResult.Points,
                    UserId = userResult.UserId,
                    QuizId = userResult.QuizId,
                    Quiz = userResult.Quiz,
                    User = userResult.User
                });
            }

            return resultsDTO;
        }

        public async Task<List<ResultDTO>> GetResults()
        {
            var userResults = await _context.Results.Include(q => q.Quiz)
                                                    .Include(u => u.User)
                                                    .ToListAsync();

            List<ResultDTO> resultsDTO = new List<ResultDTO>();

            foreach (var userResult in userResults)
            {
                resultsDTO.Add(new ResultDTO
                {
                    Id = userResult.Id,
                    DateOfPlay = userResult.DateOfPlay.ToString("o"),
                    MaxPoints = userResult.MaxPoints,
                    Points = userResult.Points,
                    UserId = userResult.UserId,
                    QuizId = userResult.QuizId,
                    Quiz = userResult.Quiz,
                    User = userResult.User
                });
            }

            return resultsDTO;
        }

        public async Task<List<ResultDTO>> GetResultsLeaderboard(long? quizId = null, string period = null)
        {
            var userResults = await _context.Results.Include(q => q.Quiz)
                                                    .Include(u => u.User)
                                                    .ToListAsync();

            if (quizId != null)
            {
                userResults = userResults.Where(r => r.QuizId == quizId).ToList();
            }

            if (!string.IsNullOrEmpty(period))
            {
                if (period.Equals("This Week"))
                {
                    DateTime now = DateTime.Now.AddDays(-7);
                    userResults = userResults.Where(r => r.DateOfPlay >= now).ToList();
                }
                else if (period.Equals("This Month"))
                {
                    DateTime now = DateTime.Now.AddDays(-30);
                    userResults = userResults.Where(r => r.DateOfPlay >= now).ToList();
                }
            }

            Dictionary<Result, double> percentage = new Dictionary<Result, double>(userResults.Count);

            foreach (var userResult in userResults)
            {
                percentage.Add(userResult, Math.Round((userResult.Points / userResult.MaxPoints) * 100));
            }

            var sorted = percentage.OrderByDescending(x => x.Value)
                                    .ToDictionary(x => x.Key, x => x.Value);

            List<ResultDTO> resultsDTO = new List<ResultDTO>(userResults.Count());

            foreach (var userResult in sorted.Keys)
            {
                resultsDTO.Add(new ResultDTO
                {
                    Id = userResult.Id,
                    DateOfPlay = userResult.DateOfPlay.ToString("o"),
                    MaxPoints = userResult.MaxPoints,
                    Points = userResult.Points,
                    UserId = userResult.UserId,
                    QuizId = userResult.QuizId,
                    Quiz = userResult.Quiz,
                    User = userResult.User
                });
            }

            return resultsDTO;
        }

        public async Task<List<UserAnswerDTO>> GetUserAnswers(long id)
        {
            var userAnswers = await _context.UserAnswers.Where(u => u.ResultId == id).ToListAsync();

            List<UserAnswerDTO> userAnswersDTO = new List<UserAnswerDTO>();

            foreach (var userAnswer in userAnswers)
            {
                userAnswersDTO.Add(new UserAnswerDTO
                {
                    Id = userAnswer.Id,
                    AnswerBody = userAnswer.AnswerBody,
                    IsTrue = userAnswer.IsTrue,
                    QuestionId = userAnswer.QuestionId,
                    UserId = userAnswer.UserId
                });
            }

            return userAnswersDTO;
        }
    }
}
