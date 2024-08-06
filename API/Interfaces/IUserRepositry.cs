using API.DTOs;
using API.Helpers;

namespace API.interfaces;

public interface IUserRepositry
{
    void update(AppUser appUser);
    Task<bool> SaveAllAsync();
    Task<IEnumerable<AppUser>> GetUsersAsync();
    Task<AppUser?> GetUsersByIdAsync(int id);
    Task<AppUser?> GetUsersByUsernameAsync(string username);
    Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
    Task<MemberDto?> GetMemberAsync(string username);


}
