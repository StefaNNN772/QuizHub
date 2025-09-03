using System.ComponentModel.DataAnnotations;

namespace quizhub_backend.Models
{
    public class Topic
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public string About { get; set; }
    }
}
