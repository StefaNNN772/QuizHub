using Microsoft.AspNetCore.Mvc;
using quizhub_backend.DTOs;
using quizhub_backend.Services;
using quizhub_backend.Services.ServiceInterfaces;

namespace quizhub_backend.Controllers
{
    [ApiController]
    [Route("/")]
    public class TopicController : ControllerBase
    {
        private readonly ITopicService _topicService;

        public TopicController(ITopicService topicService)
        {
            this._topicService = topicService;
        }

        [HttpGet("/topics")]
        [Produces("application/json")]
        public async Task<IActionResult> GetTopics()
        {
            var topics = await _topicService.GetTopics();

            return Ok(topics);
        }
    }
}
