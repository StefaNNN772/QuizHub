using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizhub_backend.Models
{
    public class Result
    {
        [Key]
        public long Id { get; set; }

        [ForeignKey("Quiz")]
        public long QuizId { get; set; }
        public virtual Quiz Quiz { get; set; }

        [ForeignKey("User")]
        public long UserId { get; set; }
        public virtual User User { get; set; }

        [Required]
        public DateTime DateOfPlay { get; set; }

        [Required]
        public double Points { get; set; } = 0;

        [Required]
        public double MaxPoints { get; set; } = 0;
    }
}
