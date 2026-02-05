using MovieBucket.API.DTOs;
using MovieBucket.API.Models;
using MovieBucket.API.Repositories;

namespace MovieBucket.API.Services;

public class MovieService : IMovieService
{
    private readonly IMovieRepository _repository;
    private readonly IFileUploadService _fileUpload;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public MovieService(IMovieRepository repository, IFileUploadService fileUpload, IHttpContextAccessor httpContextAccessor)
    {
        _repository = repository;
        _fileUpload = fileUpload;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<(IEnumerable<MovieResponseDto> Movies, int TotalCount)> GetMoviesAsync(MovieFilterDto filter)
    {
        var movies = await _repository.GetAllAsync(filter);
        var totalCount = await _repository.GetTotalCountAsync(filter);

        var movieDtos = movies.Select(m => MapToResponseDto(m));
        return (movieDtos, totalCount);
    }

    public async Task<MovieResponseDto?> GetMovieByIdAsync(int id)
    {
        var movie = await _repository.GetByIdAsync(id);
        return movie == null ? null : MapToResponseDto(movie);
    }

    public async Task<MovieResponseDto> CreateMovieAsync(CreateMovieDto createDto, IFormFile? poster)
    {
        var movie = new Movie
        {
            Title = createDto.Title,
            Genre = createDto.Genre,
            Rating = createDto.Rating,
            ReleaseDate = DateTime.SpecifyKind(createDto.ReleaseDate, DateTimeKind.Utc),
            Language = createDto.Language,
            VideoLink = createDto.VideoLink,
            Synopsis = createDto.Synopsis
        };

        if (poster != null)
        {
            movie.PosterPath = await _fileUpload.UploadFileAsync(poster, "uploads/posters");
        }

        var createdMovie = await _repository.CreateAsync(movie);
        return MapToResponseDto(createdMovie);
    }

    private MovieResponseDto MapToResponseDto(Movie movie)
    {
        var request = _httpContextAccessor.HttpContext?.Request;
        var baseUrl = $"{request?.Scheme}://{request?.Host}";

        return new MovieResponseDto
        {
            Id = movie.Id,
            Title = movie.Title,
            Genre = movie.Genre,
            Rating = movie.Rating,
            ReleaseDate = movie.ReleaseDate,
            Language = movie.Language,
            VideoLink = movie.VideoLink,
            PosterUrl = !string.IsNullOrEmpty(movie.PosterPath) ? $"{baseUrl}/{movie.PosterPath}" : null,
            Synopsis = movie.Synopsis,
            CreatedAt = movie.CreatedAt,
            UpdatedAt = movie.UpdatedAt
        };
    }

    public async Task<MovieResponseDto?> UpdateMovieAsync(int id, UpdateMovieDto updateDto, IFormFile? poster)
    {
        var movieToUpdate = await _repository.GetByIdAsync(id);
        if (movieToUpdate == null) return null;

        movieToUpdate.Title = updateDto.Title;
        movieToUpdate.Genre = updateDto.Genre;
        movieToUpdate.Rating = updateDto.Rating;
        movieToUpdate.ReleaseDate = DateTime.SpecifyKind(updateDto.ReleaseDate, DateTimeKind.Utc);
        movieToUpdate.Language = updateDto.Language;
        movieToUpdate.VideoLink = updateDto.VideoLink;
        movieToUpdate.Synopsis = updateDto.Synopsis;

        if (poster != null)
        {
            if (!string.IsNullOrEmpty(movieToUpdate.PosterPath))
            {
                _fileUpload.DeleteFile(movieToUpdate.PosterPath);
            }

            movieToUpdate.PosterPath = await _fileUpload.UploadFileAsync(poster, "uploads/posters");
        }

        var updatedMovie = await _repository.UpdateAsync(id, movieToUpdate);
        return updatedMovie == null ? null : MapToResponseDto(updatedMovie);
    }

    public async Task<bool> DeleteMovieAsync(int id)
    {
        var movie = await _repository.GetByIdAsync(id);
        if (movie == null) return false;

        if (!string.IsNullOrEmpty(movie.PosterPath))
        {
            _fileUpload.DeleteFile(movie.PosterPath);
        }

        return await _repository.DeleteAsync(id);
    }

}
