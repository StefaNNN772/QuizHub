using Microsoft.EntityFrameworkCore;
using quizhub_backend.Data;
using quizhub_backend.DTOs;
using quizhub_backend.Models;

namespace quizhub_backend.Repository
{
    public class UserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserDTO> FindByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email || u.Username == email);

            if (user == null)
            {
                return null;
            }

            return new UserDTO { Email = user.Email, Password = user.Password };
        }

        public async Task<UserDTO> FindUserAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email || u.Username == email);

            if (user == null)
            {
                return null;
            }

            return new UserDTO { Email = user.Email, Id = user.Id, Password = user.Password, Role = user.Role, Username = user.Username, ProfileImage = user.ProfileImage};
        }

        public async Task<UserDTO> FindUserByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return null;
            }

            return new UserDTO { Email = user.Email, Id = user.Id, Password = user.Password, Role = user.Role, Username = user.Username, ProfileImage = user.ProfileImage };
        }

        public async Task<UserDTO> FindUserByUsernameAsync(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                return null;
            }

            return new UserDTO { Email = user.Email, Id = user.Id, Password = user.Password, Role = user.Role, Username = user.Username, ProfileImage = user.ProfileImage };
        }

        public async Task<UserDTO> CreateUserAsync(UserDTO user)
        {
            User userDTO = new User
            {
                Email = user.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(user.Password),
                Role = UserRole.User,
                Username = user.Username,
                ProfileImage = user.ProfileImage,
            };
            _context.Users.Add(userDTO);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}
