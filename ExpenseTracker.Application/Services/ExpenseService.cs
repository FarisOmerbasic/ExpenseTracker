using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Services;

public class ExpenseService
{
    private readonly IExpenseRepository _expenses;
    private readonly IAccountRepository _accounts;

    public ExpenseService(IExpenseRepository expenses, IAccountRepository accounts)
    {
        _expenses = expenses;
        _accounts = accounts;
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
            AccountId = dto.AccountId,
            Amount = dto.Amount,
            Date = dto.Date,
            Description = dto.Description
        };

        await _expenses.AddAsync(entity, ct);

        
        if (dto.AccountId.HasValue)
        {
            var account = await _accounts.GetAsync(dto.AccountId.Value, ct);
            if (account is not null)
            {
                account.CurrentBalance -= dto.Amount;
                await _accounts.UpdateAsync(account, ct);
            }
        }

        return Map(entity);
    }

    public async Task<bool> UpdateAsync(int id, CreateExpenseDto dto, CancellationToken ct = default)
    {
        var existing = await _expenses.GetAsync(id, ct);
        if (existing is null) return false;

        
        if (existing.AccountId.HasValue)
        {
            var oldAccount = await _accounts.GetAsync(existing.AccountId.Value, ct);
            if (oldAccount is not null)
            {
                oldAccount.CurrentBalance += existing.Amount;
                await _accounts.UpdateAsync(oldAccount, ct);
            }
        }

        existing.UserId = dto.UserId;
        existing.CategoryId = dto.CategoryId;
        existing.PaymentMethodId = dto.PaymentMethodId;
        existing.AccountId = dto.AccountId;
        existing.Amount = dto.Amount;
        existing.Date = dto.Date;
        existing.Description = dto.Description;

        await _expenses.UpdateAsync(existing, ct);

        
        if (dto.AccountId.HasValue)
        {
            var newAccount = await _accounts.GetAsync(dto.AccountId.Value, ct);
            if (newAccount is not null)
            {
                newAccount.CurrentBalance -= dto.Amount;
                await _accounts.UpdateAsync(newAccount, ct);
            }
        }

        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var existing = await _expenses.GetAsync(id, ct);
        if (existing is null) return false;

        
        if (existing.AccountId.HasValue)
        {
            var account = await _accounts.GetAsync(existing.AccountId.Value, ct);
            if (account is not null)
            {
                account.CurrentBalance += existing.Amount;
                await _accounts.UpdateAsync(account, ct);
            }
        }

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
            AccountId = expense.AccountId,
            Amount = expense.Amount,
            Date = expense.Date,
            Description = expense.Description
        };
}
