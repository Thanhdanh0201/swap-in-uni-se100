using Data.Entities;
using Microsoft.EntityFrameworkCore.Storage;

namespace Data.Repositories;

/// <summary>
/// Gom repository dùng chung một DbContext; SaveChangesAsync ghi mọi thay đổi trong một lần.
/// Cần truy vấn riêng cho bảng nào thì tạo I{Bảng}Repository kế thừa IBaseRepository và thay vào đây.
/// </summary>
public interface IUnitOfWork : IDisposable, IAsyncDisposable
{
    IBaseRepository<Profiles> Profiles { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);
}
