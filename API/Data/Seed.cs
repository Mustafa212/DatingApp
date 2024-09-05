using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager , RoleManager<AppRole> roleManager){
        if (await userManager.Users.AnyAsync())
        {
            return;
        }
        var userdata = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var options =  new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

        var users = JsonSerializer.Deserialize<List<AppUser>>(userdata,options);

        if (users == null)
        {
            return;
        }

        var roles = new List<AppRole>{
            new() {Name = "Member"},
            new() {Name = "Admin"},
            new() {Name = "Moderator"},
        };


        foreach (var role in roles){
            await roleManager.CreateAsync(role);
        }

        foreach (var user in users)
        {
            // using var hmac = new HMACSHA512();
            // user.UserName = user.UserName.ToLower();
            // user.PasswrodHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
            // user.PasswrodSalt = hmac.Key;
            // Context.Users.Add(user);

            user.UserName = user.UserName!.ToLower();
            await userManager.CreateAsync(user , "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Member");
        }

        var admin = new AppUser{
            UserName = "admin",
            KnownAs = "Admin",
            Gender = "",
            City = "",
            Country = "",
        };

        // await Context.SaveChangesAsync();
        await userManager.CreateAsync(admin , "Pa$$w0rd");
        await userManager.AddToRolesAsync(admin, ["Admin", "Moderator"]);

        

    }
}
