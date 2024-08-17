using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController(ILikeRepository likeRepository):BaseApiController
{
    [HttpPost("{targerUserId:int}")]
    public async Task<ActionResult> ToggleLike(int targerUserId){
        var sourceUserId = User.GetUserId();

        if(sourceUserId == targerUserId){
            return BadRequest("sry u so handsome but cant like yourself");
        }

        var existingLike = await likeRepository.GetUserLikeAync(sourceUserId ,targerUserId);

        if (existingLike == null)
        {
            var like = new UserLike{
                SourceUserId = sourceUserId,
                TargetUserId = targerUserId
            };

            likeRepository.AddLike(like);
        }
        else{
            likeRepository.DeleteLike(existingLike);

        }


        if (await likeRepository.SaveChangesAync())
        {
            return Ok();
        }
        return BadRequest("failed to like this hooman");

    }



    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<int>>> GetCurrentUserLikeIds(){
        return Ok(await likeRepository.GetCurrentUserLikeIdsAync(User.GetUserId()));
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetuserLikes([FromQuery]LikesParams likesParams){

        likesParams.UserId = User.GetUserId();

        var users = await likeRepository.GetUserLikesAync(likesParams);

        Response.AddPaginationHeaders(users);
        return Ok(users);


    }
}
