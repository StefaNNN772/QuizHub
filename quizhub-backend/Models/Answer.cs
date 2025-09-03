using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quizhub_backend.Models
{
    public class Answer
    {
        [Key]
        public long Id { get; set; }

        [ForeignKey("Question")]
        public long QuestionId { get; set; }
        public virtual Question Question { get; set; }

        [Required]
        public bool IsTrue { get; set; }

        [Required]
        public string AnswerBody { get; set; }
    }
}
