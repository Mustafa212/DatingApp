using System;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikeRepository(DataContext context, IMapper mapper) : ILikeRepository
{
    public void AddLike(UserLike like)
    {
        context.Likes.Add(like);
    }

    public void DeleteLike(UserLike like)
    {
        context.Likes.Remove(like);
    }

    public async Task<IEnumerable<int>> GetCurrentUserLikeIdsAync(int currentUserId)
    {
        return await context.Likes
                .Where(like => like.SourceUserId == currentUserId)
                .Select(x => x.TargetUserId)
                .ToListAsync();
    }

    public async Task<UserLike?> GetUserLikeAync(int sourceUserId, int targetUserId)
    {
        return await context.Likes.FindAsync(sourceUserId, targetUserId);
    }

    public async Task<PagedList<MemberDto>> GetUserLikesAync(LikesParams likesParams)
    {
        var likes = context.Likes.AsQueryable();
        IQueryable<MemberDto> query;
        switch (likesParams.Predicate)
        {
            case "liked":
                query = likes
                    .Where(x => x.SourceUserId == likesParams.UserId)
                    .Select(x => x.TargetUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider);
                break;
            case "likedBy":
                query = likes
                    .Where(x => x.TargetUserId == likesParams.UserId)
                    .Select(x => x.SourceUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider);
                break;
            default:
                var likedIds = await GetCurrentUserLikeIdsAync(likesParams.UserId);

                query = likes
                    .Where(x => x.TargetUserId == likesParams.UserId && likedIds.Contains(x.SourceUserId))
                    .Select(x => x.SourceUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider);
                break;
        }


        return await PagedList<MemberDto>.CreateAsync(query , likesParams.PageNumber , likesParams.PageSize);
    }

    public async Task<bool> SaveChangesAync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
