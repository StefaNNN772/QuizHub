using Microsoft.AspNetCore.Mvc;
using quizhub_backend.DTOs;
using quizhub_backend.Services;
using quizhub_backend.Services.ServiceInterfaces;

namespace quizhub_backend.Controllers
{
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionService _questionService;

        public QuestionController(IQuestionService questionService)
        {
            this._questionService = questionService;
        }

        [HttpGet("quizzes/{id}/questions")]
        [Produces("application/json")]
        public async Task<IActionResult> GetQuestions(long id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var questions = await _questionService.GetQuestions(id);

                return Ok(questions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("questions")]
        [Produces("application/json")]
        public async Task<IActionResult> CreateQuestion([FromBody]QuestionDTO questionDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var question = await _questionService.CreateQuestion(questionDTO);

                return Ok(question);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("questions/{id}/answers")]
        [Produces("application/json")]
        public async Task<IActionResult> GetQuestionAnswers(long id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var answersDTO = await _questionService.GetQuestionAnswers(id);

                return Ok(answersDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("questions/{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> DeleteQuestion(long id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _questionService.DeleteQuestion(id);

                if (!result)
                {
                    return StatusCode(500, "Question was not deleted.");
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("questions/{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> UpdateQuestion(long id, [FromBody] QuestionDTO questionDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if ((!String.IsNullOrEmpty(questionDTO.Body) && questionDTO.Body.Length > 200) || (questionDTO.Points < 1 || questionDTO.Points > 10))
            {
                return BadRequest();
            }

            var result = await _questionService.UpdateQuestion(id, questionDTO);

            return Ok(result);
        }
    }
}
