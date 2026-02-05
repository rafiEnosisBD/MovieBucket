using Microsoft.AspNetCore.Mvc;
using MovieBucket.API.DTOs;
using MovieBucket.API.Services;

namespace MovieBucket.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly IMovieService _movieService;

    public MoviesController(IMovieService movieService)
    {
        _movieService = movieService;
    }

    // Get all movies with optional filtering, sorting, and pagination
    [HttpGet]
    public async Task<IActionResult> GetMovies([FromQuery] MovieFilterDto filter)
    {
        var (movies, totalCount) = await _movieService.GetMoviesAsync(filter);

        return Ok(new
        {
            Data = movies,
            TotalCount = totalCount,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize
        });
    }

    // Get a specific movie by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetMovie(int id)
    {
        var movie = await _movieService.GetMovieByIdAsync(id);

        if (movie == null)
            return NotFound(new { Message = "Movie not found" });

        return Ok(movie);
    }

    // Create a new movie
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateMovie([FromForm] CreateMovieDto createDto, [FromForm] IFormFile? poster)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var movie = await _movieService.CreateMovieAsync(createDto, poster);
        return CreatedAtAction(nameof(GetMovie), new { id = movie.Id }, movie);
    }


    //Update an existing movie
    [HttpPut("{id}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateMovie(int id, [FromForm] UpdateMovieDto updateDto, [FromForm] IFormFile? poster)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var movie = await _movieService.UpdateMovieAsync(id, updateDto, poster);

        if (movie == null)
            return NotFound(new { Message = "Movie not found" });

        return Ok(movie);
    }

    // Delete a movie
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMovie(int id)
    {
        var deleted = await _movieService.DeleteMovieAsync(id);

        if (!deleted)
            return NotFound(new { Message = "Movie not found" });

        return NoContent();
    }
}
