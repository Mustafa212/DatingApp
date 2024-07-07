
using API.Data;
using API.DTOs;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers;

[Authorize]

public class UsersController(IUserRepositry userRepositry) : BaseApiController
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


}
