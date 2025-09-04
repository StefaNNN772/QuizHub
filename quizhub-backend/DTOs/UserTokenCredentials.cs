using quizhub_backend.Models;

namespace quizhub_backend.DTOs
{
    public class UserTokenCredentials
    {
        public long Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public UserRole Role { get; set; }
        public string ProfileImage { get; set; }
    }
}
