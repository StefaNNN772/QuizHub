using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quizhub_backend.Models
{
    public class Quiz
    {
        [Key]
        public long Id { get; set; }

        [ForeignKey("Topic")]
        public long TopicId { get; set; }
        public virtual Topic Topic { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public DifficultyEnum Difficulty { get; set; }

        [Required]
        public int Time { get; set; }
    }
}
