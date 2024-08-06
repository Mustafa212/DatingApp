using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class PagedList<T>:List<T>
{
    public PagedList(IEnumerable<T> items,int count,int pageNumebr,int pageSize)
    {
        TotalCount = count;
        TotalPages = (int)Math.Ceiling(count / (double) pageSize);
        CurrentPage = pageNumebr;
        PageSize = pageSize;
        AddRange(items);
          
    }
    public int TotalCount { get; set; }
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }


    public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source , int pageNumebr , int pageSize){
        var count = await source.CountAsync();
        var items  = await source.Skip((pageNumebr-1) *pageSize).Take(pageSize).ToListAsync();


        return new PagedList<T>(items , count , pageNumebr , pageSize);
    }
}
