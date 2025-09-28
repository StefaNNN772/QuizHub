namespace quizhub_backend.Services.ServiceInterfaces
{
    public interface IAuthenticationManager
    {
        Task<bool> AuthenticateAsync(string email, string password);
    }
}
