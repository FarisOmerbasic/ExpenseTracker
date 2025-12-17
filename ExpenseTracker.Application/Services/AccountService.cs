using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Services;

public class AccountService
{
    private readonly IAccountRepository _accounts;

    public AccountService(IAccountRepository accounts)
    {
        _accounts = accounts;
    }

    public async Task<IReadOnlyList<AccountDto>> GetByUserAsync(int userId, CancellationToken ct = default)
    {
        var items = await _accounts.GetByUserAsync(userId, ct);
        return items
            .Select(a => new AccountDto
            {
                AccountId = a.AccountId,
                UserId = a.UserId,
                Name = a.Name,
                Type = a.Type,
                InitialBalance = a.InitialBalance,
                CurrentBalance = a.CurrentBalance
            })
            .ToList();
    }

    public async Task<AccountDto?> GetAsync(int id, CancellationToken ct = default)
    {
        var entity = await _accounts.GetAsync(id, ct);
        return entity is null
            ? null
            : new AccountDto
            {
                AccountId = entity.AccountId,
                UserId = entity.UserId,
                Name = entity.Name,
                Type = entity.Type,
                InitialBalance = entity.InitialBalance,
                CurrentBalance = entity.CurrentBalance
            };
    }

    public async Task<AccountDto> CreateAsync(CreateAccountDto dto, CancellationToken ct = default)
    {
        var entity = new Account
        {
            UserId = dto.UserId,
            Name = dto.Name,
            Type = dto.Type,
            InitialBalance = dto.InitialBalance,
            CurrentBalance = dto.CurrentBalance
        };

        await _accounts.AddAsync(entity, ct);

        return new AccountDto
        {
            AccountId = entity.AccountId,
            UserId = entity.UserId,
            Name = entity.Name,
            Type = entity.Type,
            InitialBalance = entity.InitialBalance,
            CurrentBalance = entity.CurrentBalance
        };
    }

    public async Task<bool> UpdateAsync(int id, CreateAccountDto dto, CancellationToken ct = default)
    {
        var existing = await _accounts.GetAsync(id, ct);
        if (existing is null) return false;

        existing.UserId = dto.UserId;
        existing.Name = dto.Name;
        existing.Type = dto.Type;
        existing.InitialBalance = dto.InitialBalance;
        existing.CurrentBalance = dto.CurrentBalance;

        await _accounts.UpdateAsync(existing, ct);
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var existing = await _accounts.GetAsync(id, ct);
        if (existing is null) return false;

        await _accounts.DeleteAsync(existing, ct);
        return true;
    }
}
