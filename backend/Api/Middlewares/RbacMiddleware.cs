using System.Security.Claims;
using Data.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shared.Interfaces;

namespace Api.Middlewares;

/// <summary>
/// Sau khi JWT Supabase hợp lệ: nạp profile từ DB, chặn tài khoản bị khóa, gán role vào claim
/// (để [Authorize(Roles = "admin")] hoạt động) và gán ActorId/Role vào IActorContext cho tầng Business.
/// Role luôn lấy từ DB, không tin claim trong token.
/// </summary>
public class RbacMiddleware
{
    private readonly RequestDelegate _next;

    public RbacMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ApplicationDbContext dbContext, IActorContext actorContext)
    {
        if (context.User.Identity is ClaimsIdentity { IsAuthenticated: true } identity)
        {
            var isAllowAnonymous = context.GetEndpoint()?.Metadata.GetMetadata<IAllowAnonymous>() != null;
            var userIdStr = identity.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? identity.FindFirst("sub")?.Value;

            var profile = Guid.TryParse(userIdStr, out var userId)
                ? await dbContext.Profiles.AsNoTracking().FirstOrDefaultAsync(p => p.Id == userId)
                : null;

            if (profile is not { IsActive: true })
            {
                // Endpoint public vẫn chạy như khách; endpoint cần đăng nhập thì chặn.
                if (!isAllowAnonymous)
                {
                    await WriteProblem(context, StatusCodes.Status403Forbidden, "Tài khoản bị từ chối truy cập",
                        "Tài khoản của bạn đã bị khóa hoặc không tồn tại trong hệ thống.");
                    return;
                }
            }
            else
            {
                foreach (var claim in identity.FindAll(c => c.Type == ClaimTypes.Role || c.Type == "role").ToList())
                    identity.RemoveClaim(claim);
                identity.AddClaim(new Claim(ClaimTypes.Role, profile.Role));

                actorContext.ActorId = profile.Id;
                actorContext.Role = profile.Role;
            }
        }

        await _next(context);
    }

    private static Task WriteProblem(HttpContext context, int status, string title, string detail)
    {
        context.Response.StatusCode = status;
        return context.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = status,
            Title = title,
            Detail = detail,
            Instance = context.Request.Path,
        }, options: null, contentType: "application/problem+json");
    }
}
