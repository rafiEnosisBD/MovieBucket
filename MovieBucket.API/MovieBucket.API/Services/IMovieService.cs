using MovieBucket.API.DTOs;

namespace MovieBucket.API.Services;

public interface IMovieService
{
    Task<(IEnumerable<MovieResponseDto> Movies, int TotalCount)> GetMoviesAsync(MovieFilterDto filter);
    Task<MovieResponseDto?> GetMovieByIdAsync(int id);
    Task<MovieResponseDto> CreateMovieAsync(CreateMovieDto createDto, IFormFile? poster);
    Task<MovieResponseDto?> UpdateMovieAsync(int id, UpdateMovieDto updateDto, IFormFile? poster);
    Task<bool> DeleteMovieAsync(int id);
}
