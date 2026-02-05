namespace MovieBucket.API.DTOs
{
    public class MovieFilterDto
    {
        public string? SearchTerm { get; set; }
        public string? Genre { get; set; }
        public string? Language { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? SortBy { get; set; }
        public string? SortOrder { get; set; } = "asc";
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

    }
}
