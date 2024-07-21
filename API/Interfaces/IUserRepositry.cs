using API.DTOs;

namespace API.interfaces;

public interface IUserRepositry
{
    void update(AppUser appUser);
    Task<bool> SaveAllAsync();
    Task<IEnumerable<AppUser>> GetUsersAsync();
    Task<AppUser?> GetUsersByIdAsync(int id);
    Task<AppUser?> GetUsersByUsernameAsync(string username);
    Task<IEnumerable<MemberDto>> GetMembersAsync();
    Task<MemberDto?> GetMemberAsync(string username);


}
