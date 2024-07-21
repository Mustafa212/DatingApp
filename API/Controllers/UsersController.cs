
using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers;

[Authorize]

public class UsersController(IUserRepositry userRepositry, IMapper mapper) : BaseApiController
{
    [HttpGet]
   public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers(){

    var users = await userRepositry.GetMembersAsync();


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

    var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if(username == null) return BadRequest("no username fonud in token");

    var user = await userRepositry.GetUsersByUsernameAsync(username);

    if(user == null) return BadRequest("user not found");

    mapper.Map(memberUpdateDto , user);

    if(await userRepositry.SaveAllAsync()){
        return NoContent();
    }

    return BadRequest("failed to update user"); 

   }


}
