using Business.Services;
using Data.Context;
using Data.Entities;
using Data.Repositories;
using Microsoft.EntityFrameworkCore;
using Shared.Exceptions;

namespace Business.Tests;

// Test mẫu: service dùng UnitOfWork trên DB InMemory, ActorContext giả lập người đăng nhập.
public class ProfileServiceTests
{
    private static ApplicationDbContext NewDb() =>
        new(new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);

    [Fact]
    public async Task Returns_profile_of_current_user()
    {
        var db = NewDb();
        var userId = Guid.NewGuid();
        db.Profiles.Add(new Profiles { Id = userId, Email = "sv@gm.uit.edu.vn", FullName = "Sinh viên" });
        db.SaveChanges();

        var me = await new ProfileService(new UnitOfWork(db), new ActorContext { ActorId = userId }).GetMeAsync();

        Assert.Equal("sv@gm.uit.edu.vn", me.Email);
    }

    [Fact]
    public async Task Guest_is_rejected()
    {
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            new ProfileService(new UnitOfWork(NewDb()), new ActorContext()).GetMeAsync());
    }

    [Fact]
    public async Task Missing_profile_is_not_found()
    {
        var ex = await Assert.ThrowsAsync<AppException>(() =>
            new ProfileService(new UnitOfWork(NewDb()), new ActorContext { ActorId = Guid.NewGuid() }).GetMeAsync());
        Assert.Equal(404, ex.StatusCode);
    }
}
