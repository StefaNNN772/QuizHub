using quizhub_backend.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizhub_backend.DTOs
{
    public class TopicDTO
    {
        public long Id { get; set; }

        public long QuizId { get; set; }

        public string About { get; set; }
    }
}
