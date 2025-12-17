using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Services;

public class ExpenseService
{
    private readonly IExpenseRepository _expenses;

    public ExpenseService(IExpenseRepository expenses)
    {
        _expenses = expenses;
    }

    public async Task<ExpenseDto?> GetAsync(int id, CancellationToken ct = default)
    {
        var entity = await _expenses.GetAsync(id, ct);
        return entity is null ? null : Map(entity);
    }

    public async Task<IReadOnlyList<ExpenseDto>> GetByUserAsync(int userId, CancellationToken ct = default)
    {
        var items = await _expenses.GetByUserAsync(userId, ct);
        return items.Select(Map).ToList();
    }

    public async Task<ExpenseDto> CreateAsync(CreateExpenseDto dto, CancellationToken ct = default)
    {
        var entity = new Expense
        {
            UserId = dto.UserId,
            CategoryId = dto.CategoryId,
            PaymentMethodId = dto.PaymentMethodId,
            Amount = dto.Amount,
            Date = dto.Date,
            Description = dto.Description
        };

        await _expenses.AddAsync(entity, ct);
        return Map(entity);
    }

    public async Task<bool> UpdateAsync(int id, CreateExpenseDto dto, CancellationToken ct = default)
    {
        var existing = await _expenses.GetAsync(id, ct);
        if (existing is null) return false;

        existing.UserId = dto.UserId;
        existing.CategoryId = dto.CategoryId;
        existing.PaymentMethodId = dto.PaymentMethodId;
        existing.Amount = dto.Amount;
        existing.Date = dto.Date;
        existing.Description = dto.Description;

        await _expenses.UpdateAsync(existing, ct);
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var existing = await _expenses.GetAsync(id, ct);
        if (existing is null) return false;

        await _expenses.DeleteAsync(existing, ct);
        return true;
    }

    private static ExpenseDto Map(Expense expense) =>
        new()
        {
            ExpenseId = expense.ExpenseId,
            UserId = expense.UserId,
            CategoryId = expense.CategoryId,
            PaymentMethodId = expense.PaymentMethodId,
            Amount = expense.Amount,
            Date = expense.Date,
            Description = expense.Description
        };
}
