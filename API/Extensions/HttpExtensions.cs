using System.Text.Json;
using API.Helpers;

namespace API.Extensions;

public static class HttpExtensions
{
    public static void AddPaginationHeaders<T>(this HttpResponse response , PagedList<T> data){

        var paginationHeaders = new PaginationHeaders(data.CurrentPage , data.PageSize  , data.TotalPages ,data.TotalCount);
        var jsonOptions = new JsonSerializerOptions{
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        } ;
        response.Headers.Append("Pagination",JsonSerializer.Serialize(paginationHeaders,jsonOptions));
        response.Headers.Append("Access-Control-Expose-Headers","Pagination");

    }
}
 