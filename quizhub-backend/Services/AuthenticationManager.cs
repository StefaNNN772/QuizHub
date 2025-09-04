using quizhub_backend.Repository;

namespace quizhub_backend.Services
{
    public class AuthenticationManager
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
