using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using quizhub_backend.DTOs;
using quizhub_backend.Models;
using quizhub_backend.Repository;
using quizhub_backend.Services;
using System.Security.Claims;

namespace quizhub_backend.Controllers
{
    [ApiController]
    [Route("/")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly TokenService _tokenService;
        private readonly AuthenticationManager _authenticationManager;
        private readonly IWebHostEnvironment _env;

        public UserController(UserService userService, TokenService tokenService, AuthenticationManager authenticationManager, IWebHostEnvironment env)
        {
            this._userService = userService;
            this._tokenService = tokenService;
            this._authenticationManager = authenticationManager;
            this._env = env;
        }

        [HttpPost("auth/login")]
        [Produces("application/json")]
        public async Task<IActionResult> Login([FromBody] UserCredentials credentials)
        {
            var authenticationResult = await _authenticationManager.AuthenticateAsync(credentials.Username, credentials.Password);

            if (authenticationResult)
            {
                var userDto = await _userService.FindUserAsync(credentials.Username);

                if (userDto == null)
                {
                    return StatusCode(500, "User not found.");
                }

                // Generate JWT token
                var jwt = _tokenService.GenerateToken(userDto);
                var expiresIn = _tokenService.GetExpiresIn();

                return Ok(new
                {
                    token = jwt,
                    user = new
                    {
                        id = userDto.Id,
                        email = userDto.Email,
                        role = userDto.Role.ToString(),
                        username = userDto.Username,
                        profileImage = userDto.ProfileImage
                    }
                });
            }
            else
            {
                return StatusCode(500, "Invalid credentials.");
            }
        }

        [HttpPost("auth/register")]
        [Produces("application/json")]
        [RequestSizeLimit(5_000_000)]
        public async Task<IActionResult> Register([FromBody] RegisterUserDTO user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            byte[] imageBytes = Convert.FromBase64String(user.ProfileImage);

            string fileName = $"{Guid.NewGuid()}.jpg";
            string filePath = Path.Combine("wwwroot", "profileImages", fileName);

            Directory.CreateDirectory(Path.GetDirectoryName(filePath));

            await System.IO.File.WriteAllBytesAsync(filePath, imageBytes);

            var userDto = await _userService.FindUserByEmailAsync(user.Email);

            if (userDto != null)
            {
                return StatusCode(500, "User with this email already exists.");
            }

            var userDtoUsername = await _userService.FindUserByUsernameAsync(user.Username);

            if (userDtoUsername != null)
            {
                return StatusCode(500, "User with this username already exists.");
            }

            UserDTO newUser = new UserDTO
            {
                Email = user.Email,
                Password = user.Password,
                Role = UserRole.User,
                Username = user.Username,
                ProfileImage = $"/profileImages/{fileName}"
            };

            var createdUser = await _userService.CreateUserAsync(newUser);

            if (createdUser == null)
            {
                return StatusCode(500, "An error occurred while creating the user.");
            }


            // Generate JWT token
            var jwt = _tokenService.GenerateToken(createdUser);
            var expiresIn = _tokenService.GetExpiresIn();

            return Ok(new
            {
                token = jwt,
                user = new
                {
                    id = createdUser.Id,
                    email = createdUser.Email,
                    role = createdUser.Role.ToString(),
                    username = createdUser.Username,
                    profileImage = createdUser.ProfileImage
                }
            });
        }

        [Authorize]
        [HttpGet("auth/me")]
        [Produces("application/json")]
        public async Task<IActionResult> GetCurrentUser()
        {
            // Token je već verifikovan kroz [Authorize] atribut
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _userService.GetUserById(int.Parse(userId));

            if (user == null)
                return NotFound();

            string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            return Ok(new
            {
                token = token,
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    role = user.Role.ToString(),
                    username = user.Username,
                    profileImage = user.ProfileImage
                }
            });
        }
    }
}
