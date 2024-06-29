namespace API;

public class AppUser
{
    public int Id { get; set; }
    public required string UserName { get; set;}
    public required byte[] PasswrodHash { get; set; }
    public required byte[] PasswrodSalt { get; set; }



}
