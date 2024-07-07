using API.DTOs;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserRepository(DataContext context , IMapper mapper) : IUserRepositry
{
    public async Task<MemberDto?> GetMemberAsync(string username)
    {
        return await context.Users.Where(x=>x.UserName == username).ProjectTo<MemberDto>(mapper.ConfigurationProvider).SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<MemberDto>> GetMembersAsync()
    {
        return await context.Users.ProjectTo<MemberDto>(mapper.ConfigurationProvider).ToListAsync();
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        return await context.Users.Include(x=>x.Photos).ToListAsync();
    }

    public async Task<AppUser?> GetUsersByIdAsync(int id)
    {
        return await context.Users.FindAsync(id);
    }

    public async Task<AppUser?> GetUsersByUsernameAsync(string username)
    {
        return await context.Users.Include(x=>x.Photos).SingleOrDefaultAsync(x => x.UserName == username);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync()>0;
    }

    public  void update(AppUser appUser)
    {
        context.Entry(appUser).State = EntityState.Modified;
    }
}
