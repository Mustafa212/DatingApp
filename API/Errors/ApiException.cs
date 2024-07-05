namespace API;

public class ApiException(int statuscode , string message , string? detail )
{
    public int statuscode { get; set; } = statuscode;
    public string message { get; set; } = message;
    public string? detail { get; set; } = detail;
}
