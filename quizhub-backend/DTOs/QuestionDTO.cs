using quizhub_backend.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizhub_backend.DTOs
{
    public class QuestionDTO
    {
        public long Id { get; set; }

        public long QuizId { get; set; }

        public string Body { get; set; }

        public string Type { get; set; }

        public double Points { get; set; }

        public Answer[]? Answers { get; set; }
    }
}
