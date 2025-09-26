using Microsoft.AspNetCore.Mvc;
using quizhub_backend.Services;
using System.Security.Claims;

namespace quizhub_backend.Controllers
{
    [ApiController]
    [Route("/")]
    public class ResultController : ControllerBase
    {
        private readonly ResultService _resultService;

        public ResultController(ResultService resultService)
        {
            this._resultService = resultService;
        }

        [HttpGet("results/user")]
        [Produces("application/json")]
        public async Task<IActionResult> GetUserResults()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var resultsDTO = await _resultService.GetUserResults(int.Parse(userId));

                return Ok(resultsDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("results")]
        [Produces("application/json")]
        public async Task<IActionResult> GetResults()
        {
            try
            {
                var resultsDTO = await _resultService.GetResults();

                return Ok(resultsDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("results/leaderboard")]
        [Produces("application/json")]
        public async Task<IActionResult> GetResultsLeaderboard([FromQuery] long? quizId = null, [FromQuery] string? period = null)
        {
            try
            {
                var resultsDTO = await _resultService.GetResultsLeaderboard(quizId, period);

                return Ok(resultsDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
