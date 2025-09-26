using quizhub_backend.Models;

namespace quizhub_backend.DTOs
{
    public class ResultDTO
    {
        public long Id { get; set; }
        public long QuizId { get; set; }
        public long UserId { get; set; }
        public string DateOfPlay { get; set; }
        public double Points { get; set; }
        public double MaxPoints { get; set; }
        public Quiz? Quiz { get; set; }
        public User? User { get; set; }
    }
}
