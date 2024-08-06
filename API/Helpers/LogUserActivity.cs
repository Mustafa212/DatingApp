using API.interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API;

public class LogUserActivity : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultedContext = await next();

        if(context.HttpContext.User.Identity?.IsAuthenticated != true) return;

        var userId = context.HttpContext.User.GetUserId();

        var repo = resultedContext.HttpContext.RequestServices.GetRequiredService<IUserRepositry>();

        var user = await repo.GetUsersByIdAsync(userId);

        if (user == null)
        {
            return;
        }

        user.LastActive = DateTime.UtcNow;
        await repo.SaveAllAsync();
    }
}
