﻿using System.Security.Claims;

namespace API;

public static class ClaimsPrincipleExtensions
{
    public static string GetUsername(this ClaimsPrincipal claims){
        var username = claims.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("no username fonud in token");
        return username;
    }
}