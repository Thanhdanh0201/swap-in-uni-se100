namespace Shared.Constants;

/// <summary>
/// Vai trò lưu ở profiles.role. RbacMiddleware nạp role từ DB vào claim để dùng [Authorize(Roles = ...)].
/// </summary>
public static class Roles
{
    public const string Student = "student";
    public const string Admin = "admin";
}
