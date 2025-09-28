using quizhub_backend.DTOs;

namespace quizhub_backend.Services.ServiceInterfaces
{
    public interface ITopicService
    {
        Task<List<TopicDTO>> GetTopics();
    }
}
