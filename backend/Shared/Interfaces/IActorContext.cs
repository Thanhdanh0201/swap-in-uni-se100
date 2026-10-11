namespace Shared.Interfaces;

/// <summary>
/// Người dùng của request hiện tại. RbacMiddleware gán sau khi xác thực JWT; null với khách.
/// </summary>
public interface IActorContext
{
    Guid? ActorId { get; set; }
    string? Role { get; set; }

    Guid RequireActorId();
    bool IsAdmin { get; }
}
