using Microsoft.EntityFrameworkCore;
using quizhub_backend.DTOs;
using quizhub_backend.Repository;
using quizhub_backend.Services.ServiceInterfaces;

namespace quizhub_backend.Services
{
    public class UserService : IUserService
    {
        private readonly UserRepository _userRepository;

        public UserService(UserRepository userRepository)
        {
            this._userRepository = userRepository;
        }

        public async Task<UserDTO> FindUserAsync(string email)
        {
            return await _userRepository.FindUserAsync(email);
        }

        public async Task<UserDTO> FindUserByEmailAsync(string email)
        {
            return await _userRepository.FindUserByEmailAsync(email);
        }

        public async Task<UserDTO> FindUserByUsernameAsync(string username)
        {
            return await _userRepository.FindUserByUsernameAsync(username);
        }

        public async Task<UserDTO> CreateUserAsync(UserDTO user)
        {
            return await _userRepository.CreateUserAsync(user);
        }

        public async Task<UserDTO> GetUserById(long id)
        {
            return await _userRepository.GetUserById(id);
        }
    }
}
