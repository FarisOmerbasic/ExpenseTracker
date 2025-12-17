using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Repositories;

public class AccountRepository : IAccountRepository
{
    private readonly ExpenseTrackerDbContext _db;

    public AccountRepository(ExpenseTrackerDbContext db)
    {
        _db = db;
    }

    public Task<Account?> GetAsync(int id, CancellationToken ct = default) =>
        _db.Accounts.FirstOrDefaultAsync(a => a.AccountId == id, ct);

    public async Task<IReadOnlyList<Account>> GetByUserAsync(int userId, CancellationToken ct = default) =>
        await _db.Accounts
            .Where(a => a.UserId == userId)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<Account> AddAsync(Account account, CancellationToken ct = default)
    {
        _db.Accounts.Add(account);
        await _db.SaveChangesAsync(ct);
        return account;
    }

    public async Task UpdateAsync(Account account, CancellationToken ct = default)
    {
        _db.Accounts.Update(account);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Account account, CancellationToken ct = default)
    {
        _db.Accounts.Remove(account);
        await _db.SaveChangesAsync(ct);
    }
}
