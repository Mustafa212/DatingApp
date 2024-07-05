using API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController(DataContext context) : BaseApiController
{
    [Authorize]
    [HttpGet("auth")]
    public ActionResult<string> GetAuth(){
        return "not authorized";
    }
    
    [HttpGet("not-found")]
    public ActionResult<AppUser> GetNotfound(){
        var any = context.Users.Find(-1);
        if (any == null)
        {
            return NotFound();
        }
        return any;
    }
    
    [HttpGet("server-error")]
    public ActionResult<AppUser> GetServerError(){
        var any = context.Users.Find(-1) ?? throw new Exception("No server found");
        return any;
    }
    
    [HttpGet("bad-request")]
    public ActionResult<string> GetBadRequest(){
        return BadRequest("wow");
    }
}
