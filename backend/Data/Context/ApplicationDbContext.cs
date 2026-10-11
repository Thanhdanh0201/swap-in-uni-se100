using System.Text.RegularExpressions;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Constants;

namespace Data.Context;

/// <summary>
/// Khung: mới có bảng profiles. Thêm entity theo docs/DATABASE.md rồi tạo migration.
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Profiles> Profiles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Profiles>(e =>
        {
            e.ToTable("profiles", t => t.HasCheckConstraint("ck_profiles_role", In("role", Roles.Student, Roles.Admin)));
            // Id lấy từ auth.users, không tự sinh. FK tới auth.users tạo bằng migrationBuilder.Sql (EF không quản schema auth).
            e.Property(x => x.Id).ValueGeneratedNever();
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.Role).HasDefaultValue(Roles.Student);
            e.Property(x => x.IsActive).HasDefaultValue(true);
        });

        ApplyConventions(modelBuilder);
    }

    // Postgres dùng snake_case; Id Guid sinh bằng gen_random_uuid(); CreatedAt/UpdatedAt mặc định now().
    private static void ApplyConventions(ModelBuilder modelBuilder)
    {
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            entity.SetTableName(entity.GetTableName() is { } table && table.Contains('_') ? table : ToSnakeCase(entity.ClrType.Name));

            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(ToSnakeCase(property.Name));

                if (property.Name == "Id" && property.ClrType == typeof(Guid) && property.ValueGenerated != Microsoft.EntityFrameworkCore.Metadata.ValueGenerated.Never)
                    property.SetDefaultValueSql("gen_random_uuid()");

                if (property.Name is "CreatedAt" or "UpdatedAt")
                    property.SetDefaultValueSql("now()");
            }

            foreach (var key in entity.GetKeys())
                key.SetName(ToSnakeCase(key.GetName()!));
            foreach (var fk in entity.GetForeignKeys())
                fk.SetConstraintName(ToSnakeCase(fk.GetConstraintName()!));
            foreach (var index in entity.GetIndexes())
                index.SetDatabaseName(ToSnakeCase(index.GetDatabaseName()!));
        }
    }

    private static string In(string column, params string[] values) =>
        $"{column} IN ({string.Join(", ", values.Select(v => $"'{v}'"))})";

    private static string ToSnakeCase(string name) =>
        Regex.Replace(name, "([a-z0-9])([A-Z])", "$1_$2").ToLowerInvariant();
}
