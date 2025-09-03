using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quizhub_backend.Models
{
    public class Question
    {
        [Key]
        public long Id { get; set; }

        [ForeignKey("Quiz")]
        public long QuizId { get; set; }
        public virtual Quiz Quiz { get; set; }

        [Required]
        public string Body { get; set; }

        [Required]
        public QuestionType Type { get; set; }
    }
}
