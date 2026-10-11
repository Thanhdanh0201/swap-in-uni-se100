using System.Text;
using Api.Middlewares;
using Business.Interfaces;
using Business.Services;
using Data.Context;
using Data.Repositories;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Shared.Helpers;
using Shared.Interfaces;
using Supabase;

DotEnv.Load();

var builder = WebApplication.CreateBuilder(args);

// 1. Controllers, FluentValidation, lỗi validation theo RFC 7807 ProblemDetails
builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var problemDetails = new ValidationProblemDetails(context.ModelState)
        {
            Title = "Dữ liệu yêu cầu không hợp lệ",
            Status = StatusCodes.Status400BadRequest,
            Instance = context.HttpContext.Request.Path
        };
        return new BadRequestObjectResult(problemDetails) { ContentTypes = { "application/problem+json" } };
    };
});
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<ProfileService>();

// 2. PostgreSQL (Supabase) qua EF Core
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IActorContext, ActorContext>();

// 3. Supabase client service role: dành cho Storage (upload ảnh). Không bao giờ gửi key này xuống frontend.
var supabaseUrl = (builder.Configuration["SUPABASE_URL"] ?? builder.Configuration["Supabase:Url"] ?? string.Empty).TrimEnd('/');
var serviceRoleKey = builder.Configuration["SUPABASE_SERVICE_ROLE_KEY"] ?? builder.Configuration["Supabase:ServiceRoleKey"] ?? string.Empty;
builder.Services.AddKeyedScoped<Client>("admin", (_, _) =>
    new Client(supabaseUrl, serviceRoleKey, new SupabaseOptions { AutoRefreshToken = false, AutoConnectRealtime = false }));

// 4. Services (Business)
builder.Services.AddScoped<IProfileService, ProfileService>();
// Thêm service mới ở đây (xem docs/TODO.md).

// 5. Xác thực JWT do Supabase Auth phát (frontend gửi header Authorization: Bearer <access_token>).
// Project mới của Supabase ký ES256: lấy public key từ JWKS; project cũ dùng HS256 với JWT secret.
var jwtSecret = builder.Configuration["SUPABASE_JWT_SECRET"] ?? builder.Configuration["Supabase:JwtSecret"] ?? string.Empty;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;

        JsonWebKeySet? jwks = null;
        try
        {
            using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
            jwks = new JsonWebKeySet(http.GetStringAsync($"{supabaseUrl}/auth/v1/.well-known/jwks.json").Result);
        }
        catch
        {
            // Offline hoặc chưa cấu hình SUPABASE_URL: rơi về JWT secret.
        }

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"{supabaseUrl}/auth/v1",
            ValidateAudience = true,
            ValidAudience = "authenticated",
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.FromSeconds(30),
            IssuerSigningKeys = jwks?.GetSigningKeys() is { Count: > 0 } keys
                ? keys
                : [new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret.PadRight(32)))],
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SwapInUni API v1"));
}

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseRouting();
app.UseAuthentication();
app.UseMiddleware<RbacMiddleware>();
app.UseAuthorization();
app.MapControllers();

app.Run();
