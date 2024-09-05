
using System.Security.Cryptography;
using System.Text;
using API.Data;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(UserManager<AppUser> userManager , ITokenService tokenService , IMapper mapper) :BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto){



        if(await UserExists(registerDto.Username)) return BadRequest("User name taken :(");
        // using var hmac =  new HMACSHA512();
        var user  = mapper.Map<AppUser>(registerDto);
        user.UserName = registerDto.Username;
        // user.PasswrodHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
        // user.PasswrodSalt = hmac.Key;

       

        // context.Users.Add(user);
        // await context.SaveChangesAsync();

        var result = await userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded) return BadRequest(result.Errors);
        

        return new UserDto
        {
            Username = user.UserName,
            Token = await tokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };

    }

     [HttpPost("login")]
     public async Task<ActionResult<UserDto>> Login(LoginDto loginDto){

        var user = await userManager.Users
        .Include(p=> p.Photos)
        .FirstOrDefaultAsync(x => x.NormalizedUserName == loginDto.Username.ToUpper());

        if(user == null || user.UserName == null) return Unauthorized("invalid username :(");

        // using var hmac = new HMACSHA512(user.PasswrodSalt);

        // var ComputedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        // for (int i = 0; i < ComputedHash.Length; i++)
        // {
        //     if(ComputedHash[i] != user.PasswrodHash[i]) return Unauthorized("password is invalid :(");
        // }

        var result = await userManager.CheckPasswordAsync(user,loginDto.Password);
        if(!result) return Unauthorized("password is invalid :(");

        return new UserDto
        {
            Username = user.UserName,
            Token = await tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x=>x.IsMain)?.Url,
            KnownAs = user.KnownAs,
            Gender = user.Gender


        };

     }





    private async Task<bool> UserExists(string Username){



        return await userManager.Users.AnyAsync(x=> x.NormalizedUserName == Username.ToUpper());
    }
}
