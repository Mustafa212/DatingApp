
using System.Security.Cryptography;
using System.Text;
using API.Data;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(DataContext context , ITokenService tokenService , IMapper mapper) :BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto){



        if(await UserExists(registerDto.Username)) return BadRequest("User name taken :(");
        using var hmac =  new HMACSHA512();
        var user  = mapper.Map<AppUser>(registerDto);
        user.UserName = registerDto.Username;
        user.PasswrodHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
        user.PasswrodSalt = hmac.Key;

       

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return new UserDto
        {
            Username = user.UserName,
            Token = tokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };

    }

     [HttpPost("login")]
     public async Task<ActionResult<UserDto>> Login(LoginDto loginDto){

        var user = await context.Users
        .Include(p=> p.Photos)
        .FirstOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());

        if(user == null) return Unauthorized("invalid username :(");

        using var hmac = new HMACSHA512(user.PasswrodSalt);

        var ComputedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (int i = 0; i < ComputedHash.Length; i++)
        {
            if(ComputedHash[i] != user.PasswrodHash[i]) return Unauthorized("password is invalid :(");
        }

        return new UserDto
        {
            Username = user.UserName,
            Token = tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x=>x.IsMain)?.Url,
            KnownAs = user.KnownAs,
            Gender = user.Gender


        };

     }





    private async Task<bool> UserExists(string Username){



        return await context.Users.AnyAsync(x=> x.UserName.ToLower() == Username.ToLower());
    }
}
