namespace API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


[ServiceFilter(typeof(LogUserActivity))]
[ApiController]

[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{

}
