using quizhub_backend.DTOs;

namespace quizhub_backend.Services.ServiceInterfaces
{
    public interface IUserService
    {
        Task<UserDTO> FindUserAsync(string email);
        Task<UserDTO> FindUserByEmailAsync(string email);
        Task<UserDTO> FindUserByUsernameAsync(string username);
        Task<UserDTO> CreateUserAsync(UserDTO user);
        Task<UserDTO> GetUserById(long id);
    }
}
