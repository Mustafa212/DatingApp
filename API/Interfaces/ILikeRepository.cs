using System;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface ILikeRepository
{
    Task<UserLike?> GetUserLikeAync(int sourceUserId , int targetUserId);


    Task<PagedList<MemberDto>> GetUserLikesAync(LikesParams likesParams );
    Task<IEnumerable<int>> GetCurrentUserLikeIdsAync(int currentUserId );

    void DeleteLike(UserLike like);
    void AddLike(UserLike like);

    Task<bool> SaveChangesAync();
}
