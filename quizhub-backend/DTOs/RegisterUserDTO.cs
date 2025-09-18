using quizhub_backend.Models;

namespace quizhub_backend.DTOs
{
    public class RegisterUserDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Username { get; set; }
        public string ProfileImage { get; set; }
        public string Role { get; set; }
    }
}
