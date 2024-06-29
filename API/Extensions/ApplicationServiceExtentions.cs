using API.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ApplicationServiceExtentions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<DataContext>(options =>
            options.UseSqlite("Data source = dating.db"));

        services.AddControllers();
        services.AddCors();
        services.AddScoped<ITokenService, TokenService>();

        return services;
    }
}
