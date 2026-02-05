using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieBucket.API.Models
{
    public class Movie
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Genre { get; set; } = string.Empty;

        [Required]
        [Range(1, 10)]
        [Column(TypeName = "decimal(3, 1)")]
        public decimal Rating { get; set; }

        [Required]
        public DateTime ReleaseDate { get; set; }

        [Required]
        [MaxLength(50)]
        public string Language { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? VideoLink { get; set; }

        [MaxLength(500)]
        public string? PosterPath { get; set; }

        [Required]
        public string Synopsis { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    }
}
