using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Repositories;

public class BudgetRepository : IBudgetRepository
{
    private readonly ExpenseTrackerDbContext _db;

    public BudgetRepository(ExpenseTrackerDbContext db)
    {
        _db = db;
    }

    public Task<Budget?> GetAsync(int id, CancellationToken ct = default) =>
        _db.Budgets.FirstOrDefaultAsync(b => b.BudgetId == id, ct);

    public async Task<IReadOnlyList<Budget>> GetByUserAsync(int userId, CancellationToken ct = default) =>
        await _db.Budgets
            .Where(b => b.UserId == userId)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<Budget> AddAsync(Budget budget, CancellationToken ct = default)
    {
        _db.Budgets.Add(budget);
        await _db.SaveChangesAsync(ct);
        return budget;
    }

    public async Task UpdateAsync(Budget budget, CancellationToken ct = default)
    {
        _db.Budgets.Update(budget);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Budget budget, CancellationToken ct = default)
    {
        _db.Budgets.Remove(budget);
        await _db.SaveChangesAsync(ct);
    }
}
