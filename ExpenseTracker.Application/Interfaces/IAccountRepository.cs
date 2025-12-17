using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Interfaces;

public interface IAccountRepository
{
    Task<Account?> GetAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<Account>> GetByUserAsync(int userId, CancellationToken ct = default);
    Task<Account> AddAsync(Account account, CancellationToken ct = default);
    Task UpdateAsync(Account account, CancellationToken ct = default);
    Task DeleteAsync(Account account, CancellationToken ct = default);
}
