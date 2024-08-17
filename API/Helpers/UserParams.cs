﻿namespace API.Helpers;

public class UserParams:PaginationParams
{

    
    public string? Gender { get; set; }
    public string? CurrentUserName { get; set; }
    public int minAge { get; set; } = 18;
    public int maxAge { get; set; } = 100;
    
    public string? OrderBy { get; set; } 

}
