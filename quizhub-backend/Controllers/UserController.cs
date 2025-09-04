using Microsoft.AspNetCore.Mvc;
using quizhub_backend.DTOs;
using quizhub_backend.Models;
using quizhub_backend.Services;

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
                var jwt = _tokenService.GenerateToken(userDto.Email, userDto.Id, userDto.Role);
                var expiresIn = _tokenService.GetExpiresIn();

                return Ok(new UserTokenState
                {
                    AccessToken = jwt,
                    ExpiresIn = expiresIn,
                    User = new UserTokenCredentials
                    {
                        Id = userDto.Id,
                        Email = userDto.Email,
                        Role = userDto.Role,
                        Username = userDto.Username,
                        ProfileImage = userDto.ProfileImage
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
        public async Task<IActionResult> Register([FromForm] RegisterUserDTO user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var allowed = new[] { "image/jpeg", "image/png", "image/webp", "image/jpg" };

            if (!allowed.Contains(user.ProfileImage.ContentType))
                return BadRequest("Unsupproted image type.");

            var imgDir = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "profile-images");
            if (!Directory.Exists(imgDir))
                Directory.CreateDirectory(imgDir);

            var fileExt = Path.GetExtension(user.ProfileImage.FileName);
            var fileName = $"{Guid.NewGuid()}{fileExt}";
            var fullPath = Path.Combine(imgDir, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await user.ProfileImage.CopyToAsync(stream);
            }

            var imageUrl = $"/profile-images/{fileName}";

            var userDto = await _userService.FindUserByEmailAsync(user.Email);

            if (userDto != null)
            {
                return StatusCode(500, "User with this email already exists.");
            }

            var userDtoUsername = await _userService.FindUserByUsernameAsync(user.Username);

            UserDTO newUser = new UserDTO
            {
                Email = user.Email,
                Password = user.Password,
                Role = UserRole.User,
                Username = user.Username,
                ProfileImage = imageUrl
            };

            var createdUser = await _userService.CreateUserAsync(newUser);

            if (createdUser == null)
            {
                return StatusCode(500, "An error occurred while creating the user.");
            }


            // Generate JWT token
            var jwt = _tokenService.GenerateToken(createdUser.Email, createdUser.Id, UserRole.User);
            var expiresIn = _tokenService.GetExpiresIn();

            return Ok(new UserTokenState
            {
                AccessToken = jwt,
                ExpiresIn = expiresIn,
                User = new UserTokenCredentials
                {
                    Id = createdUser.Id,
                    Email = createdUser.Email,
                    Role = createdUser.Role,
                    Username = createdUser.Username,
                    ProfileImage = createdUser.ProfileImage
                }
            });
        }
    }
}
