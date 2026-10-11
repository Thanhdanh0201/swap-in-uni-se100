using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore.Storage;

namespace Data.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _dbContext;
    private readonly Dictionary<Type, object> _repositories = new();

    public UnitOfWork(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IBaseRepository<Profiles> Profiles => Repo<Profiles>();

    private IBaseRepository<T> Repo<T>() where T : class
    {
        if (!_repositories.TryGetValue(typeof(T), out var repo))
        {
            repo = new BaseRepository<T>(_dbContext);
            _repositories[typeof(T)] = repo;
        }
        return (IBaseRepository<T>)repo;
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in _dbContext.ChangeTracker.Entries())
        {
            // updated_at không có trigger trong DB: cập nhật ở đây cho mọi entity có cột này.
            if (entry.State == Microsoft.EntityFrameworkCore.EntityState.Modified && entry.Metadata.FindProperty("UpdatedAt") != null)
                entry.Property("UpdatedAt").CurrentValue = DateTime.UtcNow;
        }
        return _dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default) =>
        _dbContext.Database.BeginTransactionAsync(cancellationToken);

    public void Dispose()
    {
        _dbContext.Dispose();
        GC.SuppressFinalize(this);
    }

    public async ValueTask DisposeAsync()
    {
        await _dbContext.DisposeAsync();
        GC.SuppressFinalize(this);
    }
}
