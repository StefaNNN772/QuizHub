using quizhub_backend.Models;
using System.ComponentModel.DataAnnotations;

namespace quizhub_backend.DTOs
{
    public class UserDTO
    {
        public long Id { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public UserRole Role { get; set; }

        public string ProfileImage { get; set; }
    }
}
