using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quizhub_backend.Models
{
    public class Quiz
    {
        [Key]
        public long Id { get; set; }

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
