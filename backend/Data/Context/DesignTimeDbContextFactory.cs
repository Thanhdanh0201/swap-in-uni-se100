using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Shared.Helpers;

namespace Data.Context;

/// <summary>
/// Cho lệnh dotnet ef. "migrations add" không cần DB; "database update" dùng
/// ConnectionStrings__DefaultConnection trong backend/.env.
/// </summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        DotEnv.Load();
        var connection = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? "Host=localhost;Database=postgres;Username=postgres;Password=postgres";
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseNpgsql(connection)
            .Options;
        return new ApplicationDbContext(options);
    }
}
