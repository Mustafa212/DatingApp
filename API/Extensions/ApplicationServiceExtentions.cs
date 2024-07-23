using API.Data;
using API.interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ApplicationServiceExtentions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<DataContext>(options =>
            options.UseSqlite(config.GetConnectionString("DefaultConnection")));

        services.AddControllers();
        services.AddCors();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IUserRepositry, UserRepository>();
        services.AddScoped<IPhotoService, PhotoServices>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
        return services;
    }
}
