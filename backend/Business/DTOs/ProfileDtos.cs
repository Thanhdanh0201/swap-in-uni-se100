namespace Business.DTOs;

public record MeDto(Guid Id, string Email, string FullName, string? AvatarUrl, string? StudentId, string? Phone, string Role, bool IsUitVerified);
