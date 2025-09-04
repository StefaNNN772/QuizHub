namespace quizhub_backend.DTOs
{
    public class UserTokenState
    {
        public string AccessToken { get; set; }
        public int ExpiresIn { get; set; }
        public UserTokenCredentials User { get; set; }
    }
}
