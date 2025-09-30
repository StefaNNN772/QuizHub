using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using quizhub_backend.Data;
using quizhub_backend.Repository;
using quizhub_backend.Services;
using quizhub_backend.Services.ServiceInterfaces;
using System.Text;

public class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = "quizHubv1",
                ValidAudience = "web",
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes("ThisIsAVeryLongSecretKeyThatIsAtLeast64BytesLongForHmacSha512_ExtraPaddingFor512Bits#2025!"))
            };
        });

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("FrontendDev", policy =>
            {
                policy
                    .WithOrigins("http://localhost:3000")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(connectionString));

        builder.Services.AddHttpClient();

        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<UserRepository>();
        builder.Services.AddScoped<IQuizService, QuizService>();
        builder.Services.AddScoped<QuizRepository>();
        builder.Services.AddScoped<IQuestionService, QuestionService>();
        builder.Services.AddScoped<QuestionRepository>();
        builder.Services.AddScoped<IAnswerService, AnswerService>();
        builder.Services.AddScoped<AnswerRepository>();
        builder.Services.AddScoped<IResultService, ResultService>();
        builder.Services.AddScoped<ResultRepository>();
        builder.Services.AddScoped<ITopicService, TopicService>();
        builder.Services.AddScoped<TopicRepository>();
        builder.Services.AddScoped<ITokenService, TokenService>();
        builder.Services.AddScoped<IAuthenticationManager, AuthenticationManager>();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseCors("FrontendDev");

        app.UseStaticFiles();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}