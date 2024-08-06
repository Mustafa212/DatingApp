using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;

[Authorize]

public class UsersController(IUserRepositry userRepositry, IMapper mapper , IPhotoService photoService) : BaseApiController
{
    [HttpGet]
   public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams){

    userParams.CurrentUserName = User.GetUsername();
    var users = await userRepositry.GetMembersAsync(userParams);
    Response.AddPaginationHeaders(users);

    return Ok(users);
   }

   [HttpGet("{username}")]
   public async Task<ActionResult<MemberDto>> GetUser(string username){

    var user = await userRepositry.GetMemberAsync(username);

    if(user == null ) return NotFound(); 

    return user;


   }

   [HttpPut]
   public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto){



    var user = await userRepositry.GetUsersByUsernameAsync(User.GetUsername());

    if(user == null) return BadRequest("user not found");

    mapper.Map(memberUpdateDto , user);

    if(await userRepositry.SaveAllAsync()){
        return NoContent();
    }

    return BadRequest("failed to update user"); 

   }



   [HttpPost("add-photo")]
   public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file){
        var user = await userRepositry.GetUsersByUsernameAsync(User.GetUsername());

        if (user == null)
        {
            return BadRequest("cannot update photos");
        }
        var result = await photoService.AddPhotoAsync(file);
        if (result.Error !=null)
        {
             return BadRequest(result.Error.Message);
        }
        var photo = new Photo{
            Url= result.SecureUrl.AbsoluteUri,
            PublicId=result.PublicId
        };

        if (user.Photos.Count ==0)
        {
            photo.IsMain = true;
        }
        user.Photos.Add(photo);
        if (await userRepositry.SaveAllAsync())
        {
            return CreatedAtAction(nameof(GetUser),new {username = user.UserName}, mapper.Map<PhotoDto>(photo));
        }
        return BadRequest("proplem heappend during adding photo");
   }


    [HttpPut("set-main-photo/{photoId:int}")]
    public async Task<ActionResult> setMainPhoto(int photoId){
        var user = await userRepositry.GetUsersByUsernameAsync(User.GetUsername());
        if (user == null)
        {
            return BadRequest("cannot find user");
        }


        var photo = user.Photos.FirstOrDefault(x =>x.Id == photoId);
        if (photo == null || photo.IsMain){
           return BadRequest("cannot use this as main photo");

        }

        var currentMain = user.Photos.FirstOrDefault(x =>x.IsMain);
        if (currentMain != null) currentMain.IsMain = false;

        photo.IsMain =true;


        if (await userRepositry.SaveAllAsync())
        {
            return NoContent();
        }
        return BadRequest("proplem heappend during setting   photo main");


    }


    [HttpDelete("delete-photo/{photoId:int}")]
    public async Task<ActionResult> DeletePhoto(int photoId){
        var user =  await userRepositry.GetUsersByUsernameAsync(User.GetUsername());
        if (user == null)
        {
            return BadRequest("cannot find user");
        }
        var photo = user.Photos.FirstOrDefault(x =>x.Id == photoId);
        if (photo == null || photo.IsMain){
           return BadRequest("cannot delete this photo");

        }
        if (photo.PublicId!=null)
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
             if (result.Error !=null)
            {
                return BadRequest(result.Error.Message);
            }
        }
        user.Photos.Remove(photo);
        if (await userRepositry.SaveAllAsync())
        {
            return Ok();
        }
        return BadRequest("proplem heappend during deleting photo");


    }


}
