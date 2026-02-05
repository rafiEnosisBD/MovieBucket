using Microsoft.EntityFrameworkCore;
using MovieBucket.API.Data;
using MovieBucket.API.Models;
using MovieBucket.API.DTOs;

namespace MovieBucket.API.Repositories;

public class MovieRepository : IMovieRepository
{
    private readonly ApplicationDbContext _context;

    public MovieRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Movie>> GetAllAsync(MovieFilterDto filter)
    {
        var query = _context.Movies.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
            query = query.Where(m => m.Title.ToLower().Contains(filter.SearchTerm.ToLower()));
        }

        if (!string.IsNullOrWhiteSpace(filter.Genre))
        {
            query = query.Where(m => m.Genre == filter.Genre);
        }

        if (!string.IsNullOrWhiteSpace(filter.Language))
        {
            query = query.Where(m => m.Language == filter.Language);
        }

        if (filter.StartDate.HasValue)
        {
            var startDateUtc = filter.StartDate.Value.Kind == DateTimeKind.Utc
                ? filter.StartDate.Value
                : filter.StartDate.Value.ToUniversalTime();

            query = query.Where(m => m.ReleaseDate >= startDateUtc);
        }

        if (filter.EndDate.HasValue)
        {
            var endDateUtc = filter.EndDate.Value.Kind == DateTimeKind.Utc
                ? filter.EndDate.Value
                : filter.EndDate.Value.ToUniversalTime();

            query = query.Where(m => m.ReleaseDate <= endDateUtc);
        }


        if (!string.IsNullOrWhiteSpace(filter.SortBy))
        {
            var isDescending = filter.SortOrder?.ToLower() == "desc";

            query = filter.SortBy.ToLower() switch
            {
                "title" => isDescending ? query.OrderByDescending(m => m.Title) : query.OrderBy(m => m.Title),
                "genre" => isDescending ? query.OrderByDescending(m => m.Genre) : query.OrderBy(m => m.Genre),
                "releasedate" => isDescending ? query.OrderByDescending(m => m.ReleaseDate) : query.OrderBy(m => m.ReleaseDate),
                "language" => isDescending ? query.OrderByDescending(m => m.Language) : query.OrderBy(m => m.Language),
                _ => query
            };
        }

        var skip = (filter.PageNumber - 1) * filter.PageSize;
        query = query.Skip(skip).Take(filter.PageSize);

        return await query.ToListAsync();
    }

    public async Task<Movie?> GetByIdAsync(int id)
    {
        return await _context.Movies.FindAsync(id);
    }

    public async Task<Movie> CreateAsync(Movie movie)
    {
        _context.Movies.Add(movie);
        await _context.SaveChangesAsync();
        return movie;
    }

    public async Task<Movie?> UpdateAsync(int id, Movie movie)
    {
        var existingMovie = await _context.Movies.FindAsync(id);
        if (existingMovie == null) return null;

        existingMovie.Title = movie.Title;
        existingMovie.Genre = movie.Genre;
        existingMovie.Rating = movie.Rating;
        existingMovie.ReleaseDate = movie.ReleaseDate;
        existingMovie.Language = movie.Language;
        existingMovie.VideoLink = movie.VideoLink;
        existingMovie.Synopsis = movie.Synopsis;
        if (!string.IsNullOrEmpty(movie.PosterPath))
            existingMovie.PosterPath = movie.PosterPath;

        await _context.SaveChangesAsync();
        return existingMovie;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var movie = await _context.Movies.FindAsync(id);
        if (movie == null) return false;

        _context.Movies.Remove(movie);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Movies.AnyAsync(m => m.Id == id);
    }

    public async Task<int> GetTotalCountAsync(MovieFilterDto filter)
    {
        var query = _context.Movies.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            query = query.Where(m => m.Title.ToLower().Contains(filter.SearchTerm.ToLower()));

        if (!string.IsNullOrWhiteSpace(filter.Genre))
            query = query.Where(m => m.Genre == filter.Genre);

        if (!string.IsNullOrWhiteSpace(filter.Language))
            query = query.Where(m => m.Language == filter.Language);

        if (filter.StartDate.HasValue)
        {
            var startDateUtc = filter.StartDate.Value.Kind == DateTimeKind.Utc
                ? filter.StartDate.Value
                : filter.StartDate.Value.ToUniversalTime();

            query = query.Where(m => m.ReleaseDate >= startDateUtc);
        }

        if (filter.EndDate.HasValue)
        {
            var endDateUtc = filter.EndDate.Value.Kind == DateTimeKind.Utc
                ? filter.EndDate.Value
                : filter.EndDate.Value.ToUniversalTime();

            query = query.Where(m => m.ReleaseDate <= endDateUtc);
        }


        return await query.CountAsync();
    }
}
