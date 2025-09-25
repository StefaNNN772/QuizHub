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

        public async Task<bool> SaveUserResult(ResultDTO resultDTO)
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
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
