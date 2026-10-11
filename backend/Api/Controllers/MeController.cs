using Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Responses;

namespace Api.Controllers;

[ApiController]
[Route("api/me")]
[Authorize]
public class MeController : ControllerBase
{
    private readonly IProfileService _profileService;

    public MeController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    /// <summary>Hồ sơ người dùng hiện tại (đăng nhập ở frontend bằng Supabase Auth, gửi Bearer token).</summary>
    [HttpGet]
    public async Task<IActionResult> GetMe(CancellationToken ct) => Ok(ApiResponse.Ok(await _profileService.GetMeAsync(ct)));
}
