using Business.DTOs;

namespace Business.Interfaces;

public interface IProfileService
{
    Task<MeDto> GetMeAsync(CancellationToken ct = default);
}
