using Microsoft.EntityFrameworkCore;
using quizhub_backend.Models;

namespace quizhub_backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Quiz> Quizes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<Result> Results { get; set; }
        public DbSet<UserAnswer> UserAnswers { get; set; }
    }
}
