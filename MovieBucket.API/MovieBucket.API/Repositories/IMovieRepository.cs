using MovieBucket.API.Models;
using MovieBucket.API.DTOs;

namespace MovieBucket.API.Repositories;

public interface IMovieRepository
{
    Task<IEnumerable<Movie>> GetAllAsync(MovieFilterDto filter);
    Task<Movie?> GetByIdAsync(int id);
    Task<Movie> CreateAsync(Movie movie);
    Task<Movie?> UpdateAsync(int id, Movie movie);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<int> GetTotalCountAsync(MovieFilterDto filter);
}
