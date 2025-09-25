using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using quizhub_backend.Data;
using quizhub_backend.Repository;
using quizhub_backend.Services;
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
                ValidIssuer = "quizHubv1", // Isti kao APP_NAME u TokenService
                ValidAudience = "web", // Isti kao AUDIENCE_WEB u TokenService
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

        builder.Services.AddScoped<UserService>();
        builder.Services.AddScoped<UserRepository>();
        builder.Services.AddScoped<QuizService>();
        builder.Services.AddScoped<QuizRepository>();
        builder.Services.AddScoped<QuestionService>();
        builder.Services.AddScoped<QuestionRepository>();
        builder.Services.AddScoped<AnswerService>();
        builder.Services.AddScoped<AnswerRepository>();
        builder.Services.AddScoped<ResultService>();
        builder.Services.AddScoped<ResultRepository>();
        builder.Services.AddScoped<TopicService>();
        builder.Services.AddScoped<TopicRepository>();
        builder.Services.AddScoped<TokenService>();
        builder.Services.AddScoped<AuthenticationManager>();
        //builder.Services.AddScoped<EmailService>();
        //builder.Services.AddScoped<SchedulesRepository>();
        //builder.Services.AddScoped<SchedulesService>();
        //builder.Services.AddScoped<BusLinesRepository>();
        //builder.Services.AddScoped<BusLinesService>();
        //builder.Services.AddScoped<MapAPI>();
        //builder.Services.AddScoped<ProviderService>();
        //builder.Services.AddScoped<ProviderRepository>();
        //builder.Services.AddScoped<BusReservationRepository>();
        //builder.Services.AddScoped<BusReservationService>();
        //builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
        //builder.Services.AddScoped<FavouritesRepository>();
        //builder.Services.AddScoped<FavouritesService>();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
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