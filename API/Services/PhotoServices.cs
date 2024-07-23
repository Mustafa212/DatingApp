using API.interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services;

public class PhotoServices : IPhotoService
{
    private readonly Cloudinary _cloudinary;
    public PhotoServices(IOptions<CloudinarySettings> config)
    {
        var acc = new Account(config.Value.CloudName ,config.Value.ApiKey ,config.Value.ApiSecret );
        _cloudinary = new Cloudinary(acc);
    }
    public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
    {
        var UploadImage=new ImageUploadResult();
        if (file.Length>0)
        {
            using var stream = file.OpenReadStream();
            var Uploadparams = new ImageUploadParams{
                File = new FileDescription( file.FileName,stream),
                Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
                Folder = "ILY-DatingApp"
            };
            UploadImage = await _cloudinary.UploadAsync(Uploadparams);
        }
        return UploadImage;
    }

    public async Task<DeletionResult> DeletePhotoAsync(string publicId)
    {
        var deleteparams = new DeletionParams(publicId);
        return await _cloudinary.DestroyAsync(deleteparams);
    }
}
