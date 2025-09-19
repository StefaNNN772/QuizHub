using Microsoft.AspNetCore.Mvc;
using quizhub_backend.DTOs;
using quizhub_backend.Models;
using quizhub_backend.Services;
using System.Security.Claims;

namespace quizhub_backend.Controllers
{
    [ApiController]
    [Route("/")]
    public class QuizController : ControllerBase
    {
        private readonly QuizService _quizService;
        private readonly AnswerService _answerService;

        public QuizController(QuizService quizService, AnswerService answerService)
        {
            this._quizService = quizService;
            _answerService = answerService;
        }

        [HttpPost("quizzes")]
        [Produces("application/json")]
        public async Task<IActionResult> CreateQuiz([FromBody]QuizDTO quizDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (quizDto.Title.Length > 100 || quizDto.Description.Length > 150 || 
                (quizDto.Time < 1 || quizDto.Time > 120) || quizDto.Topics.Count() == 0)
            {
                return BadRequest();
            }

            var result = await _quizService.CreateQuiz(quizDto);

            return Ok(quizDto);
        }

        [HttpGet("quizzes")]
        [Produces("application/json")]
        public async Task<IActionResult> GetQuizzes([FromQuery] string? search = null, [FromQuery] string? difficulty = null, [FromQuery] string? topic = null)
        {
            try
            {
                var quizzes = await _quizService.GetQuizzes(search, difficulty, topic);

                return Ok(quizzes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("quizzes/{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetQuizById(long id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var quiz = await _quizService.GetQuizById(id);

                return Ok(quiz);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("quizzes/{id}/submit")]
        [Produces("application/json")]
        public async Task<IActionResult> SubmitQuizAnswers([FromBody] SubmitAnswersDTO answersDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                List<UserAnswerDTO> userAnswersDTO = new List<UserAnswerDTO>();

                foreach (var answer in answersDTO.Answers)
                {
                    var questionAnswers = await _answerService.GetAnswers(answer.QuestionId);

                    if (questionAnswers[0].QuestionDTO.Type == QuestionType.TrueOrFalse)
                    {
                        var trueAnswer = questionAnswers.Where(a => a.IsTrue == true).FirstOrDefault();

                        if (trueAnswer.Equals(answer.AnswerBody))
                        {
                            userAnswersDTO.Add(new UserAnswerDTO { AnswerBody = answer.AnswerBody, QuestionId = answer.QuestionId, UserId = int.Parse(userId), IsTrue = true });
                        }

                        userAnswersDTO.Add(new UserAnswerDTO { AnswerBody = answer.AnswerBody, QuestionId = answer.QuestionId, UserId = int.Parse(userId), IsTrue = false });
                    }
                    else if (questionAnswers[0].QuestionDTO.Type == QuestionType.FillInTheBlank)
                    {

                    }
                    else if (questionAnswers[0].QuestionDTO.Type == QuestionType.MultipleAnswer)
                    {

                    }
                    else
                    {

                    }
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
