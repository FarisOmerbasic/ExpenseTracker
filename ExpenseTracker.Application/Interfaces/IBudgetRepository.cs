using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Interfaces;

public interface IBudgetRepository
{
    Task<Budget?> GetAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<Budget>> GetByUserAsync(int userId, CancellationToken ct = default);
    Task<Budget> AddAsync(Budget budget, CancellationToken ct = default);
    Task UpdateAsync(Budget budget, CancellationToken ct = default);
    Task DeleteAsync(Budget budget, CancellationToken ct = default);
}
