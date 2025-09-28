using Microsoft.AspNetCore.Mvc;
using quizhub_backend.DTOs;
using quizhub_backend.Services;
using quizhub_backend.Services.ServiceInterfaces;

namespace quizhub_backend.Controllers
{
    [ApiController]
    [Route("/")]
    public class AnswerController : ControllerBase
    {
        private readonly IAnswerService _answerService;

        public AnswerController(IAnswerService answerService)
        {
            this._answerService = answerService;
        }

        [HttpPost("answers")]
        [Produces("application/json")]
        public async Task<IActionResult> AddAnswer([FromBody] AnswerDTO answerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var answer = await _answerService.AddAnswer(answerDto);

            return Ok(answerDto);
        }

        [HttpDelete("answers/{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> DeleteAnswer(long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var answer = await _answerService.DeleteAnswer(id);

            if (!answer)
            {
                return StatusCode(500, "Answer was not deleted");
            }

            return Ok();
        }

        [HttpPut("answers/{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> UpdateAnswer([FromBody] AnswerDTO answerDTO, long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            answerDTO.Id = id;

            var answer = await _answerService.UpdateAnswer(answerDTO);

            if (!answer)
            {
                return StatusCode(500, "Answer was not updated");
            }

            return Ok(answerDTO);
        }
    }
}
