using quizhub_backend.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizhub_backend.DTOs
{
    public class AnswerDTO
    {
        public long Id { get; set; }

        public long QuestionId { get; set; }

        public bool IsTrue { get; set; }

        public string AnswerBody { get; set; }
    }
}
