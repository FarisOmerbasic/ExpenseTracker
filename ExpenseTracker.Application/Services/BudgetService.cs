using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Services;

public class BudgetService
{
    private readonly IBudgetRepository _budgets;

    public BudgetService(IBudgetRepository budgets)
    {
        _budgets = budgets;
    }

    public async Task<IReadOnlyList<BudgetDto>> GetByUserAsync(int userId, CancellationToken ct = default)
    {
        var items = await _budgets.GetByUserAsync(userId, ct);
        return items
            .Select(b => new BudgetDto
            {
                BudgetId = b.BudgetId,
                UserId = b.UserId,
                CategoryId = b.CategoryId,
                Amount = b.Amount
            })
            .ToList();
    }

    public async Task<BudgetDto?> GetAsync(int id, CancellationToken ct = default)
    {
        var entity = await _budgets.GetAsync(id, ct);
        return entity is null
            ? null
            : new BudgetDto
            {
                BudgetId = entity.BudgetId,
                UserId = entity.UserId,
                CategoryId = entity.CategoryId,
                Amount = entity.Amount
            };
    }

    public async Task<BudgetDto> CreateAsync(CreateBudgetDto dto, CancellationToken ct = default)
    {
        var entity = new Budget
        {
            UserId = dto.UserId,
            CategoryId = dto.CategoryId,
            Amount = dto.Amount
        };

        await _budgets.AddAsync(entity, ct);

        return new BudgetDto
        {
            BudgetId = entity.BudgetId,
            UserId = entity.UserId,
            CategoryId = entity.CategoryId,
            Amount = entity.Amount
        };
    }

    public async Task<bool> UpdateAsync(int id, CreateBudgetDto dto, CancellationToken ct = default)
    {
        var existing = await _budgets.GetAsync(id, ct);
        if (existing is null) return false;

        existing.UserId = dto.UserId;
        existing.CategoryId = dto.CategoryId;
        existing.Amount = dto.Amount;

        await _budgets.UpdateAsync(existing, ct);
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var existing = await _budgets.GetAsync(id, ct);
        if (existing is null) return false;

        await _budgets.DeleteAsync(existing, ct);
        return true;
    }
}
