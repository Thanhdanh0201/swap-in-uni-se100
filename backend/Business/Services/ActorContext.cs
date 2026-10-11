using Shared.Constants;
using Shared.Interfaces;

namespace Business.Services;

public class ActorContext : IActorContext
{
    public Guid? ActorId { get; set; }
    public string? Role { get; set; }

    public bool IsAdmin => Role == Roles.Admin;

    public Guid RequireActorId() =>
        ActorId ?? throw new UnauthorizedAccessException("Bạn cần đăng nhập để thực hiện thao tác này.");
}
