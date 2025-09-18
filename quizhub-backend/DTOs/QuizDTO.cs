using quizhub_backend.Models;
using System.ComponentModel.DataAnnotations;

namespace quizhub_backend.DTOs
{
    public class QuizDTO
    {
        public long Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string Difficulty { get; set; }

        public string[] Topics { get; set; }

        public int Time { get; set; }

        public Question[]? Questions { get; set; }
    }
}
