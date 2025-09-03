using quizhub_backend.Data;

namespace quizhub_backend.Repository
{
    public class QuizRepository
    {
        private readonly AppDbContext _context;

        public QuizRepository(AppDbContext context)
        {
            _context = context;
        }
    }
}
