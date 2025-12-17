using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Repositories;

public class ExpenseRepository : IExpenseRepository
{
    private readonly ExpenseTrackerDbContext _db;
    public ExpenseRepository(ExpenseTrackerDbContext db) => _db = db;

    public Task<Expense?> GetAsync(int id, CancellationToken ct = default) =>
        _db.Expenses.Include(e => e.Category).Include(e => e.PaymentMethod)
            .FirstOrDefaultAsync(e => e.ExpenseId == id, ct);

    public async Task<IReadOnlyList<Expense>> GetByUserAsync(int userId, CancellationToken ct = default) =>
        await _db.Expenses.Where(e => e.UserId == userId)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<Expense> AddAsync(Expense expense, CancellationToken ct = default){

        _db.Expenses.Add(expense);
        await _db.SaveChangesAsync(ct);
        return expense;
    }

    public async Task UpdateAsync(Expense expense, CancellationToken ct = default) {
        
        _db.Expenses.Update(expense);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Expense expense, CancellationToken ct = default)
    {
        _db.Expenses.Remove(expense);
        await _db.SaveChangesAsync(ct);
    }
}
