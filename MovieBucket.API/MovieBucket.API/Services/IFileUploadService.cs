namespace MovieBucket.API.Services;

public interface IFileUploadService
{
    Task<string?> UploadFileAsync(IFormFile file, string folderPath);
    bool DeleteFile(string filePath);
    bool IsValidImage(IFormFile file);
}
