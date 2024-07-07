using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(DataContext Context){
        if (await Context.Users.AnyAsync())
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


        foreach (var user in users)
        {
            using var hmac = new HMACSHA512();
            user.UserName = user.UserName.ToLower();
            user.PasswrodHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
            user.PasswrodSalt = hmac.Key;
            Context.Users.Add(user);
        }
        await Context.SaveChangesAsync();

        

    }
}
