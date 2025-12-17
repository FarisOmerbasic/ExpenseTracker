using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Interfaces;

public interface IExpenseRepository
{
    Task<Expense?> GetAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<Expense>> GetByUserAsync(int userId, CancellationToken ct = default);
    Task<Expense> AddAsync(Expense expense, CancellationToken ct = default);
    Task UpdateAsync(Expense expense, CancellationToken ct = default);
    Task DeleteAsync(Expense expense, CancellationToken ct = default);
}
