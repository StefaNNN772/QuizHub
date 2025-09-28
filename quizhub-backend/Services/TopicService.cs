using quizhub_backend.DTOs;
using quizhub_backend.Repository;
using quizhub_backend.Services.ServiceInterfaces;

namespace quizhub_backend.Services
{
    public class TopicService : ITopicService
    {
        private readonly TopicRepository _topicRepository;

        public TopicService(TopicRepository topicRepository)
        {
            this._topicRepository = topicRepository;
        }

        public async Task<List<TopicDTO>> GetTopics()
        {
            return await _topicRepository.GetTopics();
        }
    }
}
