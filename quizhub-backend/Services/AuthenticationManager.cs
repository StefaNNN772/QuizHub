using quizhub_backend.Repository;
using quizhub_backend.Services.ServiceInterfaces;

namespace quizhub_backend.Services
{
    public class AuthenticationManager : IAuthenticationManager
    {
        private readonly UserRepository _userRepository;


        public AuthenticationManager(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> AuthenticateAsync(string email, string password)
        {
            var user = await _userRepository.FindByEmailAsync(email);

            if (user == null)
            {
                return false;
            }

            if (BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                return true;
            }

            return true;
        }
    }
}
