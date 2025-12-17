using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly ExpenseTrackerDbContext _db;

    public CategoryRepository(ExpenseTrackerDbContext db)
    {
        _db = db;
    }

    public Task<Category?> GetAsync(int id, CancellationToken ct = default) =>
        _db.Categories.FirstOrDefaultAsync(c => c.CategoryId == id, ct);

    public async Task<IReadOnlyList<Category>> GetByUserAsync(int userId, CancellationToken ct = default) =>
        await _db.Categories
            .Where(c => c.UserId == userId)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<Category> AddAsync(Category category, CancellationToken ct = default)
    {
        _db.Categories.Add(category);
        await _db.SaveChangesAsync(ct);
        return category;
    }

    public async Task UpdateAsync(Category category, CancellationToken ct = default)
    {
        _db.Categories.Update(category);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Category category, CancellationToken ct = default)
    {
        _db.Categories.Remove(category);
        await _db.SaveChangesAsync(ct);
    }
}
