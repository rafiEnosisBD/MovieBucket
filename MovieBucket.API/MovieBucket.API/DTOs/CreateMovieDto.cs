using System.ComponentModel.DataAnnotations;

namespace MovieBucket.API.DTOs
{
    public class CreateMovieDto
    {
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(255, ErrorMessage = "Title cannot exceed 255 characters")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Genre is required")]
        public string Genre { get; set; } = string.Empty;

        [Required(ErrorMessage = "Rating is required")]
        [Range(1, 10, ErrorMessage = "Rating must be between 1 and 10")]
        public decimal Rating { get; set; }

        [Required(ErrorMessage = "Release date is required")]
        public DateTime ReleaseDate { get; set; }

        [Required(ErrorMessage = "Language is required")]
        public string Language { get; set; } = string.Empty;

        [Url(ErrorMessage = "Invalid URL format")]
        public string? VideoLink { get; set; }

        [Required(ErrorMessage = "Synopsis is required")]
        public string Synopsis { get; set; } = string.Empty;

    }
}
