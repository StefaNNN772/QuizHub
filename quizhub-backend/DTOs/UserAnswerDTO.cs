namespace quizhub_backend.DTOs
{
    public class UserAnswerDTO
    {
        public long Id { get; set; }

        public long UserId { get; set; }

        public long ResultId { get; set; }

        public long QuestionId { get; set; }

        public string AnswerBody { get; set; }

        public bool IsTrue { get; set; }
    }
}
