namespace MovieBucket.API.Services;

public class FileUploadService : IFileUploadService
{
    private readonly IWebHostEnvironment _environment;
    private readonly long _maxFileSize = 5 * 1024 * 1024;
    private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

    public FileUploadService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string?> UploadFileAsync(IFormFile file, string folderPath)
    {
        if (file == null || file.Length == 0)
            return null;

        if (!IsValidImage(file))
            return null;

        var uploadPath = Path.Combine(_environment.WebRootPath, folderPath);
        if (!Directory.Exists(uploadPath))
            Directory.CreateDirectory(uploadPath);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Path.Combine(folderPath, fileName).Replace("\\", "/");
    }

    public bool DeleteFile(string filePath)
    {
        if (string.IsNullOrEmpty(filePath)) return false;

        var fullPath = Path.Combine(_environment.WebRootPath, filePath);
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
            return true;
        }
        return false;
    }

    public bool IsValidImage(IFormFile file)
    {
        if (file.Length > _maxFileSize) return false;

        var extension = Path.GetExtension(file.FileName).ToLower();
        return _allowedExtensions.Contains(extension);
    }
}

