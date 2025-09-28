using Microsoft.IdentityModel.Tokens;
using quizhub_backend.DTOs;
using quizhub_backend.Models;
using quizhub_backend.Services.ServiceInterfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace quizhub_backend.Services
{
    public class TokenService : ITokenService
    {
        private string APP_NAME = "quizHubv1";  // Izdavač tokena
        private string SECRET = "ThisIsAVeryLongSecretKeyThatIsAtLeast64BytesLongForHmacSha512_ExtraPaddingFor512Bits#2025!";
        private int EXPIRES_IN = 180000;  // Period važenja tokena u sekundama (50 sati)
        private string AUTH_HEADER = "Authorization";

        private static readonly string AUDIENCE_WEB = "web";
        private static readonly string SIGNATURE_ALGORITHM = SecurityAlgorithms.HmacSha512;

        public string GenerateToken(UserDTO user)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SECRET));
            var creds = new SigningCredentials(key, SIGNATURE_ALGORITHM);

            var token = new JwtSecurityToken(
                issuer: APP_NAME,
                audience: AUDIENCE_WEB,
                claims: claims,
                expires: GenerateExpirationDate(),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private DateTime GenerateExpirationDate()
        {
            return DateTime.UtcNow.AddSeconds(EXPIRES_IN);
        }

        public int GetExpiresIn()
        {
            return EXPIRES_IN;
        }

        public UserTokenDTO DecodeToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();

            if (!handler.CanReadToken(token))
            {
                throw new ArgumentException("Invalid token");
            }

            var jwtToken = handler.ReadJwtToken(token);

            var userId = Int32.Parse(jwtToken?.Claims?.FirstOrDefault(c => c.Type == "id")?.Value);
            var email = jwtToken?.Claims?.FirstOrDefault(c => c.Type == "sub")?.Value;

            return new UserTokenDTO { Id = userId, Email = email };
        }
    }
}
