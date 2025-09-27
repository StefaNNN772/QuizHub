using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quizhub_backend.Models
{
    public class UserAnswer
    {
        [Key]
        public long Id { get; set; }

        [ForeignKey("User")]
        public long UserId { get; set; }
        public virtual User User { get; set; }

        [Required]
        public long ResultId { get; set; }

        [ForeignKey("Question")]
        public long QuestionId { get; set; }
        public virtual Question Question { get; set; }

        [Required]
        public string AnswerBody { get; set; }

        [Required]
        public bool IsTrue { get; set; }
    }
}
