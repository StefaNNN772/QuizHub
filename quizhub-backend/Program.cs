using Microsoft.EntityFrameworkCore;
using quizhub_backend.Data;
using quizhub_backend.Repository;
using quizhub_backend.Services;

public class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("FrontendDev", policy =>
            {
                policy
                    .WithOrigins("http://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
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
        //builder.Services.AddScoped<TokenService>();
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

        app.UseCors("FrontendDev");

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}