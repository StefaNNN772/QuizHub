using quizhub_backend.DTOs;

namespace quizhub_backend.Services.ServiceInterfaces
{
    public interface ITokenService
    {
        string GenerateToken(UserDTO user);
        int GetExpiresIn();
        UserTokenDTO DecodeToken(string token);
    }
}
