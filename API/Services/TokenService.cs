using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API;

public class TokenService(IConfiguration config , UserManager<AppUser> userManager) : ITokenService
{
    public async Task<string> CreateToken(AppUser user)
    {
       var tokenkey = config["TokenKey"] ?? throw new Exception("cannot access token key from appsetting") ;
       if(tokenkey.Length < 64) throw new Exception("your token key is small") ;

       var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenkey));

       if(user.UserName == null) throw new Exception("no username for user");
       var claims = new List<Claim>
       {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName)
       };

       var roles = await userManager.GetRolesAsync(user);
       claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role , role)));


       var creds = new SigningCredentials(key ,SecurityAlgorithms.HmacSha512Signature);

       var tokenDescriptor = new SecurityTokenDescriptor
       {
          Subject = new ClaimsIdentity(claims),
          Expires = DateTime.UtcNow.AddDays(7),
          SigningCredentials = creds

       };


       var tokenHandler = new JwtSecurityTokenHandler();

       var token = tokenHandler.CreateToken(tokenDescriptor);


       return tokenHandler.WriteToken(token);   
    }
}
