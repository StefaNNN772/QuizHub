using Microsoft.EntityFrameworkCore;
using quizhub_backend.Data;
using quizhub_backend.DTOs;

namespace quizhub_backend.Repository
{
    public class TopicRepository
    {
        private readonly AppDbContext _context;

        public TopicRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<TopicDTO>> GetTopics()
        {
            var topicsDTO = await _context.Topics
                                    .GroupBy(t => t.About)
                                    .Select(g => new TopicDTO
                                    {
                                        Id = g.First().Id,
                                        About = g.Key,
                                        QuizId = g.First().QuizId
                                    })
                                    .ToListAsync();

            return topicsDTO;
        }
    }
}
