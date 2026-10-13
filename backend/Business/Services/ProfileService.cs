using Business.DTOs;
using Business.Interfaces;
using Data.Repositories;
using Shared.Exceptions;
using Shared.Interfaces;

namespace Business.Services;

public class ProfileService : IProfileService
{
    private readonly IUnitOfWork _uow;
    private readonly IActorContext _actor;

    public ProfileService(IUnitOfWork uow, IActorContext actor)
    {
        _uow = uow;
        _actor = actor;
    }

    public async Task<MeDto> GetMeAsync(CancellationToken ct = default)
    {
        var p = await _uow.Profiles.GetByIdAsync(_actor.RequireActorId(), ct)
            ?? throw AppException.NotFound("Không tìm thấy hồ sơ.");
        return new MeDto(p.Id, p.Email, p.FullName, p.AvatarUrl, p.StudentId, p.Phone, p.Role, p.IsUitVerified);
    }
}
