using API.DTOs;
using API.Helpers;
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

    public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
    {
       var query= context.Users.AsQueryable();

       query = query.Where(x=>x.UserName != userParams.CurrentUserName);
       if(userParams.Gender != null){
            query = query.Where(x=>x.Gender == userParams.Gender);
       }

        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.maxAge -1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.minAge));

        query = query.Where(x=> x.DateOfBirth >= minDob && x.DateOfBirth<= maxDob);


        query = userParams.OrderBy switch{
            "created" => query.OrderByDescending(x=>x.Created),
            _ => query.OrderByDescending(x=>x.LastActive)
        };
       return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(mapper.ConfigurationProvider) , userParams.PageNumber ,userParams.PageSize); 

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
