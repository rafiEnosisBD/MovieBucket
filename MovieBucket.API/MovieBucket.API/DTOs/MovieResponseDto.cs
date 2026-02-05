namespace MovieBucket.API.DTOs
{
    public class MovieResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Language { get; set; } = string.Empty;
        public string? VideoLink { get; set; }
        public string? PosterUrl { get; set; }
        public string Synopsis { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}
