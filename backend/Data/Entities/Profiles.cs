namespace Data.Entities;

/// <summary>
/// Hồ sơ người dùng. Id trùng auth.users.id của Supabase; trigger handle_new_user tự tạo khi đăng ký.
/// </summary>
public class Profiles
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string? AvatarUrl { get; set; }
    public string? StudentId { get; set; }
    public string? Phone { get; set; }
    public string Role { get; set; } = "student";
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
