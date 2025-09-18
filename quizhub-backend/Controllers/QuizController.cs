using Microsoft.AspNetCore.Mvc;
using quizhub_backend.DTOs;
using quizhub_backend.Services;

namespace quizhub_backend.Controllers
{
    [ApiController]
    [Route("/")]
    public class QuizController : ControllerBase
    {
        private readonly QuizService _quizService;

        public QuizController(QuizService quizService)
        {
            this._quizService = quizService;
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
    }
}
