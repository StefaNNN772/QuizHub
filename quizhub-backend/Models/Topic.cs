using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quizhub_backend.Models
{
    public class Topic
    {
        [Key]
        public long Id { get; set; }

        [ForeignKey("Quiz")]
        public long QuizId { get; set; }
        public virtual Quiz Quiz { get; set; }

        [Required]
        public string About { get; set; }
    }
}
